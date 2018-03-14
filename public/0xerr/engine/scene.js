import {StateMachine} from '../stdlib/statemachine.js';

class Scene {
  constructor() {
    this.sm = new StateMachine();
    this.timestamp = 0;
    this.delta = 0;
  }
  
  start(timestamp) {
    this.timestamp = timestamp;
    this.delta = 0;
  }
  
  tick(timestamp) {
    this.delta = timestamp - this.timestamp;
    this.timestamp = timestamp;
    this.sm.state(this.delta);
  }
}

export {Scene};