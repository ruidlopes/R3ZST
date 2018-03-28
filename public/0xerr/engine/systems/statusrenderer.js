import {
    BLACK,
    BLUE_BRIGHT,
    BLUE_FADED,
    BLUE_FADED2,
    ORANGE_BRIGHT,
} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {BoxType} from '../../renderer/primitives/boxes.js';
import {ChipComponent, ChipType} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {CyclesComponent} from '../components/cycles.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {IdentifiedComponent} from '../components/identified.js';
import {IpComponent} from '../components/ip.js';
import {NodeComponent, NodeType} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {StealthComponent} from '../components/stealth.js';
import {System} from '../system.js';
import {TurnComponent, TurnEnum} from '../components/turn.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {enumLabel, firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class StatusRendererSystem extends System {
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
  
  turn() {
    return firstOf(this.manager.query()
        .filter(TurnComponent)
        .iterate(TurnComponent))
        .get(TurnComponent)
        .turn;
  }
  
  stealth() {
    return firstOf(this.manager.query()
        .filter(StealthComponent)
        .first()
        .iterate(StealthComponent))
        .get(StealthComponent)
        .stealth;
  }
  
  cycles() {
    return firstOf(this.manager.query()
        .filter(CyclesComponent)
        .first()
        .iterate(CyclesComponent))
        .get(CyclesComponent)
        .cycles;
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
  
  renderFrame(delta) {
    const spatial = this.statusViewSpatial();
    this.drawing.absolute()
        .box(spatial.x, spatial.y, spatial.width, spatial.height,
            BoxType.SINGLE, BLUE_BRIGHT, BLACK)
        .rect(spatial.x + 1, spatial.y + 1, spatial.width - 2, spatial.height - 2,
            0x00, BLUE_BRIGHT, BLACK)
        .sprint('STATUS', spatial.x + 2, spatial.y, BLUE_BRIGHT, BLACK);
  }
  
  renderGameStats(delta) {
    const spatial = this.statusViewSpatial();
    const dx = spatial.x + 2;
    const dy = spatial.y + 2;
    
    const turn = enumLabel(TurnEnum, this.turn());
    this.drawing.clipping(spatial)
        .sprint('TURN', dx, dy, BLUE_BRIGHT, BLACK)
        .sprint(turn, dx + 9, dy, ORANGE_BRIGHT, BLACK)
        .sprint('STEALTH  [          ]', dx, dy + 2, BLUE_BRIGHT, BLACK)
        .sprint('\xfe'.repeat(this.stealth()), dx + 10, dy + 2, ORANGE_BRIGHT, BLACK)
        .sprint('CYCLES   [          ]', dx, dy + 4, BLUE_BRIGHT, BLACK)
        .sprint('\xfe'.repeat(this.cycles()), dx + 10, dy + 4, ORANGE_BRIGHT, BLACK);
  }
  
  renderNodeStats(delta) {
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
        
        case ChipType.CAM:
          draw.sprint('CAMERA', dx, ++dy, BLUE_BRIGHT, BLACK)
              .sprint(version, dx + 8, dy, ORANGE_BRIGHT, BLACK);
          break;
          
        case ChipType.CPU:
          draw.sprint('CPU', dx, ++dy, BLUE_BRIGHT, BLACK)
              .sprint(version, dx + 8, dy, ORANGE_BRIGHT, BLACK);
          break;
        
        case ChipType.NIC:
          const ip = chip.get(IpComponent).ip.join('.');
          draw.sprint('NIC', dx, ++dy, BLUE_BRIGHT, BLACK)
              .sprint(version, dx + 8, dy, ORANGE_BRIGHT, BLACK)
              .sprint('IP', dx, ++dy, BLUE_BRIGHT, BLACK)
              .sprint(ip, dx + 8, dy, ORANGE_BRIGHT, BLACK);
          break;
          
        case ChipType.RAM:
          draw.sprint('RAM', dx, ++dy, BLUE_BRIGHT, BLACK)
              .sprint(version, dx + 8, dy, ORANGE_BRIGHT, BLACK);
          break;
      }
      
      dy++;
    }
  }
  
  frame(delta) {
    this.renderFrame(delta);
    this.renderGameStats(delta);
    this.renderNodeStats(delta);
  }
}

export {StatusRendererSystem};