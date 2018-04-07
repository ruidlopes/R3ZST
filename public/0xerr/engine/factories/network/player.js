import {RNG_NETWORK} from '../../common/randomchannels.js';
import {ActiveComponent} from '../../components/active.js';
import {CyclesComponent, CYCLES_MAX} from '../../components/cycles.js';
import {EntityManager} from '../../entity/manager.js';
import {NodeComponent} from '../../components/node.js';
import {Random} from '../../../stdlib/random.js';
import {SpatialComponent} from '../../components/spatial.js';
import {StealthComponent} from '../../components/stealth.js';
import {VelocityComponent} from '../../components/velocity.js';
import {firstOf} from '../../../stdlib/collections.js';
import {ij} from '../../../injection/api.js';

class PlayerFactory {
  constructor(
      entities = ij(EntityManager),
      random = ij(Random)) {
    this.entities = entities;
    this.random = random;
  }
  
  activeNodeSpatial() {
    return firstOf(this.entities.query()
        .filter(NodeComponent)
        .filter(ActiveComponent, component => component.active)
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  make() {
    const activeNodeSpatial = this.activeNodeSpatial();
    const x = this.random.channel(RNG_NETWORK)
        .randomRange(0, activeNodeSpatial.width);
    const y = this.random.channel(RNG_NETWORK)
        .randomRange(0, activeNodeSpatial.height);
    
    this.entities.add(
        this.entities.nextId(),
        new CyclesComponent(CYCLES_MAX),
        new SpatialComponent(x, y, 0, 0),
        new StealthComponent(8),
        new VelocityComponent(0, 0));
  }
}

export {PlayerFactory};