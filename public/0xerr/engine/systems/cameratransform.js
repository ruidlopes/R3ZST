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
  constructor(entities = ij(EntityManager)) {
    super();
    this.entities = entities;
  }
  
  activeNodeSpatial() {
    return firstOf(this.entities.query()
        .filter(NodeComponent)
        .filter(ActiveComponent, component => component.active)
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  playerSpatial() {
    return this.entities.query()
        .head(StealthComponent, SpatialComponent)
        .get(SpatialComponent);
  }
  
  hardwareViewSpatial() {
    return firstOf(this.entities.query()
        .filter(ViewComponent, component => component.type == ViewType.HARDWARE)
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  frame(delta) {
    const activeNodeSpatial = this.activeNodeSpatial();
    const playerSpatial = this.playerSpatial();
    const hardwareViewSpatial = this.hardwareViewSpatial();
    
    const intX = Math.floor(playerSpatial.x);
    const intY = Math.floor(playerSpatial.y);
    const fracX = playerSpatial.x - intX;
    const fracY = playerSpatial.y - intY;
    
    activeNodeSpatial.x = Math.floor(hardwareViewSpatial.width * 0.5) - playerSpatial.x;
    activeNodeSpatial.y = Math.floor(hardwareViewSpatial.height * 0.5) - playerSpatial.y;
  }
}

export {CameraTransformSystem};