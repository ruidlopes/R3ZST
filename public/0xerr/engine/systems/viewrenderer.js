import {BLACK, BLUE_BRIGHT, BLUE_FADED, BLUE_FADED2} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {SpatialComponent} from '../components/spatial.js';
import {System} from '../system.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {BoxType} from '../../renderer/primitives/boxes.js';
import {ij} from '../../injection/api.js';

class ViewRendererSystem extends System {
  constructor(
      manager = ij(EntityManager),
      drawing = ij(Drawing)) {
    super();
    this.manager = manager;
    this.drawing = drawing;
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
            this.drawing.absolute()
                .rect(spatial.x, spatial.y, spatial.width, spatial.height,
                    0xef, active ? BLUE_BRIGHT : BLUE_FADED2, BLACK);
          }
          break;
        case ViewType.TERMINAL: {
            const foreground = active ? BLUE_BRIGHT : BLUE_FADED;
            this.drawing.absolute()
                .box(spatial.x, spatial.y, spatial.width, spatial.height,
                    BoxType.SINGLE, foreground, BLACK)
                .rect(spatial.x + 1, spatial.y + 1, spatial.width - 2, spatial.height - 2,
                    0x00, foreground, BLACK)
                .sprint('TERMINAL', spatial.x + 2, spatial.y, foreground, BLACK);
          }
          break;
        case ViewType.STATUS: {
            this.drawing.absolute()
                .box(spatial.x, spatial.y, spatial.width, spatial.height,
                    BoxType.SINGLE, BLUE_BRIGHT, BLACK)
                .rect(spatial.x + 1, spatial.y + 1, spatial.width - 2, spatial.height - 2,
                    0x00, BLUE_BRIGHT, BLACK)
                .sprint('STATUS', spatial.x + 2, spatial.y, BLUE_BRIGHT, BLACK);
          }
          break;
      }
    }
  }
}

export {ViewRendererSystem};