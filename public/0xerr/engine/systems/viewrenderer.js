import {BLACK, BLUE_BRIGHT, BLUE_FADED, BLUE_FADED2} from '../common/palette.js';
import {SCREEN} from '../qualifiers.js';
import {ActiveComponent} from '../components/active.js';
import {CxelBuffer} from '../../renderer/cxel/buffer.js';
import {EntityManager} from '../entity/manager.js';
import {SpatialComponent} from '../components/spatial.js';
import {System} from '../system.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {box, BoxType} from '../../renderer/primitives/boxes.js';
import {rect} from '../../renderer/primitives/drawing.js';
import {sprint} from '../../renderer/primitives/print.js';
import {ij} from '../../injection/api.js';

class ViewRendererSystem extends System {
  constructor(
      manager = ij(EntityManager),
      screen = ij(CxelBuffer, SCREEN)) {
    super();
    this.manager = manager;
    this.screen = screen;
  }
  
  entities() {
    return this.manager.query()
        .filter(ViewComponent)
        .iterate(ActiveComponent, SpatialComponent, ViewComponent);
  }
  
  frame(delta) {
    for (const entity of this.entities()) {
      const spatial = entity.get(SpatialComponent);
      const active = entity.get(ActiveComponent).active;
      
      switch (entity.get(ViewComponent).type) {
        case ViewType.HARDWARE: {
            rect(this.screen,
              spatial.x, spatial.y, spatial.width, spatial.height,
              0xef, active ? BLUE_BRIGHT : BLUE_FADED2, BLACK);
          }
          break;
        case ViewType.TERMINAL: {
            const foreground = active ? BLUE_BRIGHT : BLUE_FADED;
            box(this.screen,
                spatial.x, spatial.y, spatial.width, spatial.height,
                BoxType.SINGLE, foreground, BLACK);
            rect(this.screen,
                spatial.x + 1, spatial.y + 1, spatial.width - 2, spatial.height - 2,
                0x00, foreground, BLACK);
            sprint('TERMINAL', this.screen, spatial.x + 2, spatial.y,
                foreground, BLACK);
          }
          break;
        case ViewType.STATUS: {
            const foreground = active ? BLUE_BRIGHT : BLUE_FADED;
            box(this.screen,
                spatial.x, spatial.y, spatial.width, spatial.height,
                BoxType.SINGLE, foreground, BLACK);
            rect(this.screen,
                spatial.x + 1, spatial.y + 1, spatial.width - 2, spatial.height - 2,
                0x00, foreground, BLACK);
            sprint('STATUS', this.screen, spatial.x + 2, spatial.y,
                foreground, BLACK);
          }
          break;
      }
    }
  }
}

export {ViewRendererSystem};