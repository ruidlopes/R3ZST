import {
    BLACK,
    BLUE_BRIGHT,
    BLUE_FADED,
    BLUE_FADED2,
    ORANGE_BRIGHT,
} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {BoxType} from '../../renderer/primitives/boxes.js';
import {CyclesComponent} from '../components/cycles.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
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
  
  frame(delta) {
    this.renderFrame(delta);
    this.renderGameStats(delta);
  }
}

export {StatusRendererSystem};