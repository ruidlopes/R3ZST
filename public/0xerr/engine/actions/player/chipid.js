import {Action, ActionRefreshEnum} from '../../action.js';
import {ActiveComponent} from '../../components/active.js';
import {ChipComponent, ChipType} from '../../components/chip.js';
import {EntityManager} from '../../entity/manager.js';
import {EventManager} from '../../event/manager.js';
import {EventType} from '../../event/type.js';
import {IdentifiedComponent} from '../../components/identified.js';
import {enumLabel, firstOf, isEmpty} from '../../../stdlib/collections.js';
import {ij} from '../../../injection/api.js';

class ChipIdAction extends Action {
  constructor(
      manager = ij(EntityManager),
      events = ij(EventManager)) {
    super();
    this.manager = manager;
    this.events = events;
    
    this.cycles = 1;
    this.limit = 3;
    this.refresh = ActionRefreshEnum.NODE;
  }
  
  activeChip() {
    return this.manager.query()
        .filter(ChipComponent)
        .filter(ActiveComponent, component => component.active)
        .iterate(ChipComponent, ActiveComponent, IdentifiedComponent);
  }
  
  constraints() {
    if (isEmpty(this.activeChip()) ||
        !firstOf(this.activeChip()).get(ActiveComponent).active) {
      this.events.emit(
          EventType.LOG,
          'NO CHIP IN RANGE.');
      return false;
    }
    return true;
  }
  
  start() {
    const chip = firstOf(this.activeChip());
    chip.get(IdentifiedComponent).identified = true;
    
    const type = enumLabel(ChipType, chip.get(ChipComponent).type);
    const version = chip.get(ChipComponent).version;
    this.events.emit(
        EventType.LOG,
        `IDENTIFIED CHIP ${type} ${version}`); 
  }
}

export {ChipIdAction};