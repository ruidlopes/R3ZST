import {ActionRefreshEnum} from '../../action.js';
import {ChipScriptAction} from './base/chipscript.js';
import {ChipType} from '../../components/chip.js';
import {EntityManager} from '../../entity/manager.js';
import {EventManager} from '../../event/manager.js';
import {EventType} from '../../event/type.js';
import {constant} from '../../../stdlib/functions.js';
import {ij} from '../../../injection/api.js';

class OverclockAction extends ChipScriptAction {
  constructor(
      entities = ij(EntityManager),
      events = ij(EventManager)) {
    super(entities, events, ChipType.BIOS);
    this.cycles = 4;
    this.limit = 1;
    this.refresh = ActionRefreshEnum.NODE;
    
    this.handler = undefined;
    this.events.subscribe(
        EventType.END_TURN, () => this.turnEnd());
    this.events.subscribe(
        EventType.NODE, () => this.turnEnd());
  }
  
  start() {
    this.handler = this.events.subscribe(
        EventType.CYCLES, constant((cycles) => this.updateCycles(cycles)));
    this.events.emit(
        EventType.LOG, 'OVERCLOCKED NODE.');
    this.events.emit(
        EventType.LOG, 'SCRIPTS COST HALF THE CYCLES (ROUNDED UP) UNTIL END OF TURN OR CONNECTING TO ANOTHER NODE.');
  }
  
  updateCycles(cycles) {
    return Math.ceil(cycles / 2);
  }
  
  turnEnd() {
    if (this.handler) {
      this.handler.unsubscribe();
      this.handler = undefined;
    }
  }
}

export {OverclockAction};