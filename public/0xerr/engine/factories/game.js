import {PLAYER} from '../actions/qualifiers.js';
import {Action} from '../action.js';
import {ActionHistoryComponent} from '../components/actionhistory.js';
import {DeckComponent} from '../components/deck.js';
import {EntityManager} from '../entity/manager.js';
import {TurnActionsComponent} from '../components/turnactions.js';
import {TurnComponent, TurnEnum} from '../components/turn.js';
import {ij, ijmap} from '../../injection/api.js';

class GameFactory {
  constructor(
      entities = ij(EntityManager),
      actions = ijmap(Action, PLAYER)) {
    this.entities = entities;
    this.actions = actions;
  }
  
  make() {
    this.entities.add(
        this.entities.nextId(),
        new TurnComponent(TurnEnum.PLAYER));
    this.entities.add(
        this.entities.nextId(),
        new TurnActionsComponent());
    this.entities.add(
        this.entities.nextId(),
        new ActionHistoryComponent());
    
    const deck = new DeckComponent();
    for (const [key, action] of this.actions.entries()) {
      deck.items.set(key, action.limit);
    }
    
    this.entities.add(this.entities.nextId(), deck);
  }
}

export {GameFactory};