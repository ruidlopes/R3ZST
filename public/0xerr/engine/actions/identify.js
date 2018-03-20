import {Action} from '../action.js';
import {ChipComponent, ChipType} from '../components/chip.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {IdentifiedComponent} from '../components/identified.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class IdentifyAction extends Action {
  constructor(
      manager = ij(EntityManager),
      events = ij(EventManager)) {
    super();
    this.manager = manager;
    this.events = events;
    
    this.title = 'IDENTIFY';
    this.command = 'ID';
    this.cycles = 1;
        
    this.chipId = undefined;
        
    this.events.subscribe(
        EventType.PLAYER_INSIDE_CHIP,
        (id) => this.chipId = id);
    this.events.subscribe(
        EventType.PLAYER_OUTSIDE_CHIPS,
        () => this.chipId = undefined);
  }
  
  constraints() {
    return Number.isInteger(this.chipId);
  }
  
  execute() {
    if (!this.constraints()) {
      // TODO error
    }
    const chip = firstOf(this.manager.query([this.chipId])
        .iterate(ChipComponent, IdentifiedComponent));
    chip.get(IdentifiedComponent).identified = true;
    
    // TODO log
  }
}

export {IdentifyAction};