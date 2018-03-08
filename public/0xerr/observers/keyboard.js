import {KeyView} from './keyboard/view.js';
import {Observer} from './observer.js';

class Keyboard extends Observer {
  constructor() {
    super();
    this.keys = new KeyView();
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
    this.keys.clear();
  }
  
  keydown(e) {
    const key = e.key.toUpperCase();
    if (this.keys.missing(key)) {
      this.keys.press(key);
    } else if (this.keys.pressed(key)) {
      this.keys.hold(key);
    }
    e.preventDefault();
    e.stopPropagation();
  }
  
  keyup(e) {
    const key = e.key.toUpperCase();
    if (this.keys.missing(key)) {
      this.keys.hold(key);
    }
    if (this.keys.pressed(key) || this.keys.held(key)) {
      this.keys.release(key);
    }
    e.preventDefault();
    e.stopPropagation();
  }
  
  down(shortcut) {
    return shortcut.down(this.keys);
  }
  
  downAny(shortcut) {
    return this.down(shortcut).length > 0;
  }
  
  released(shortcut) {
    return shortcut.released(this.keys);
  }
  
  releasedAny(shortcut) {
    return this.released(shortcut).length > 0;
  }
  
  processShortcuts(shortcuts) {
    for (const [shortcut, handler] of shortcuts.entries()) {
      for (const code of shortcut.released(this.keys)) {
        handler(code);
      }
    }
  }
}

export {Keyboard};