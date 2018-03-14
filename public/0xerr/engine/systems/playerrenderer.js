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
  
  frame(delta) {
    const nodeSpatial = this.activeNodeSpatial();
    const playerSpatial = this.playerSpatial();
    const dx = nodeSpatial.x + Math.round(playerSpatial.x) + 1;
    const dy = nodeSpatial.y + Math.round(playerSpatial.y) + 1;
    
    this.drawing.clipping(nodeSpatial)
        .putCxel(dx, dy, 0x40, ORANGE_BRIGHT, BLACK);
  }
}

export {PlayerRendererSystem};