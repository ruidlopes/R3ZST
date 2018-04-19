import {
    BLACK,
    BLUE_BRIGHT,
    BLUE_FADED,
    BLUE_FADED2,
    HIGHLIGHT_BRIGHT,
    RED_MAGENTA_BRIGHT,
    WHITE,
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
import {ChipScriptAction, ANY_CHIP} from '../actions/player/lib/chipscript.js';
import {CompositeComponent} from '../components/composite.js';
import {ConnectionComponent} from '../components/connection.js';
import {CyclesComponent} from '../components/cycles.js';
import {DeckComponent} from '../components/deck.js';
import {Drawing} from '../common/drawing.js';
import {EntityLib} from '../entity/lib.js';
import {EntityManager} from '../entity/manager.js';
import {IdentifiedComponent} from '../components/identified.js';
import {IpComponent} from '../components/ip.js';
import {NodeComponent, NodeType} from '../components/node.js';
import {RetCamStatusComponent, RetCamStatus} from '../components/retcamstatus.js';
import {SentryComponent, SentryCapabilities, SentryState} from '../components/sentry.js';
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
    ActionRefreshEnum.ZERO, '0',
);

const ActionChipIcon = mapOf(
  ChipType.BIOS, 'B',
  ChipType.CAM, 'C',
  ChipType.CPU, 'P',
  ChipType.MEM, 'M',
  ChipType.NIC, 'N',
  ANY_CHIP, '*',
);

class StatusRendererSystem extends System {
  constructor(
      manager = ij(EntityManager),
      lib = ij(EntityLib),
      actions = ijmap(Action, PLAYER),
      drawing = ij(Drawing)) {
    super();
    this.manager = manager;
    this.lib = lib;
    this.actions = actions;
    this.drawing = drawing;

    this.clipper = {x: 0, y: 0, width: 0, height: 0};
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
    return firstOf(this.lib.activeNode().iterate(NodeComponent, CompositeComponent));
  }
  
  activeChip() {
    return firstOf(this.manager.query()
        .filter(ActiveComponent, component => component.active)
        .filter(ChipComponent)
        .iterate(
            ChipComponent,
            IdentifiedComponent,
            IpComponent,
            RetCamStatusComponent));
  }
  
  connection(chip) {
    return firstOf(this.manager.query()
        .filter(ConnectionComponent)
        .filter(CompositeComponent, composite => composite.ids.includes(chip.id))
        .iterate(ConnectionComponent));
  }
  
  activeSentry() {
    return firstOf(this.manager.query()
        .filter(ActiveComponent, component => component.active)
        .filter(SentryComponent)
        .iterate(SentryComponent, IdentifiedComponent));
  }
  
  renderFrame(x, y, width, height, title) {
    this.drawing.absolute()
        .rect(x, y, width, height, 0x00, BLUE_BRIGHT, BLACK)
        .box(x, y, width, height, BoxType.SINGLE, BLUE_BRIGHT, BLACK)
        .sprint(title, x + 2, y, BLUE_BRIGHT, BLACK);
  }
  
  renderFrames(delta, spatial) {
    this.renderFrame(spatial.x, 0, spatial.width, 9, 'RUN');
    this.renderFrame(spatial.x, 9, spatial.width, 9, 'NODE/CHIP');
    this.renderFrame(spatial.x, 18, spatial.width, spatial.height - 18, 'SCRIPT DECK'); 
  }
  
  renderRunStats(delta, spatial) {
    const dx = spatial.x + 2;
    const dy = spatial.y + 2;
    
    const turn = enumLabel(TurnEnum, this.turn());
    this.drawing.clipping(spatial)
        .sprint('TURN', dx, dy, BLUE_BRIGHT, BLACK)
        .sprint(turn, dx + 9, dy, HIGHLIGHT_BRIGHT, BLACK)
        .sprint('STEALTH  [          ]', dx, dy + 2, BLUE_BRIGHT, BLACK)
        .sprint('\xfe'.repeat(this.stealth()), dx + 10, dy + 2, HIGHLIGHT_BRIGHT, BLACK)
        .sprint('CYCLES   [          ]', dx, dy + 4, BLUE_BRIGHT, BLACK)
        .sprint('\xfe'.repeat(this.cycles()), dx + 10, dy + 4, HIGHLIGHT_BRIGHT, BLACK);
  }
  
  renderNodeStats(delta, spatial) {
    const dx = spatial.x + 2;
    let dy = spatial.y + 10;
    
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
            .sprint(enumLabel(NodeType, type), dx + 8, dy, HIGHLIGHT_BRIGHT, BLACK)
            .sprint('BIOS', dx, ++dy, BLUE_BRIGHT, BLACK)
            .sprint(biosVersion, dx + 8, dy, HIGHLIGHT_BRIGHT, BLACK);
        break;

      case ChipType.CAM:
        const camVersion = enumLabel(ChipCamVersion, component.version);
        const status = chip.get(RetCamStatusComponent).status;
        const statusLabel = enumLabel(RetCamStatus, status);
        const statusColor = status == RetCamStatus.DISCONNECTED ?
            RED_MAGENTA_BRIGHT :
            BLUE_BRIGHT;
        draw.sprint('CAMERA', dx, ++dy, BLUE_BRIGHT, BLACK)
            .sprint(camVersion, dx + 8, dy, HIGHLIGHT_BRIGHT, BLACK)
            .sprint('STATUS', dx, ++dy, BLUE_BRIGHT, BLACK)
            .sprint(statusLabel, dx + 8, dy, statusColor, BLACK);
        break;

      case ChipType.CPU:
        const cpuVersion = enumLabel(ChipCpuVersion, component.version);
        draw.sprint('CPU', dx, ++dy, BLUE_BRIGHT, BLACK)
            .sprint(cpuVersion, dx + 8, dy, HIGHLIGHT_BRIGHT, BLACK);
        break;

      case ChipType.MEM:
        const memVersion = enumLabel(ChipMemVersion, component.version);
        draw.sprint('RAM', dx, ++dy, BLUE_BRIGHT, BLACK)
            .sprint(memVersion, dx + 8, dy, HIGHLIGHT_BRIGHT, BLACK);
        break;

      case ChipType.NIC:
        const nicVersion = enumLabel(ChipNicVersion, component.version);
        const ip = chip.get(IpComponent).ip.join('.');
        const connection = this.connection(chip);
        const nicStatus = connection.get(ConnectionComponent).connected ?
            'CONNECTED' :
            'DISCONNECTED';
        draw.sprint('NIC', dx, ++dy, BLUE_BRIGHT, BLACK)
            .sprint(nicVersion, dx + 8, dy, HIGHLIGHT_BRIGHT, BLACK)
            .sprint('IP', dx, ++dy, BLUE_BRIGHT, BLACK)
            .sprint(ip, dx + 8, dy, HIGHLIGHT_BRIGHT, BLACK)
            .sprint('STATUS', dx, ++dy, BLUE_BRIGHT, BLACK)
            .sprint(nicStatus, dx + 8, dy, HIGHLIGHT_BRIGHT, BLACK);
        break;
    }
    
    const activeSentry = this.activeSentry();
    if (!activeSentry || !activeSentry.get(IdentifiedComponent).identified) {
      return;
    }
    
    const capabilities = activeSentry.get(SentryComponent).capabilities;
    const state = activeSentry.get(SentryComponent).state;
    
    let capStr = '';
    for (const cap of capabilities) {
      if (capStr.length) {
        capStr += ', ';
      }
      capStr += enumLabel(SentryCapabilities, cap);
    }
    
    dy++;
    draw.sprint('SENTRY', dx, ++dy, BLUE_BRIGHT, BLACK)
        .sprint(enumLabel(SentryState, state), dx + 8, dy, HIGHLIGHT_BRIGHT, BLACK)
        .sprint('CAPS', dx, ++dy, BLUE_BRIGHT, BLACK)
        .sprint(capStr, dx + 8, dy, HIGHLIGHT_BRIGHT, BLACK);
  }
  
  renderDeckStats(delta, spatial) {
    const dx = spatial.x + 2;
    let dy = spatial.y + 19;
    
    const draw = this.drawing.clipping(spatial);
    const deck = this.deck().items;
    for (const key of deck.keys()) {
      const action = this.actions.get(key);
      if (action.hidden) {
        continue;
      }
      const stats = deck.get(key);
      const chip = action instanceof ChipScriptAction ?
          ActionChipIcon.get(action.chipType) :
          '-';
      const refresh = stats == Infinity ? '-' : ActionRefreshIcon.get(action.refresh);
      const count = stats == Infinity ? '-' : String(stats);
      const cycles = String(action.cycles);
      const stealth = String(action.stealthCost);
      draw.sprint(chip, dx, ++dy, BLACK, BLUE_BRIGHT)
          .sprint(refresh, dx + 1, dy, BLACK, HIGHLIGHT_BRIGHT)
          .sprint(count, dx + 2, dy, BLACK, BLUE_BRIGHT)
          .sprint(cycles, dx + 3, dy, BLACK, HIGHLIGHT_BRIGHT)
          .sprint(stealth, dx + 4, dy, BLACK, WHITE)
          .sprint(key, dx + 6, dy, HIGHLIGHT_BRIGHT, BLACK);
    }
  }
  
  frame(delta) {
    const spatial = this.statusViewSpatial();
    this.clipper.x = spatial.x;
    this.clipper.y = spatial.y;
    this.clipper.width = spatial.width - 4;
    this.clipper.height = spatial.height;
    
    this.renderFrames(delta, spatial);
    this.renderRunStats(delta, this.clipper);
    this.renderNodeStats(delta, this.clipper);
    this.renderDeckStats(delta, this.clipper);
  }
}

export {StatusRendererSystem};