import {ChipComponent, ChipType} from '../components/chip.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {RetCamStatusComponent, RetCamStatus} from '../components/retcamstatus.js';
import {StealthComponent, STEALTH_MAX} from '../components/stealth.js';
import {System} from '../system.js';
import {clamp} from '../../stdlib/math.js';
import {firstOf} from '../../stdlib/collections.js';
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
  }
  
  stealthComponent() {
    return firstOf(this.entities.query()
        .filter(StealthComponent)
        .first()
        .iterate(StealthComponent))
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
    
    if (stealthComponent.stealth == 0) {
      this.events.emit(EventType.DISCONNECTED);
    }
  }
  
  frame(delta) {
    if (this.notDisconnectedRetCamCount() == 0) {
      this.events.emit(EventType.VICTORY);
    }
  }
}

export {GameEndingSystem};