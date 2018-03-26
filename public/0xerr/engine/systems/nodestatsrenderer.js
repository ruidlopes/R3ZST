import {BLACK, BLUE_BRIGHT, ORANGE_BRIGHT} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {ChipComponent, ChipType} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {IdentifiedComponent} from '../components/identified.js';
import {IpComponent} from '../components/ip.js';
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
        .iterate(ChipComponent, IdentifiedComponent, IpComponent);
  }
  
  frame(delta) {
    const statusViewSpatial = this.statusViewSpatial();
    const dx = statusViewSpatial.x + 2;
    let dy = statusViewSpatial.y + 8;
    
    const draw = this.drawing.clipping(statusViewSpatial);
    const type = this.activeNode().get(NodeComponent).type;
    
    for (const chip of this.chips()) {
      const identified = chip.get(IdentifiedComponent).identified;
      if (!identified) {
        continue;
      }
      
      const component = chip.get(ChipComponent);
      const version = component.version;
      
      switch (component.type) {
        case ChipType.BIOS:
          draw.sprint('NODE', dx, ++dy, BLUE_BRIGHT, BLACK)
              .sprint(enumLabel(NodeType, type), dx + 8, dy, ORANGE_BRIGHT, BLACK)
              .sprint('BIOS', dx, ++dy, BLUE_BRIGHT, BLACK)
              .sprint(version, dx + 8, dy, ORANGE_BRIGHT, BLACK);
          break;
        
        case ChipType.CPU:
          draw.sprint('CPU', dx, ++dy, BLUE_BRIGHT, BLACK)
              .sprint(version, dx + 8, dy, ORANGE_BRIGHT, BLACK);
          break;
        
        case ChipType.RAM:
          draw.sprint('RAM', dx, ++dy, BLUE_BRIGHT, BLACK)
              .sprint(version, dx + 8, dy, ORANGE_BRIGHT, BLACK);
          break;
        
        case ChipType.NIC:
          const ip = chip.get(IpComponent).ip.join('.');
          draw.sprint('NIC', dx, ++dy, BLUE_BRIGHT, BLACK)
              .sprint(version, dx + 8, dy, ORANGE_BRIGHT, BLACK)
              .sprint('IP', dx, ++dy, BLUE_BRIGHT, BLACK)
              .sprint(ip, dx + 8, dy, ORANGE_BRIGHT, BLACK);
          break;
      }
      
      dy++;
    }
  }
}

export {NodeStatsRendererSystem};