import {ChipScriptAction} from './lib/chipscript.js';
import {ChipType} from '../../components/chip.js';
import {EventType} from '../../event/type.js';
import {TurnActionsComponent} from '../../components/turnactions.js';

class DeleteLogAction extends ChipScriptAction {
  constructor() {
    super(ChipType.MEM);
    this.cycles = 4;
    this.limit = 1;
    
    this.man = [
      'USAGE: DELETELOG',
      'DELETES ALL LOGS FROM THE CURRENT TURN.',
      'INCREASES STEALTH BY +2.',
    ];
  }
  
  turnActions() {
    return this.entities.query()
        .head(TurnActionsComponent)
        .get(TurnActionsComponent);
  }
  
  start() {
    const turnActions = this.turnActions();
    turnActions.chipActions.clear();
    turnActions.globalActions.clear();
    
    this.events.emit(EventType.LOG, 'CURRENT TURN LOGS DELETED.');
    this.events.emit(EventType.STEALTH_UPDATE, +2);
  }
}

export {DeleteLogAction};