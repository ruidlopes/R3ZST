import {CyclesComponent, CYCLES_MAX} from '../components/cycles.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {System} from '../system.js';
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
        () => this.endTurn());
  }
  
  turnComponent() {
    return firstOf(this.manager.query()
        .filter(TurnComponent)
        .iterate(TurnComponent))
        .get(TurnComponent);
  }
  
  cyclesComponent() {
    return firstOf(this.manager.query()
        .filter(CyclesComponent)
        .first()
        .iterate(CyclesComponent))
        .get(CyclesComponent);
  }
  
  endTurn() {
    const turnComponent = this.turnComponent();
    const cyclesComponent = this.cyclesComponent();
    
    if (turnComponent.turn == TurnEnum.PLAYER) {
      turnComponent.turn = TurnEnum.RETSAFE;
      cyclesComponent.cycles = 0;
      this.events.emit(EventType.LOG, 'END OF PLAYER\'S TURN.');
    } else {
      turnComponent.turn = TurnEnum.PLAYER;
      cyclesComponent.cycles = CYCLES_MAX;
      this.events.emit(EventType.LOG, 'END OF RETSAFE\'S TURN.');
    }
  }
  
  frame(delta) {}
}

export {TurnManagementSystem};