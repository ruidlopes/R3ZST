import {
    BLACK,
    BLUE_BRIGHT,
    BLUE_FADED,
    BLUE_FADED2,
    ORANGE_BRIGHT,
} from '../common/palette.js';
import {PLAYER} from '../actions/qualifiers.js';
import {Action, ActionRefreshEnum} from '../action.js';
import {ActiveComponent} from '../components/active.js';
import {BoxType} from '../../renderer/primitives/boxes.js';
import {
  ChipComponent,
  ChipType,
  ChipBiosVersion,
  ChipCamVersion,
  ChipCpuVersion,
  ChipMemVersion,
  ChipNicVersion,
} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {CyclesComponent} from '../components/cycles.js';
import {DeckComponent} from '../components/deck.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {IdentifiedComponent} from '../components/identified.js';
import {IpComponent} from '../components/ip.js';
import {NodeComponent, NodeType} from '../components/node.js';
import {RetCamStatusComponent, RetCamStatus} from '../components/retcamstatus.js';
import {SpatialComponent} from '../components/spatial.js';
import {StealthComponent} from '../components/stealth.js';
import {System} from '../system.js';
import {TurnComponent, TurnEnum} from '../components/turn.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {enumLabel, firstOf, mapOf} from '../../stdlib/collections.js';
import {ij, ijmap} from '../../injection/api.js';

const ActionRefreshIcon = mapOf(
  ActionRefreshEnum.TURN, 'T',
  ActionRefreshEnum.NODE, 'N',
  ActionRefreshEnum.ZERO, 'Z',
);

class StatusRendererSystem extends System {
  constructor(
      manager = ij(EntityManager),
      actions = ijmap(Action, PLAYER),
      drawing = ij(Drawing)) {
    super();
    this.manager = manager;
    this.actions = actions;
    this.drawing = drawing;
  }
  
  statusViewSpatial() {
    return firstOf(this.manager.query()
        .filter(ViewComponent, component => component.type == ViewType.STATUS)
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  turn() {
    return this.manager.query()
        .head(TurnComponent)
        .get(TurnComponent)
        .turn;
  }
  
  stealth() {
    return this.manager.query()
        .head(StealthComponent)
        .get(StealthComponent)
        .stealth;
  }
  
  cycles() {
    return this.manager.query()
        .head(CyclesComponent)
        .get(CyclesComponent)
        .cycles;
  }
  
  deck() {
    return this.manager.query()
        .head(DeckComponent)
        .get(DeckComponent);
  }
  
  activeNode() {
    return firstOf(this.manager.query()
        .filter(NodeComponent)
        .filter(ActiveComponent, component => component.active)
        .iterate(NodeComponent, CompositeComponent));
  }
  
  activeChip() {
    return firstOf(this.manager.query()
        .filter(ChipComponent)
        .filter(ActiveComponent, component => component.active)
        .iterate(
            ChipComponent,
            IdentifiedComponent,
            IpComponent,
            RetCamStatusComponent));
  }
  
  renderFrame(delta, spatial) {
    this.drawing.absolute()
        .box(spatial.x, spatial.y, spatial.width, spatial.height,
            BoxType.SINGLE, BLUE_BRIGHT, BLACK)
        .rect(spatial.x + 1, spatial.y + 1, spatial.width - 2, spatial.height - 2,
            0x00, BLUE_BRIGHT, BLACK)
        .sprint('STATUS', spatial.x + 2, spatial.y, BLUE_BRIGHT, BLACK);
  }
  
  renderGameStats(delta, spatial) {
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
  
  renderDeckStats(delta, spatial) {
    const dx = spatial.x + 2;
    let dy = spatial.y + 9;
    
    const draw = this.drawing.clipping(spatial);
    draw.sprint('SCRIPT DECK', dx, dy++, BLUE_BRIGHT, BLACK);
    
    const deck = this.deck().items.entries();
    for (const [name, stats] of deck) {
      const action = this.actions.get(name);
      if (action.hidden) {
        continue;
      }
      const refresh = stats == Infinity ? '-' : ActionRefreshIcon.get(action.refresh);
      const count = stats == Infinity ? '-' : String(stats);
      const cycles = String(action.cycles);
      draw.sprint(refresh, dx, ++dy, BLACK, ORANGE_BRIGHT)
          .sprint(count, dx + 1, dy, BLACK, BLUE_BRIGHT)
          .sprint(cycles, dx + 2, dy, BLACK, ORANGE_BRIGHT)
          .sprint(name, dx + 4, dy, ORANGE_BRIGHT, BLACK);
    }
  }
  
  renderNodeStats(delta, spatial) {
    const dx = spatial.x + 2;
    let dy = spatial.y + 25;
    
    const draw = this.drawing.clipping(spatial);
    const type = this.activeNode().get(NodeComponent).type;
    
    const chip = this.activeChip();
    if (!chip || !chip.get(IdentifiedComponent).identified) {
      return;
    }
      
    const component = chip.get(ChipComponent);
    switch (component.type) {
      case ChipType.BIOS:
        const biosVersion = enumLabel(ChipBiosVersion, component.version);
        draw.sprint('NODE', dx, ++dy, BLUE_BRIGHT, BLACK)
            .sprint(enumLabel(NodeType, type), dx + 8, dy, ORANGE_BRIGHT, BLACK)
            .sprint('BIOS', dx, ++dy, BLUE_BRIGHT, BLACK)
            .sprint(biosVersion, dx + 8, dy, ORANGE_BRIGHT, BLACK);
        break;

      case ChipType.CAM:
        const camVersion = enumLabel(ChipCamVersion, component.version);
        const status = enumLabel(RetCamStatus, chip.get(RetCamStatusComponent).status);
        draw.sprint('CAMERA', dx, ++dy, BLUE_BRIGHT, BLACK)
            .sprint(camVersion, dx + 8, dy, ORANGE_BRIGHT, BLACK)
            .sprint('STATUS', dx, ++dy, BLUE_BRIGHT, BLACK)
            .sprint(status, dx + 8, dy, ORANGE_BRIGHT, BLACK);
        break;

      case ChipType.CPU:
        const cpuVersion = enumLabel(ChipCpuVersion, component.version);
        draw.sprint('CPU', dx, ++dy, BLUE_BRIGHT, BLACK)
            .sprint(cpuVersion, dx + 8, dy, ORANGE_BRIGHT, BLACK);
        break;

      case ChipType.MEM:
        const memVersion = enumLabel(ChipMemVersion, component.version);
        draw.sprint('RAM', dx, ++dy, BLUE_BRIGHT, BLACK)
            .sprint(memVersion, dx + 8, dy, ORANGE_BRIGHT, BLACK);
        break;

      case ChipType.NIC:
        const nicVersion = enumLabel(ChipNicVersion, component.version);
        const ip = chip.get(IpComponent).ip.join('.');
        draw.sprint('NIC', dx, ++dy, BLUE_BRIGHT, BLACK)
            .sprint(nicVersion, dx + 8, dy, ORANGE_BRIGHT, BLACK)
            .sprint('IP', dx, ++dy, BLUE_BRIGHT, BLACK)
            .sprint(ip, dx + 8, dy, ORANGE_BRIGHT, BLACK);
        break;
    }
  }
  
  frame(delta) {
    const spatial = this.statusViewSpatial();
    this.renderFrame(delta, spatial);
    this.renderGameStats(delta, spatial);
    this.renderDeckStats(delta, spatial);
    this.renderNodeStats(delta, spatial);
  }
}

export {StatusRendererSystem};