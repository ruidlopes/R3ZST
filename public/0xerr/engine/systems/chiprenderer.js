import {ActiveComponent} from '../components/active.js';
import {BoxType} from '../../renderer/primitives/boxes.js';
import {ChipComponent} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {StyleComponent} from '../components/style.js';
import {System} from '../system.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

const CHIP_SMALL_CHARS = [0x00, 0x00, 0x00, 0x00, 0x8c, 0x8e, 0x8d, 0x8f];

class ChipRendererSystem extends System {
  constructor(
      manager = ij(EntityManager),
      drawing = ij(Drawing)) {
    super();
    this.manager = manager;
    this.drawing = drawing;
  }
  
  activeNode() {
    return firstOf(this.manager.query()
        .filter(NodeComponent)
        .filter(ActiveComponent, component => component.active)
        .first()
        .iterate(SpatialComponent, CompositeComponent));
  }
  
  activeNodeCompositeIds() {
    return this.activeNode().get(CompositeComponent).ids;
  }
  
  chips() {
    return this.manager.query(this.activeNodeCompositeIds())
        .filter(ChipComponent)
        .iterate(ChipComponent, SpatialComponent, StyleComponent);
  }
  
  frame(delta) {
    for (const chip of this.chips()) {
      this.chipFrame(chip, delta);
    }
  }
  
  chipFrame(chip, delta) {
    const nodeSpatial = this.activeNode().get(SpatialComponent);
    
    const type = chip.get(ChipComponent).type;
    const spatial = chip.get(SpatialComponent);
    const style = chip.get(StyleComponent);
    
    const dx = Math.round(nodeSpatial.x + spatial.x);
    const dy = Math.round(nodeSpatial.y + spatial.y);
    
    this.drawing.clipping(nodeSpatial)
        .boxWithChars(dx, dy, spatial.width, spatial.height,
            CHIP_SMALL_CHARS, style.foregroundColor, style.backgroundColor)
        .box(dx + 1, dy + 1, spatial.width - 2, spatial.height - 2,
            BoxType.OUTER, style.foregroundColor, style.backgroundColor);
  }
}

export {ChipRendererSystem};