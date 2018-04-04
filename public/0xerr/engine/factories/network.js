import {NETWORK} from './qualifiers.js';
import {RNG_NETWORK} from '../common/randomchannels.js';
import {ActiveComponent} from '../components/active.js';
import {EntityManager} from '../entity/manager.js';
import {NodeFactory} from './network/node.js';
import {NodeType} from '../components/node.js';
import {Random} from '../../stdlib/random.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class NetworkFactory {
  constructor(
      entities = ij(EntityManager),
      random = ij(Random),
      nodeFactory = ij(NodeFactory, NETWORK)) {
    this.entities = entities;
    this.random = random.channel(RNG_NETWORK);
    
    this.nodeFactory = nodeFactory;
  }
  
  make() {
    const id = this.nodeFactory.make(NodeType.RETSAFE_CAM);
    
    firstOf(this.entities.query([id])
        .iterate(ActiveComponent))
        .get(ActiveComponent).active = true;
  }
}

export {NetworkFactory};