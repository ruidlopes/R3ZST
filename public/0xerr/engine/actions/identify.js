import {Action} from '../action.js';
import {ChipComponent, ChipType} from '../components/chip.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {IdentifiedComponent} from '../components/identified.js';
import {enumLabel, firstOf} from '../../stdlib/collections.js';
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
      this.events.emit(
          EventType.LOG,
          'NO COMPONENT IN RANGE.');
      return;
    }
    
    const chip = firstOf(this.manager.query([this.chipId])
        .iterate(ChipComponent, IdentifiedComponent));
    chip.get(IdentifiedComponent).identified = true;
    
    const type = enumLabel(ChipType, chip.get(ChipComponent).type);
    const version = chip.get(ChipComponent).version;
    this.events.emit(
        EventType.LOG,
        `IDENTIFIED ${type} ${version}`); 
  }
}

export {IdentifyAction};