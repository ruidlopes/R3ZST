import {BLACK, ORANGE_BRIGHT} from '../common/palette.js';
import {SCREEN} from '../qualifiers.js';
import {ActiveComponent} from '../components/active.js';
import {CxelBuffer} from '../../renderer/cxel/buffer.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {StealthComponent} from '../components/stealth.js';
import {System} from '../system.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';
import {putCxel} from '../../renderer/primitives/drawing.js';

class PlayerRendererSystem extends System {
  constructor(
      manager = ij(EntityManager),
      screen = ij(CxelBuffer, SCREEN)) {
    super();
    this.manager = manager;
    this.screen = screen;
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
    const dx = nodeSpatial.x + playerSpatial.x + 1;
    const dy = nodeSpatial.y + playerSpatial.y + 1;
    putCxel(this.screen, dx, dy, 0x40, ORANGE_BRIGHT, BLACK);
  }
}

export {PlayerRendererSystem};