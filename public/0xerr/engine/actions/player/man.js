import {PLAYER} from '../qualifiers.js';
import {Action, ActionRefreshEnum} from '../../action.js';
import {ChipScriptAction, ANY_CHIP} from './lib/chipscript.js';
import {ChipType} from '../../components/chip.js';
import {EventManager} from '../../event/manager.js';
import {EventType} from '../../event/type.js';
import {SentryScriptAction} from './lib/sentryscript.js';
import {enumLabel} from '../../../stdlib/collections.js';
import {ij, ijmap} from '../../../injection/api.js';

class ManAction extends Action {
  constructor(
      events = ij(EventManager),
      actions = ijmap(Action, PLAYER)) {
    super();
    this.events = events;
    this.actions = actions;
    
    this.man = [
      'USAGE: MAN <SCRIPT>',
      'LOGS TARGET SCRIPT\'S USAGE.',
    ];
  }
  
  constraints(scriptName) {
    if (!scriptName) {
      this.start('MAN');
      return false;
    }
    
    if (!this.actions.has(scriptName)) {
      this.events.emit(EventType.LOG, 'UNKOWN SCRIPT');
      return false;
    }
    
    return true;
  }
  
  start(scriptName) {
    const action = this.actions.get(scriptName);
    
    let type = '';
    if (action instanceof ChipScriptAction) {
      type += 'CHIP ';
      if (action.chipType == ANY_CHIP) {
        type += 'ANY';
      } else {
        type += enumLabel(ChipType, action.chipType);
      }
    } else if (action instanceof SentryScriptAction) {
      type += 'SENTRY';
    } else {
      type += 'MISC';
    }
    this.events.emit(EventType.LOG, `TYPE: ${type}`);
    
    const refresh = action.limit == Infinity ? '-' : enumLabel(ActionRefreshEnum, action.refresh);
    this.events.emit(EventType.LOG, `REFRESH: ${refresh}`);
    
    const limit = action.limit == Infinity ? 'UNLIMITED' : action.limit;
    this.events.emit(EventType.LOG, `LIMIT: ${limit}`);
    
    const cycles = action.cycles;
    this.events.emit(EventType.LOG, `CYCLES: ${cycles}`);
    
    const stealth = action.stealthCost;
    this.events.emit(EventType.LOG, `STEALTH: ${stealth}`);
    
    this.events.emit(EventType.LOG, ' ');
    const lines = action.man;
    for (const line of lines) {
      this.events.emit(EventType.LOG, line);
    }
  }
}

export {ManAction};