import {PLAYER} from '../qualifiers.js';
import {Action} from '../../action.js';
import {ChipIdAction} from './chipid.js';
import {EndTurnAction} from './endturn.js';
import {Module} from '../../../injection/module.js';

class PlayerActionsModule extends Module {
  configure() {
    this.bindClassIntoSet(Action, PLAYER, EndTurnAction);
    this.bindClassIntoSet(Action, PLAYER, ChipIdAction);
  }
}

export {PlayerActionsModule};