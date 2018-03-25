import {Action} from '../action.js';
import {PlayerActionsModule} from './player/module.js';
import {RetsafeActionsModule} from './retsafe/module.js';
import {Module} from '../../injection/module.js';

class ActionsModule extends Module {
  configure() {
    this.install(new PlayerActionsModule());
    this.install(new RetsafeActionsModule());
  }
}

export {ActionsModule};