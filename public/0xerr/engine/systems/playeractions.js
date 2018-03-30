import {PLAYER} from '../actions/qualifiers.js';
import {Action} from '../action.js';
import {ActiveComponent} from '../components/active.js';
import {ChipComponent} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {CyclesComponent} from '../components/cycles.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {System} from '../system.js';
import {TextInputComponent} from '../components/textinput.js';
import {TurnActionsComponent} from '../components/turnactions.js';
import {TurnComponent, TurnEnum} from '../components/turn.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {firstOf, isEmpty} from '../../stdlib/collections.js';
import {ij, ijmap} from '../../injection/api.js';

class PlayerActionsSystem extends System {
  constructor(
      actions = ijmap(Action, PLAYER),
      manager = ij(EntityManager),
      events = ij(EventManager)) {
    super();
    this.actions = actions;
    this.queuedActions = new Set();
        
    this.manager = manager;
    this.events = events;
    this.events.subscribe(
        EventType.TEXT_INPUT,
        (id) => this.input(id));
  }
  
  terminalViewChildren() {
    return firstOf(this.manager.query()
        .filter(ViewComponent, view => view.type == ViewType.TERMINAL)
        .first()
        .iterate(CompositeComponent))
        .get(CompositeComponent)
        .ids;
  }
  
  textInput(id) {
    return firstOf(this.manager.query([id])
        .first()
        .iterate(TextInputComponent))
        .get(TextInputComponent);
  }
  
  cyclesComponent() {
    return firstOf(this.manager.query()
        .filter(CyclesComponent)
        .iterate(CyclesComponent))
        .get(CyclesComponent);
  }
  
  isPlayerTurn() {
    return !isEmpty(this.manager.query()
        .filter(TurnComponent, component => component.turn == TurnEnum.PLAYER)
        .collect());
  }
  
  turnActionsComponent() {
    return firstOf(this.manager.query()
        .filter(TurnActionsComponent)
        .first()
        .iterate(TurnActionsComponent))
        .get(TurnActionsComponent);
  }
  
  activeChip() {
    return this.manager.query()
        .filter(ChipComponent)
        .filter(ActiveComponent, component => component.active)
        .iterate(ActiveComponent);
  }
  
  recordAction(...params) {
    const turnActions = this.turnActionsComponent();
    if (isEmpty(this.activeChip()) ||
        !firstOf(this.activeChip()).get(ActiveComponent).active) {
      turnActions.globalActions.add(params);
    } else {
      const chipId = firstOf(this.activeChip()).id;
      if (!turnActions.chipActions.has(chipId)) {
        turnActions.chipActions.set(chipId, []);
      }
      turnActions.chipActions.get(chipId).push(params);
    }
  }
  
  input(id) {
    if (!this.terminalViewChildren().includes(id)) {
      return;
    }
    
    const textInput = this.textInput(id);
    const text = textInput.text.trim();
    this.events.emit(EventType.LOG, `>${text}`);
    
    if (text.length > 0) {
      const tokens = textInput.text.trim().split(/\s+/);
      const command = tokens.shift();
      const params = tokens;
      const cyclesComponent = this.cyclesComponent();
      
      if (this.actions.has(command)) {
        const action = this.actions.get(command);
        if (cyclesComponent.cycles >= action.cycles) {
          if (action.constraints(...params)) {
            cyclesComponent.cycles -= action.cycles;
            this.queuedActions.add(action);
            this.recordAction(command, ...params);
            
            action.start(...params);
            this.events.emit(EventType.ACTION_START);
          }
        } else {
          this.events.emit(
              EventType.LOG,
              'INSUFFICIENT CYCLES THIS TURN.');
        }
      } else {
        this.events.emit(EventType.LOG, `UNKNOWN ACTION '${command}'`);
      }
    }
    
    textInput.text = '';
    textInput.cursor = 0;
  }
  
  frame(delta) {
    if (isEmpty(this.queuedActions)) {
      return;
    }
    
    const action = firstOf(this.queuedActions);
    if (action.done()) {
      this.events.emit(EventType.ACTION_DONE);
      this.queuedActions.delete(action);
      
      const cyclesComponent = this.cyclesComponent();
      if (cyclesComponent.cycles == 0 && this.isPlayerTurn()) {
        this.events.emit(EventType.END_TURN, TurnEnum.PLAYER);
      }
    } else {
      action.frame(delta);
    }
  }
}

export {PlayerActionsSystem};