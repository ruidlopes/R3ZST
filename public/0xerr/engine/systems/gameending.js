import {ChipComponent, ChipType} from '../components/chip.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {RetCamStatusComponent, RetCamStatus} from '../components/retcamstatus.js';
import {StealthComponent, STEALTH_MAX} from '../components/stealth.js';
import {System} from '../system.js';
import {TurnEnum} from '../components/turn.js';
import {clamp} from '../../stdlib/math.js';
import {ij} from '../../injection/api.js';

class GameEndingSystem extends System {
  constructor(
      entities = ij(EntityManager),
      events = ij(EventManager)) {
    super();
    this.entities = entities;
    this.events = events;
        
    this.events.subscribe(
        EventType.STEALTH_UPDATE,
        (delta) => this.updateStealth(delta));
    this.events.subscribe(
        EventType.END_TURN,
        (turn) => this.turnEnd(turn));
  }
  
  stealthComponent() {
    return this.entities.query()
        .head(StealthComponent)
        .get(StealthComponent);
  }
  
  notDisconnectedRetCamCount() {
    return this.entities.query()
        .filter(ChipComponent, chip => chip.type == ChipType.CAM)
        .filter(RetCamStatusComponent, component => component.status != RetCamStatus.DISCONNECTED)
        .count();
  }
  
  updateStealth(delta) {
    const stealthComponent = this.stealthComponent();
    stealthComponent.stealth = clamp(
        stealthComponent.stealth + delta, 0, STEALTH_MAX);
    
    const verb = delta > 0 ? 'INCREASED' : 'DECREASED';
    const absolute = Math.abs(delta);
    this.events.emit(EventType.LOG, `${verb} STEALTH BY ${absolute}.`);
    
    if (stealthComponent.stealth == 0) {
      this.events.emit(EventType.DISCONNECTED);
    }
  }
  
  turnEnd(turn) {
    if (turn != TurnEnum.RETSAFE) {
      return;
    }
    
    if (this.notDisconnectedRetCamCount() == 0) {
      this.events.emit(EventType.VICTORY);
    }
  }
}

export {GameEndingSystem};