import {CyclesComponent} from '../components/cycles.js';
import {EntityManager} from '../entity/manager.js';
import {SpatialComponent} from '../components/spatial.js';
import {StealthComponent} from '../components/stealth.js';
import {VelocityComponent} from '../components/velocity.js';
import {ij} from '../../injection/api.js';

class PlayerFactory {
  constructor(manager = ij(EntityManager)) {
    this.manager = manager;
  }
  
  make() {
    this.manager.add(
        this.manager.nextId(),
        new CyclesComponent(10),
        new SpatialComponent(1, 1, 0, 0),
        new StealthComponent(8),
        new VelocityComponent(0, 0));
  }
}

export {PlayerFactory};