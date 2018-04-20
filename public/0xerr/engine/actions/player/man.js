import {PLAYER} from '../qualifiers.js';
import {Action, ActionType, ActionRefreshEnum} from '../../action.js';
import {ChipScriptAction, ANY_CHIP} from './lib/chipscript.js';
import {ChipType} from '../../components/chip.js';
import {EventManager} from '../../event/manager.js';
import {EventType} from '../../event/type.js';
import {SentryScriptAction} from './lib/sentryscript.js';
import {enumLabel, setOf} from '../../../stdlib/collections.js';
import {ij, ijmap} from '../../../injection/api.js';

class ManAction extends Action {
  constructor(
      events = ij(EventManager),
      actions = ijmap(Action, PLAYER)) {
    super();
    this.events = events;
    this.actions = actions;
    
    this.types = setOf(ActionType.GLOBAL, ActionType.SCRIPT);
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
    
    let types = '';
    for (const type of action.types) {
      if (types.length) {
        types += ' - ';
      }
      types += enumLabel(ActionType, type);
      if (type == ActionType.CHIP) {
        if (action.chipType == ANY_CHIP) {
          types += ' ANY';
        } else {
          types += ' ' + enumLabel(ChipType, action.chipType);
        }
      }
    }
    this.events.emit(EventType.LOG, `TYPES: ${types}`);
    
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