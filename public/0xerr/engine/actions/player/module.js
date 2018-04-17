import {PLAYER} from '../qualifiers.js';
import {Action} from '../../action.js';
import {ChipIdAction} from './chipid.js';
import {ConnectAction} from './connect.js';
import {DebugAction} from './debug.js';
import {EndTurnAction} from './endturn.js';
import {IfConfigAction} from './ifconfig.js';
import {KillCamAction} from './killcam.js';
import {Module} from '../../../injection/module.js';
import {OverclockAction} from './overclock.js';
import {PreemptAction} from './preempt.js';
import {RefreshAction} from './refresh.js';
import {TraceBiosAction} from './tracebios.js';

class PlayerActionsModule extends Module {
  configure() {
    this.bindClassIntoMap(Action, PLAYER, 'CHIPID', ChipIdAction);
    this.bindClassIntoMap(Action, PLAYER, 'CONNECT', ConnectAction);
    this.bindClassIntoMap(Action, PLAYER, 'DEBUG', DebugAction);
    this.bindClassIntoMap(Action, PLAYER, 'ENDTURN', EndTurnAction);
    this.bindClassIntoMap(Action, PLAYER, 'IFCONFIG', IfConfigAction);
    this.bindClassIntoMap(Action, PLAYER, 'KILLCAM', KillCamAction);
    this.bindClassIntoMap(Action, PLAYER, 'OVERCLOCK', OverclockAction);
    this.bindClassIntoMap(Action, PLAYER, 'PREEMPT', PreemptAction);
    this.bindClassIntoMap(Action, PLAYER, 'REFRESH', RefreshAction);
    this.bindClassIntoMap(Action, PLAYER, 'TRACEBIOS', TraceBiosAction);
  }
}

export {PlayerActionsModule};