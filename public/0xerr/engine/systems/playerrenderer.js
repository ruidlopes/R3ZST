import {BLACK, ORANGE_BRIGHT} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {StealthComponent} from '../components/stealth.js';
import {System} from '../system.js';
import {VelocityComponent} from '../components/velocity.js';
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
  
  player() {
    return firstOf(this.manager.query()
        .filter(StealthComponent)
        .first()
        .iterate(SpatialComponent, VelocityComponent));
  }
  
  frame(delta) {
    const nodeSpatial = this.activeNodeSpatial();
    const player = this.player();
    const playerSpatial = player.get(SpatialComponent);
    const velocity = player.get(VelocityComponent);
    
    const fn_x = velocity.vx >= 0 ? Math.floor : Math.ceil;
    const fn_y = velocity.vy >= 0 ? Math.floor : Math.ceil;
    
    const dx = fn_x(nodeSpatial.x + playerSpatial.x);
    const dy = fn_y(nodeSpatial.y + playerSpatial.y);
    
    this.drawing.clipping(nodeSpatial)
        .putCxel(dx, dy, 0x40, ORANGE_BRIGHT, BLACK);
  }
}

export {PlayerRendererSystem};