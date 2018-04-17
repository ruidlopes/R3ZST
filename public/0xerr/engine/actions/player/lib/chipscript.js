import {Action} from '../../../action.js';
import {ActiveComponent} from '../../../components/active.js';
import {ChipComponent, ChipType} from '../../../components/chip.js';
import {EventType} from '../../../event/type.js';
import {IdentifiedComponent} from '../../../components/identified.js';
import {firstOf} from '../../../../stdlib/collections.js';

const ANY_CHIP = Symbol('ANY_CHIP');

class ChipScriptAction extends Action {
  constructor(entities, events, chipType = ANY_CHIP) {
    super();
    this.entities = entities;
    this.events = events;
    this.chipType = chipType;
  }
  
  activeChip() {
    return this.activeChipWithComponents();
  }
  
  activeChipWithComponents(...components) {
    return firstOf(this.entities.query()
        .filter(ActiveComponent, component => component.active)
        .filter(ChipComponent)
        .iterate(ChipComponent, ActiveComponent, IdentifiedComponent, ...components));
  }
  
  constraints() {
    const activeChip = this.activeChip();
    if (!activeChip) {
      this.events.emit(EventType.LOG, 'NO CHIP IN RANGE.');
      return false;
    }
    
    if (!activeChip.get(IdentifiedComponent).identified) {
      this.events.emit(EventType.LOG, 'UNIDENTIFIED CHIP.');
      return false;
    }
    
    if (this.chipType != ANY_CHIP &&
        activeChip.get(ChipComponent).type != this.chipType) {
      this.events.emit(EventType.LOG, 'INVALID CHIP.');
      return false;
    }
    
    return true;
  }
}

export {
  ChipScriptAction,
  ANY_CHIP,
};