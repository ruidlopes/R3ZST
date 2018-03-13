import {ActiveComponent} from '../components/active.js';
import {EntityManager} from '../entity/manager.js';
import {SpatialComponent} from '../components/spatial.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {ij} from '../../injection/api.js';

class ViewFactory {
  constructor(manager = ij(EntityManager)) {
    this.manager = manager;
  }
  
  make() {
    this.manager.add(
        this.manager.nextId(),
        new ActiveComponent(false),
        new SpatialComponent(0, 0, 0, 0),
        new ViewComponent(ViewType.HARDWARE));
    this.manager.add(
        this.manager.nextId(),
        new ActiveComponent(true),
        new SpatialComponent(0, 0, 0, 0),
        new ViewComponent(ViewType.TERMINAL));
    this.manager.add(
        this.manager.nextId(),
        new ActiveComponent(false),
        new SpatialComponent(0, 0, 0, 0),
        new ViewComponent(ViewType.STATUS));
  }
}

export {ViewFactory};