import {Drawing} from './drawing.js';
import {Module} from '../../injection/module.js';

class CommonModule extends Module {
  configure() {
    this.bindClass(Drawing);
  }
}

export {CommonModule};