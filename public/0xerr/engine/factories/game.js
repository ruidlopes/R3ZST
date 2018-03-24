import {EntityManager} from '../entity/manager.js';
import {TurnActionsComponent} from '../components/turnactions.js';
import {TurnComponent, TurnEnum} from '../components/turn.js';
import {ij} from '../../injection/api.js';

class GameFactory {
  constructor(manager = ij(EntityManager)) {
    this.manager = manager;
  }
  
  make() {
    this.manager.add(
        this.manager.nextId(),
        new TurnComponent(TurnEnum.PLAYER));
    this.manager.add(
        this.manager.nextId(),
        new TurnActionsComponent());
  }
}

export {GameFactory};