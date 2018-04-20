import {ActionRefreshEnum} from '../../action.js';
import {ChipScriptAction} from './lib/chipscript.js';
import {ChipType} from '../../components/chip.js';
import {EventType} from '../../event/type.js';
import {constant} from '../../../stdlib/functions.js';

class OverclockAction extends ChipScriptAction {
  constructor() {
    super(ChipType.BIOS);
    this.cycles = 4;
    this.limit = 1;
    this.refresh = ActionRefreshEnum.NODE;
    
    this.man = [
      'USAGE: OVERCLOCK',
      'ALL SCRIPTS COST HALF THE CYCLES (ROUNDED UP) UNTIL ONE OF:',
      '- THE END OF THE PLAYER\'S TURN;',
      '- CONNECTING TO ANOTHER NODE.',
    ];
    
    this.handler = undefined;
    this.events.subscribe(
        EventType.END_TURN, () => this.end());
    this.events.subscribe(
        EventType.NODE, () => this.end());
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
  
  end() {
    if (this.handler) {
      this.handler.unsubscribe();
      this.handler = undefined;
    }
  }
}

export {OverclockAction};