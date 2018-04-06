import {RNG_NETWORK} from '../../common/randomchannels.js';
import {ChipComponent, ChipType} from '../../components/chip.js';
import {CompositeComponent} from '../../components/composite.js';
import {ConnectionComponent} from '../../components/connection.js';
import {EntityManager} from '../../entity/manager.js';
import {IpComponent, NO_IP} from '../../components/ip.js';
import {Random} from '../../../stdlib/random.js';
import {firstOf, sameElements, shuffle} from '../../../stdlib/collections.js';
import {ij} from '../../../injection/api.js';

const IP_SPACE = 256 * 256;

class ConnectionFactory {
  constructor(
      entities = ij(EntityManager),
      random = ij(Random)) {
    this.entities = entities;
    this.random = random;
        
    this.ips = new Array(IP_SPACE);
    this.nextIp = 0;
    this.makeIps();
  }
  
  makeIps() {
    for (let i = 0; i < this.ips.length; ++i) {
      this.ips[i] = i;
    }
    shuffle(this.ips, this.random.channel(RNG_NETWORK));
  }
  
  setNextIp(nic) {
    const rawIp = this.ips[this.nextIp++];
    const net = Math.floor(rawIp / 256);
    const subnet = rawIp % 256;
    const ip = [10, 10, net, subnet];
    
    firstOf(nic.iterate(IpComponent))
        .get(IpComponent).ip = ip;
  }
  
  nextEmptyNic(nodeId) {
    const chipIds = firstOf(
        this.entities.query([nodeId])
            .filter(CompositeComponent)
            .iterate(CompositeComponent))
            .get(CompositeComponent)
            .ids;
    
    return this.entities.query(chipIds)
            .filter(ChipComponent, chip => chip.type == ChipType.NIC)
            .filter(IpComponent, component => sameElements(NO_IP, component.ip))
            .first();
  }
  
  connect(nic1, nic2) {
    const id1 = firstOf(nic1.ids);
    const id2 = firstOf(nic2.ids);
    this.entities.add(
        this.entities.nextId(),
        new ConnectionComponent(),
        new CompositeComponent([id1, id2]));
  }
  
  make(nodeId1, nodeId2) {
    const nic1 = this.nextEmptyNic(nodeId1);
    const nic2 = this.nextEmptyNic(nodeId2);
    this.setNextIp(nic1);
    this.setNextIp(nic2);
    this.connect(nic1, nic2);
  }
}

export {ConnectionFactory};