import {RETSAFE} from '../actions/qualifiers.js';
import {Action} from '../action.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {System} from '../system.js';
import {TurnComponent, TurnEnum} from '../components/turn.js';
import {firstOf, isEmpty} from '../../stdlib/collections.js';
import {ij, ijset} from '../../injection/api.js';

class RetsafeActionsSystem extends System {
  constructor(
      actions = ijset(Action, RETSAFE),
      manager = ij(EntityManager),
      events = ij(EventManager)) {
    super();
    this.actions = actions;
    this.actionIterator = undefined;
    this.currentAction = undefined;
        
    this.manager = manager;
    this.events = events;
    this.events.subscribe(
        EventType.END_TURN,
        (turn) => this.setUpActionIterator(turn));
  }
  
  setUpActionIterator(turn) {
    if (turn == TurnEnum.PLAYER) {
      this.actionIterator = this.actions[Symbol.iterator]();
    } else {
      this.actionIterator = undefined;
    }
  }
  
  isRetsafeTurn() {
    return this.manager.query()
        .filter(TurnComponent, component => component.turn == TurnEnum.RETSAFE)
        .count() == 1;
  }
  
  frame(delta) {
    if (!this.isRetsafeTurn() ||
        !this.actionIterator) {
      return;
    }

    const next = this.actionIterator.next();
    if (next.done) {
      this.events.emit(EventType.END_TURN, TurnEnum.RETSAFE);
      return;
    }
    
    if (!this.currentAction) {
      this.currentAction = next.value;
      if (this.currentAction.constraints()) {
        this.currentAction.start();
      }
    }
    
    if (!this.currentAction.done()) {
      this.currentAction.frame(delta);
    }
  }
}

export {RetsafeActionsSystem};