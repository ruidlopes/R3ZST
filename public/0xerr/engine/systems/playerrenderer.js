import {BLACK, ORANGE_BRIGHT} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {StealthComponent} from '../components/stealth.js';
import {System} from '../system.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class PlayerRendererSystem extends System {
  constructor(
      manager = ij(EntityManager),
      drawing = ij(Drawing)) {
    super();
    this.manager = manager;
    this.drawing = drawing;
  }
  
  activeNodeSpatial() {
    return firstOf(this.manager.query()
        .filter(ActiveComponent, component => component.active)
        .filter(NodeComponent)
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  playerSpatial() {
    return this.manager.query()
        .head(StealthComponent, SpatialComponent)
        .get(SpatialComponent);
  }
  
  frame(delta) {
    const nodeSpatial = this.activeNodeSpatial();
    const playerSpatial = this.playerSpatial();
    
    const dx = Math.floor(nodeSpatial.x + playerSpatial.x);
    const dy = Math.floor(nodeSpatial.y + playerSpatial.y);
    
    this.drawing.clipping(nodeSpatial)
        .putCxel(dx, dy, 0x40, ORANGE_BRIGHT, BLACK);
  }
}

export {PlayerRendererSystem};