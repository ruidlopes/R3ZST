import {Action, ActionType} from '../../../action.js';
import {ActiveComponent} from '../../../components/active.js';
import {ChipComponent, ChipType} from '../../../components/chip.js';
import {EntityLib} from '../../../entity/lib.js';
import {EntityManager} from '../../../entity/manager.js';
import {EventManager} from '../../../event/manager.js';
import {EventType} from '../../../event/type.js';
import {IdentifiedComponent} from '../../../components/identified.js';
import {firstOf, setOf} from '../../../../stdlib/collections.js';
import {ij} from '../../../../injection/api.js';

const ANY_CHIP = Symbol('ANY_CHIP');

class ChipScriptAction extends Action {
  constructor(
      chipType = ANY_CHIP,
      entities = ij(EntityManager),
      lib = ij(EntityLib),
      events = ij(EventManager)) {
    super();
    this.types = setOf(ActionType.CHIP);
    this.chipType = chipType;

    this.entities = entities;
    this.lib = lib;
    this.events = events;
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