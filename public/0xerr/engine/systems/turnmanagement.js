import {CyclesComponent, CYCLES_MAX} from '../components/cycles.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {System} from '../system.js';
import {TurnActionsComponent} from '../components/turnactions.js';
import {TurnComponent, TurnEnum} from '../components/turn.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class TurnManagementSystem extends System {
  constructor(
      manager = ij(EntityManager),
      events = ij(EventManager)) {
    super();
    this.manager = manager;
    this.events = events;
        
    this.events.subscribe(
        EventType.END_TURN,
        (turn) => this.endTurn(turn));
  }
  
  turnComponent() {
    return this.manager.query()
        .head(TurnComponent)
        .get(TurnComponent);
  }
  
  cyclesComponent() {
    return this.manager.query()
        .head(CyclesComponent)
        .get(CyclesComponent);
  }
  
  turnActionsComponent() {
    return this.manager.query()
        .head(TurnActionsComponent)
        .get(TurnActionsComponent);
  }
  
  endTurn(turn) {
    const turnComponent = this.turnComponent();
    const cyclesComponent = this.cyclesComponent();
    
    if (turn == TurnEnum.PLAYER) {
      turnComponent.turn = TurnEnum.RETSAFE;
      cyclesComponent.cycles = 0;
      this.events.emit(EventType.LOG, 'END OF PLAYER\'S TURN.');
    } else {
      turnComponent.turn = TurnEnum.PLAYER;
      cyclesComponent.cycles = CYCLES_MAX;
      
      const turnActions = this.turnActionsComponent();
      turnActions.chipActions.clear();
      turnActions.globalActions.clear();
      this.events.emit(EventType.LOG, 'END OF RETSAFE\'S TURN.');
    }
  }
  
  frame(delta) {}
}

export {TurnManagementSystem};