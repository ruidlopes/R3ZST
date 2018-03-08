import {EntityManager} from '../entity/manager.js';
import {Keyboard} from '../../observers/keyboard.js';
import {KeyModifiers} from '../../observers/keyboard/modifiers.js';
import {KeyShortcut} from '../../observers/keyboard/shortcut.js';
import {System} from '../system.js';
import {ij} from '../../injection/api.js';

class ViewFocusSystem extends System {
  constructor(
      keyboard = ij(Keyboard),
      manager = ij(EntityManager)) {
    super();
    this.keyboard = keyboard;
    this.manager = manager;
    this.shortcutNext = new KeyShortcut('TAB');
    this.shortcutPrev = new KeyShortcut('TAB', KeyModifiers.SHIFT);
  }
  
  entities() {
    return this.manager.query()
        .none()
        .collect();
  }
  
  frame(delta) {
    if (this.keyboard.releasedAny(this.shortcutNext)) {
      console.log('next');
    } else if (this.keyboard.releasedAny(this.shortcutPrev)) {
      console.log('prev');
    }
  }
}

export {ViewFocusSystem};