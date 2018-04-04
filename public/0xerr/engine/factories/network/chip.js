import {BLACK, BLUE_BRIGHT} from '../../common/palette.js';
import {RNG_NETWORK} from '../../common/randomchannels.js';
import {ActiveComponent} from '../../components/active.js';
import {ChipComponent, ChipType, ChipVersionMap} from '../../components/chip.js';
import {CompositeComponent} from '../../components/composite.js';
import {EntityManager} from '../../entity/manager.js';
import {IdentifiedComponent} from '../../components/identified.js';
import {IpComponent} from '../../components/ip.js';
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
    this.random = random.channel(RNG_NETWORK);
  }
  
  make(type, constraints) {
    const id = this.entities.nextId();
    const version = this.random.randomItem(constraints.get('versions'));
    
    this.entities.add(
        id,
        new ActiveComponent(false),
        new ChipComponent(type, version),
        new StyleComponent(BLUE_BRIGHT, BLACK),
        new IdentifiedComponent(false),
        new CompositeComponent([]));
    
    switch (type) {
      case ChipType.CAM:
        this.entities.add(id, new RetCamStatusComponent());
        break;
      
      case ChipType.NIC:
        this.entities.add(id, new IpComponent([10, 10, 1, 1]));
        break;
    }
    
    if (type == ChipType.CAM) {
      
    }
    
    return id;
  }
}

export {ChipFactory};