import {MainScene} from './main.js';
import {Module} from '../../injection/module.js';
import {Scene} from '../scene.js';

class ScenesModule extends Module {
  configure() {
    this.bindClassIntoSet(Scene, MainScene);
  }
}

export {ScenesModule};