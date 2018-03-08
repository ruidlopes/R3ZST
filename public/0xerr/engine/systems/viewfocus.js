import {Keyboard} from '../../observers/keyboard.js';
import {ij} from '../../injection/api.js';

class ViewFocusSystem {
  constructor(keyboard = ij(Keyboard)) {
    this.keyboard = keyboard;
  }
}

export {ViewFocusSystem};