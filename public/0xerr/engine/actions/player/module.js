import {PLAYER} from '../qualifiers.js';
import {Action} from '../../action.js';
import {EndTurnAction} from './endturn.js';
import {IdentifyAction} from './identify.js';
import {Module} from '../../../injection/module.js';

class PlayerActionsModule extends Module {
  configure() {
    this.bindClassIntoSet(Action, PLAYER, EndTurnAction);
    this.bindClassIntoSet(Action, PLAYER, IdentifyAction);
  }
}

export {PlayerActionsModule};