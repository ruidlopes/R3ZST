import {Action} from '../action.js';
import {EndTurnAction} from './endturn.js';
import {IdentifyAction} from './identify.js';
import {Module} from '../../injection/module.js';

class ActionsModule extends Module {
  configure() {
    this.bindClassIntoSet(Action, EndTurnAction);
    this.bindClassIntoSet(Action, IdentifyAction);
  }
}

export {ActionsModule};