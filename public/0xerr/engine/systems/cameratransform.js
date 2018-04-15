import {EntityLib} from '../entity/lib.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {StealthComponent} from '../components/stealth.js';
import {System} from '../system.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class CameraTransformSystem extends System {
  constructor(
      entities = ij(EntityManager),
      lib = ij(EntityLib)) {
    super();
    this.entities = entities;
    this.lib = lib;
  }
  
  activeNodeSpatial() {
    return firstOf(this.lib.activeNode().iterate(SpatialComponent))
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
    
    activeNodeSpatial.x = Math.floor(hardwareViewSpatial.width * 0.5) - Math.floor(playerSpatial.x);
    activeNodeSpatial.y = Math.floor(hardwareViewSpatial.height * 0.5) - Math.floor(playerSpatial.y);
  }
}

export {CameraTransformSystem};