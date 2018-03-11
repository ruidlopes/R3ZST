import {StateMachine} from '../stdlib/statemachine.js';

class Scene {
  constructor() {
    this.width = 0;
    this.height = 0;
    
    this.sm = new StateMachine();
    
    this.timestamp = 0;
    this.delta = 0;
  }
  
  start(timestamp) {
    this.timestamp = timestamp;
    this.delta = 0;
  }
  
  resize(width, height) {
    this.width = width;
    this.height = height;
  }
  
  tick(timestamp) {
    this.delta = timestamp - this.timestamp;
    this.sm.state();
  }
}

export {Scene};