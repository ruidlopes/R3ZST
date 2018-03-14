import {ActiveComponent} from '../components/active.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {StealthComponent} from '../components/stealth.js';
import {System} from '../system.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class CameraTransformSystem extends System {
  constructor(manager = ij(EntityManager)) {
    super();
    this.manager = manager;
  }
  
  activeNodeSpatial() {
    return firstOf(this.manager.query()
        .filter(NodeComponent)
        .filter(ActiveComponent, component => component.active)
        .first()
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  playerSpatial() {
    return firstOf(this.manager.query()
        .filter(StealthComponent)
        .first()
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  hardwareViewSpatial() {
    return firstOf(this.manager.query()
        .filter(ViewComponent, component => component.type == ViewType.HARDWARE)
        .first()
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  frame(delta) {
    const activeNodeSpatial = this.activeNodeSpatial();
    const playerSpatial = this.playerSpatial();
    const hardwareViewSpatial = this.hardwareViewSpatial();
    
    activeNodeSpatial.x = (hardwareViewSpatial.width >> 1) - Math.round(playerSpatial.x);
    activeNodeSpatial.y = (hardwareViewSpatial.height >> 1) - Math.round(playerSpatial.y);
  }
}

export {CameraTransformSystem};