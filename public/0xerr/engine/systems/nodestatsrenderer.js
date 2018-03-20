import {BLACK, BLUE_BRIGHT, ORANGE_BRIGHT} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {ChipComponent, ChipType} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {IdentifiedComponent} from '../components/identified.js';
import {NodeComponent, NodeType} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {System} from '../system.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {enumLabel, firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class NodeStatsRendererSystem extends System {
  constructor(
      manager = ij(EntityManager),
      drawing = ij(Drawing)) {
    super();
    this.manager = manager;
    this.drawing = drawing;
  }
  
  statusViewSpatial() {
    return firstOf(this.manager.query()
        .filter(ViewComponent, component => component.type == ViewType.STATUS)
        .first()
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  activeNode() {
    return firstOf(this.manager.query()
        .filter(NodeComponent)
        .filter(ActiveComponent, component => component.active)
        .first()
        .iterate(NodeComponent, CompositeComponent));
  }
  
  chips() {
    const chipIds = this.activeNode().get(CompositeComponent).ids;
    return this.manager.query(chipIds)
        .filter(ChipComponent)
        .iterate(ChipComponent, IdentifiedComponent);
  }
  
  frame(delta) {
    const statusViewSpatial = this.statusViewSpatial();
    const dx = statusViewSpatial.x + 2;
    const dy = statusViewSpatial.y + 7;
    
    const draw = this.drawing.clipping(statusViewSpatial);
    
    draw.sprint('NODE', dx, dy, BLUE_BRIGHT, BLACK)
        .sprint('type', dx, dy + 1, BLUE_BRIGHT, BLACK)
        .sprint('bios', dx, dy + 2, BLUE_BRIGHT, BLACK)
        .sprint('ip', dx, dy + 3, BLUE_BRIGHT, BLACK)
        .sprint('cpu', dx, dy + 4, BLUE_BRIGHT, BLACK)
        .sprint('memory', dx, dy + 5, BLUE_BRIGHT, BLACK);
    
    const type = this.activeNode().get(NodeComponent).type;
    
    for (const chip of this.chips()) {
      const identified = chip.get(IdentifiedComponent).identified;
      const component = chip.get(ChipComponent);
      const version = component.version;

      switch (component.type) {
        case ChipType.BIOS:
          if (identified) {
            draw.sprint(enumLabel(NodeType, type), dx + 8, dy + 1, ORANGE_BRIGHT, BLACK);
          }
          draw.sprint(
              identified ? version : 'UNKNOWN',
              dx + 8, dy + 2, ORANGE_BRIGHT, BLACK);
          break;
        case ChipType.CPU:
          draw.sprint(
              identified ? version : 'UNKNOWN',
              dx + 8, dy + 4, ORANGE_BRIGHT, BLACK);
          break;
        case ChipType.RAM:
          draw.sprint(
              identified ? version : 'UNKNOWN',
              dx + 8, dy + 5, ORANGE_BRIGHT, BLACK);
          break;
      }
    }
  }
}

export {NodeStatsRendererSystem};