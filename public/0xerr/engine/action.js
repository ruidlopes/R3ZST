import {enumOf} from '../stdlib/collections.js';

const ActionRefreshEnum = enumOf(
  'TURN',
  'NODE',
  'ZERO',
);

class Action {
  constructor() {
    this.cycles = 0;
    this.stealthCost = 0;
    
    this.limit = Infinity;
    this.refresh = ActionRefreshEnum.TURN;
    this.hidden = false;
  }
  
  constraints() {
    return true;
  }
  
  start() {}
  
  done() {
    return true;
  }
  
  frame(delta) {}
}

export {
  Action,
  ActionRefreshEnum,
};