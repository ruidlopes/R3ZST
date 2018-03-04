import {KeyState} from './state.js';

class KeyView {
  constructor() {
    this.states = new Map();
  }
  
  codes() {
    return this.states.keys();
  }
  
  missing(key) {
    return !this.states.has(key);
  }
  
  pressed(key) {
    return this.states.has(key) &&
        this.states.get(key) == KeyState.PRESSED;
  }
  
  press(key) {
    this.states.set(key, KeyState.PRESSED);
  }
  
  held(key) {
    return this.states.has(key) &&
        this.states.get(key) == KeyState.HELD;
  }
  
  hold(key) {
    this.states.set(key, KeyState.HELD);
  }
  
  down(key) {
    return this.pressed(key) || this.held(key);
  }
  
  released(key) {
    return this.states.has(key) &&
        this.states.get(key) == KeyState.RELEASED;
  }
  
  release(key) {
    this.states.set(key, KeyState.RELEASED);
  }
  
  clear() {
    for (const [key, value] of this.states.entries()) {
      if (value == KeyState.RELEASED) {
        this.states.delete(key);
      }
    }
  }
}

export {KeyView};