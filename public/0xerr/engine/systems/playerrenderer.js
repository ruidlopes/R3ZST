import {BLACK, HIGHLIGHT_BRIGHT} from '../common/palette.js';
import {Drawing} from '../common/drawing.js';
import {EntityLib} from '../entity/lib.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {StealthComponent} from '../components/stealth.js';
import {System} from '../system.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class PlayerRendererSystem extends System {
  constructor(
      entities = ij(EntityManager),
      lib = ij(EntityLib),
      drawing = ij(Drawing)) {
    super();
    this.entities = entities;
    this.lib = lib;
    this.drawing = drawing;
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
  
  frame(delta) {
    const nodeSpatial = this.activeNodeSpatial();
    const playerSpatial = this.playerSpatial();
    
    const dx = Math.floor(nodeSpatial.x + playerSpatial.x);
    const dy = Math.floor(nodeSpatial.y + playerSpatial.y);
    
    this.drawing.clipping(nodeSpatial)
        .putCxel(dx, dy, 0x40, HIGHLIGHT_BRIGHT, BLACK);
  }
}

export {PlayerRendererSystem};