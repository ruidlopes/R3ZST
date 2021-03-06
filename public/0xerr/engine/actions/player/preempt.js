import {ActionRefreshEnum} from '../../action.js';
import {ChipScriptAction} from './lib/chipscript.js';
import {ChipType} from '../../components/chip.js';
import {CyclesComponent, CYCLES_MAX} from '../../components/cycles.js';
import {EventType} from '../../event/type.js';

class PreemptAction extends ChipScriptAction {
  constructor() {
    super(ChipType.CPU);
    this.stealthCost = 2;
    this.limit = 2;
    this.refresh = ActionRefreshEnum.TURN;
    
    this.man = [
      'USAGE: PREEMPT',
      'REFILLS CYCLES TO THE MAX.',
    ];
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

export {PreemptAction};