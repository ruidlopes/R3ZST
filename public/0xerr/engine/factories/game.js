import {ActionHistoryComponent} from '../components/actionhistory.js';
import {EntityManager} from '../entity/manager.js';
import {TurnActionsComponent} from '../components/turnactions.js';
import {TurnComponent, TurnEnum} from '../components/turn.js';
import {ij} from '../../injection/api.js';

class GameFactory {
  constructor(entities = ij(EntityManager)) {
    this.entities = entities;
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
  }
}

export {GameFactory};