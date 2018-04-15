import {BLACK, BLUE_FADED2, BLUE_FADED3} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {Drawing} from '../common/drawing.js';
import {EntityLib} from '../entity/lib.js';
import {SpatialComponent} from '../components/spatial.js';
import {System} from '../system.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class HardwareRendererSystem extends System {
  constructor(
      lib = ij(EntityLib),
      drawing = ij(Drawing)) {
    super();
    this.lib = lib;
    this.drawing = drawing;
  }
  
  hardwareView() {
    return firstOf(this.lib.hardwareView().iterate(SpatialComponent, ActiveComponent));
  }
  
  frame(delta) {
    const hardwareView = this.hardwareView();
    const spatial = hardwareView.get(SpatialComponent);
    const active = hardwareView.get(ActiveComponent).active;
    
    this.drawing.absolute()
        .rect(spatial.x, spatial.y, spatial.width, spatial.height,
              0xef, active ? BLUE_FADED2 : BLUE_FADED3, BLACK);
  }
}

export {HardwareRendererSystem};