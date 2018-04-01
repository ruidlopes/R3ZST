import {enumOf} from '../stdlib/collections.js';

const ActionRefreshEnum = enumOf(
  'TURN',
  'NODE',
  'ZERO',
);

class Action {
  constructor() {
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