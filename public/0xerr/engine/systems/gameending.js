import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {StealthComponent, STEALTH_MAX} from '../components/stealth.js';
import {System} from '../system.js';
import {clamp} from '../../stdlib/math.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class GameEndingSystem extends System {
  constructor(
      manager = ij(EntityManager),
      events = ij(EventManager)) {
    super();
    this.manager = manager;
    this.events = events;
        
    this.events.subscribe(
        EventType.STEALTH_UPDATE,
        (delta) => this.updateStealth(delta));
  }
  
  stealthComponent() {
    return firstOf(this.manager.query()
        .filter(StealthComponent)
        .first()
        .iterate(StealthComponent))
        .get(StealthComponent);
  }
  
  updateStealth(delta) {
    const stealthComponent = this.stealthComponent();
    stealthComponent.stealth = clamp(
        stealthComponent.stealth + delta, 0, STEALTH_MAX);
    
    if (stealthComponent.stealth == 0) {
      this.events.emit(EventType.DISCONNECTED);
    }
  }
  
  frame(delta) {}
}

export {GameEndingSystem};