import {PLAYER} from '../qualifiers.js';
import {Action} from '../../action.js';
import {ChipIdAction} from './chipid.js';
import {ConnectAction} from './connect.js';
import {DebugAction} from './debug.js';
import {EndTurnAction} from './endturn.js';
import {KillCamAction} from './killcam.js';
import {OverclockAction} from './overclock.js';
import {RefreshAction} from './refresh.js';
import {Module} from '../../../injection/module.js';

class PlayerActionsModule extends Module {
  configure() {
    this.bindClassIntoMap(Action, PLAYER, 'CHIPID', ChipIdAction);
    this.bindClassIntoMap(Action, PLAYER, 'CONNECT', ConnectAction);
    this.bindClassIntoMap(Action, PLAYER, 'DEBUG', DebugAction);
    this.bindClassIntoMap(Action, PLAYER, 'ENDTURN', EndTurnAction);
    this.bindClassIntoMap(Action, PLAYER, 'KILLCAM', KillCamAction);
    this.bindClassIntoMap(Action, PLAYER, 'OVERCLOCK', OverclockAction);
    this.bindClassIntoMap(Action, PLAYER, 'REFRESH', RefreshAction);
  }
}

export {PlayerActionsModule};