import {Observer} from './observer.js';

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
      if (this.keys.get(key) == KeyState.RELEASED) {
        this.keys.set(key, KeyState.NONE);
      }
    }
  }
  
  keydown(e) {
    const key = e.key.toUpperCase();
    if (!this.keys.has(key)) {
      this.keys.set(key, KeyState.NONE);
    }
    
    if (this.keys.get(key) == KeyState.NONE) {
      this.keys.set(key, KeyState.PRESSED);
    } else if (this.keys.get(key) == KeyState.PRESSED) {
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
    
    if (this.keys.get(key) == KeyState.PRESSED ||
        this.keys.get(key) == KeyState.HELD) {
      this.keys.set(key, KeyState.RELEASED);
    }
    e.preventDefault();
    e.stopPropagation();
  }
  
  capturingDown(key) {
    return this.keys.has(key) &&
        (this.keys.get(key) == KeyState.PRESSED ||
         this.keys.get(key) == KeyState.HELD);
  }
  
  capturingUp(key) {
    return this.keys.has(key) && this.keys.get(key) == KeyState.RELEASED;
  }
}

export {
  KeyState,
  Keyboard,
};