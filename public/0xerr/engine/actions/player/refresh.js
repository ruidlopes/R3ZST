import {PLAYER} from '../qualifiers.js';
import {Action, ActionType, ActionRefreshEnum} from '../../action.js';
import {DeckComponent} from '../../components/deck.js';
import {EntityManager} from '../../entity/manager.js';
import {EventManager} from '../../event/manager.js';
import {EventType} from '../../event/type.js';
import {firstOf, setOf} from '../../../stdlib/collections.js';
import {ij, ijmap} from '../../../injection/api.js';

class RefreshAction extends Action {
  constructor(
      actions = ijmap(Action, PLAYER),
      events = ij(EventManager),
      entities = ij(EntityManager)) {
    super();
    this.actions = actions;
    this.events = events;
    this.entities = entities;
    
    this.cycles = 5;
    this.limit = 4;
    this.refresh = ActionRefreshEnum.ZERO;
        
    this.types = setOf(ActionType.GLOBAL, ActionType.SCRIPT);
    this.man = [
      'USAGE: REFRESH <SCRIPT>',
      'REFRESHES TARGET SCRIPT.',
    ];
  }
  
  constraints(target) {
    if (!this.actions.has(target)) {
      this.events.emit(
          EventType.LOG,
          `${target} SCRIPT DOES NOT EXIST.`);
      return false;
    }
    if (this.actions.get(target).limit == Infinity) {
      this.events.emit(
          EventType.LOG,
          `${target} IS ALREADY UNLIMITED`);
      return false;
    }
    return true;
  }
  
  deck() {
    return firstOf(this.entities.query()
        .filter(DeckComponent)
        .iterate(DeckComponent))
        .get(DeckComponent);
  }
  
  start(target) {
    const deck = this.deck().items;
    const action = this.actions.get(target);
    deck.set(target, action.limit);
    this.events.emit(
        EventType.LOG,
        `REFRESHED ${target} TO ${action.limit}.`);
  }
}

export {RefreshAction};