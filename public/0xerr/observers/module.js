import {Keyboard} from './keyboard.js';
import {Module} from '../injection/module.js';
import {Viewport} from './viewport.js';

class ObserversModule extends Module {

  configure() {
    this.bindClass(Keyboard);
    this.bindClass(Viewport);
  }
}

export {ObserversModule};