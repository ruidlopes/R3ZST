import {enumOf, setOf} from '../stdlib/collections.js';

const ActionType = enumOf(
  'CHIP',
  'SENTRY',
  'SCRIPT',
  'GLOBAL',
);

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
    
    this.types = setOf();
    this.man = ['-'];
  }
  
  constraints() {
    return true;
  }
  
  context() {
    throw new Error('Missing implementation');
  }

  start() {}
  
  done() {
    return true;
  }
  
  frame(delta) {}
}

export {
  Action,
  ActionType,
  ActionRefreshEnum,
};