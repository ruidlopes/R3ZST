import {Module} from '../../injection/module.js';
import {EventManager} from './manager.js';

class EventModule extends Module {
  configure() {
    this.bindClass(EventManager);
  }
}

export {EventModule};