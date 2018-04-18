import {BLACK, BLUE_BRIGHT} from '../../common/palette.js';
import {RNG_NETWORK} from '../../common/randomchannels.js';
import {ActiveComponent} from '../../components/active.js';
import {ChipComponent, ChipType} from '../../components/chip.js';
import {EntityManager} from '../../entity/manager.js';
import {IdentifiedComponent} from '../../components/identified.js';
import {IpComponent, NO_IP} from '../../components/ip.js';
import {Random} from '../../../stdlib/random.js';
import {RetCamStatusComponent} from '../../components/retcamstatus.js';
import {StyleComponent} from '../../components/style.js';
import {enumValue} from '../../../stdlib/collections.js';
import {ij} from '../../../injection/api.js';

class ChipFactory {
  constructor(
      entities = ij(EntityManager),
      random = ij(Random)) {
    this.entities = entities;
    this.random = random;
  }
  
  make(type, constraints) {
    const id = this.entities.nextId();
    const version = this.random.channel(RNG_NETWORK)
        .randomItem(constraints.get('versions'));
    
    this.entities.add(
        id,
        new ActiveComponent(false),
        new ChipComponent(type, version),
        new StyleComponent(BLUE_BRIGHT, BLACK),
        new IdentifiedComponent(false));
    
    switch (type) {
      case ChipType.CAM:
        this.entities.add(id, new RetCamStatusComponent());
        break;
      
      case ChipType.NIC:
        this.entities.add(id, new IpComponent(NO_IP));
        break;
    }
    
    return id;
  }
}

export {ChipFactory};