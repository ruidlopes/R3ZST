import {ActionRefreshEnum} from '../../action.js';
import {ChipScriptAction} from './lib/chipscript.js';
import {ChipType} from '../../components/chip.js';
import {CyclesComponent, CYCLES_MAX} from '../../components/cycles.js';
import {EntityManager} from '../../entity/manager.js';
import {EventManager} from '../../event/manager.js';
import {EventType} from '../../event/type.js';
import {ij} from '../../../injection/api.js';

class StealCyclesAction extends ChipScriptAction {
  constructor(
      entities = ij(EntityManager),
      events = ij(EventManager)) {
    super(entities, events, ChipType.CPU);
    this.stealthCost = 2;
    this.limit = 2;
    this.refresh = ActionRefreshEnum.TURN;
    
  }
  
  cyclesComponent() {
    return this.entities.query()
        .head(CyclesComponent)
        .get(CyclesComponent);
  }
  
  start() {
    this.cyclesComponent().cycles = CYCLES_MAX;
    this.events.emit(EventType.LOG, 'REFILLED CYCLES.');
  }
}

export {StealCyclesAction};