import {KeyModifiers} from './keyboard/modifiers.js';
import {Observer} from './observer.js';
import {xnor} from '../stdlib/math.js';

const KeyState = {
  NONE: 0,
  PRESSED: 1,
  HELD: 2,
  RELEASED: 3,
};

class Keyboard extends Observer {
  constructor() {
    super();
    
    this.keys = new Map();
    
    this.keydownHandler = (e) => this.keydown(e);
    this.keyupHandler = (e) => this.keyup(e);
  }
  
  observe() {
    window.addEventListener('keydown', this.keydownHandler, true);
    window.addEventListener('keyup', this.keyupHandler, true);
  }
  
  stop() {
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
  }
  
  reset() {
    for (const key of this.keys.keys()) {
      if (this.released(key)) {
        this.keys.set(key, KeyState.NONE);
      }
    }
  }
  
  none(key) {
    return this.keys.has(key) && this.keys.get(key) == KeyState.NONE;
  }
  
  pressed(key) {
    return this.keys.has(key) && this.keys.get(key) == KeyState.PRESSED;
  }
  
  held(key) {
    return this.keys.has(key) && this.keys.get(key) == KeyState.HELD;
  }
  
  released(key) {
    return this.keys.has(key) && this.keys.get(key) == KeyState.RELEASED;
  }
  
  keydown(e) {
    const key = e.key.toUpperCase();
    if (!this.keys.has(key)) {
      this.keys.set(key, KeyState.NONE);
    }
    
    if (this.none(key)) {
      this.keys.set(key, KeyState.PRESSED);
    } else if (this.pressed(key)) {
      this.keys.set(key, KeyState.HELD);
    }
    e.preventDefault();
    e.stopPropagation();
  }
  
  keyup(e) {
    const key = e.key.toUpperCase();
    if (!this.keys.has(key)) {
      this.keys.set(key, KeyState.HELD);
    }
    
    if (this.pressed(key) || this.held(key)) {
      this.keys.set(key, KeyState.RELEASED);
    }
    e.preventDefault();
    e.stopPropagation();
  }
  
  capturingDown(shortcut) {
    return (this.pressed(shortcut.key) || this.held(shortcut.key)) &&
        xnor(shortcut.modifiers.has(KeyModifiers.ALT),
             this.pressed('ALT') || this.held('ALT')) &&
        xnor(shortcut.modifiers.has(KeyModifiers.SHIFT),
             this.pressed('SHIFT') || this.held('SHIFT')) &&
        xnor(shortcut.modifiers.has(KeyModifiers.CTRL),
             this.pressed('CONTROL') || this.held('CONTROL'));
  }
  
  capturingUp(shortcut) {
    return this.released(shortcut.key) &&
        xnor(shortcut.modifiers.has(KeyModifiers.ALT),
             this.pressed('ALT') || this.held('ALT') || this.released('ALT')) &&
        xnor(shortcut.modifiers.has(KeyModifiers.SHIFT),
             this.pressed('SHIFT') || this.held('SHIFT') || this.released('SHIFT')) &&
        xnor(shortcut.modifiers.has(KeyModifiers.CTRL),
             this.pressed('CONTROL') || this.held('CONTROL') || this.released('CONTROL'));
  }
  
  processShortcuts(shortcuts) {
    for (const [shortcut, handler] of shortcuts.entries()) {
      if (this.capturingUp(shortcut)) {
        handler();
      }
    }
  }
}

export {Keyboard};