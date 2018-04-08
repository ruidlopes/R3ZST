import {BLACK, BLUE_FADED2} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {SpatialComponent} from '../components/spatial.js';
import {System} from '../system.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class HardwareRendererSystem extends System {
  constructor(
      manager = ij(EntityManager),
      drawing = ij(Drawing)) {
    super();
    this.manager = manager;
    this.drawing = drawing;
  }
  
  hardwareView() {
    return firstOf(this.manager.query()
        .filter(ViewComponent, view => view.type == ViewType.HARDWARE)
        .iterate(SpatialComponent, ActiveComponent));
  }
  
  frame(delta) {
    const hardwareView = this.hardwareView();
    const spatial = hardwareView.get(SpatialComponent);
    const active = hardwareView.get(ActiveComponent).active;
    
    this.drawing.absolute()
        .rect(spatial.x, spatial.y, spatial.width, spatial.height,
              active ? 0xef : 0x00, BLUE_FADED2, BLACK);
  }
}

export {HardwareRendererSystem};