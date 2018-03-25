import {RETSAFE} from '../qualifiers.js';
import {Action} from '../../action.js';
import {DetectChipIdAction} from './detectchipid.js';
import {Module} from '../../../injection/module.js';

class RetsafeActionsModule extends Module {
  configure() {
    this.bindClassIntoSet(Action, RETSAFE, DetectChipIdAction);
  }
}

export {RetsafeActionsModule};