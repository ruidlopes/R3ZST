import {MainScene} from './main.js';
import {Module} from '../../injection/module.js';

class ScenesModule extends Module {
  configure() {
    this.bindClass(MainScene);
  }
}

export {ScenesModule};