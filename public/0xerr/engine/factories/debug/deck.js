import {PLAYER} from '../../actions/qualifiers.js';
import {Action} from '../../action.js';
import {DeckComponent} from '../../components/deck.js';
import {EntityManager} from '../../entity/manager.js';
import {ij, ijmap} from '../../../injection/api.js';

class DeckFactory {
  constructor(
      entities = ij(EntityManager),
      actions = ijmap(Action, PLAYER)) {
    this.entities = entities;
    this.actions = actions;
  }
  
  make() {
    const deck = new DeckComponent();
    for (const [key, action] of this.actions.entries()) {
      deck.items.set(key, action.limit);
    }
    
    this.entities.add(this.entities.nextId(), deck);
  }
}

export {DeckFactory};