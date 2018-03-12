import {BLACK, BLUE_BRIGHT, ORANGE_BRIGHT} from '../common/palette.js';
import {SCREEN} from '../qualifiers.js';
import {CxelBuffer} from '../../renderer/cxel/buffer.js';
import {EntityManager} from '../entity/manager.js';
import {SpatialComponent} from '../components/spatial.js';
import {StealthComponent} from '../components/stealth.js';
import {System} from '../system.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';
import {sprint} from '../../renderer/primitives/print.js';

class GameStatsRendererSystem extends System {
  constructor(
      manager = ij(EntityManager),
      screen = ij(CxelBuffer, SCREEN)) {
    super();
    this.manager = manager;
    this.screen = screen;
  }
  
  statusViewSpatial() {
    return firstOf(this.manager.query()
        .filter(ViewComponent, component => component.type == ViewType.STATUS)
        .first()
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  stealth() {
    return firstOf(this.manager.query()
        .filter(StealthComponent)
        .first()
        .iterate(StealthComponent))
        .get(StealthComponent)
        .stealth;
  }
  
  frame(delta) {
    const statusViewSpatial = this.statusViewSpatial();
    const dx = statusViewSpatial.x + 2;
    const dy = statusViewSpatial.y + 2;
    
    const stealth = this.stealth();
    sprint('STEALTH', this.screen, dx, dy, BLUE_BRIGHT, BLACK);
    sprint('[          ]', this.screen, dx, dy + 1, BLUE_BRIGHT, BLACK);
    sprint('\xfe'.repeat(stealth), this.screen, dx + 1, dy + 1, ORANGE_BRIGHT, BLACK);
  }
}

export {GameStatsRendererSystem};