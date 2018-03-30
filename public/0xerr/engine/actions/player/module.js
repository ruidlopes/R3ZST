import {PLAYER} from '../qualifiers.js';
import {Action} from '../../action.js';
import {ChipIdAction} from './chipid.js';
import {ConnectAction} from './connect.js';
import {EndTurnAction} from './endturn.js';
import {RetCamKillAction} from './retcamkill.js';
import {Module} from '../../../injection/module.js';

class PlayerActionsModule extends Module {
  configure() {
    this.bindClassIntoMap(Action, PLAYER, 'CHIPID', ChipIdAction);
    this.bindClassIntoMap(Action, PLAYER, 'CONNECT', ConnectAction);
    this.bindClassIntoMap(Action, PLAYER, 'ENDTURN', EndTurnAction);
    this.bindClassIntoMap(Action, PLAYER, 'RETCAMKILL', RetCamKillAction);
  }
}

export {PlayerActionsModule};