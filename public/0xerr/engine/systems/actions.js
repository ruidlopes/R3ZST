import {Action} from '../action.js';
import {CompositeComponent} from '../components/composite.js';
import {CyclesComponent} from '../components/cycles.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {System} from '../system.js';
import {TextInputComponent} from '../components/textinput.js';
import {TurnComponent, TurnEnum} from '../components/turn.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {firstOf, isEmpty} from '../../stdlib/collections.js';
import {ij, ijset} from '../../injection/api.js';

class ActionsSystem extends System {
  constructor(
      actions = ijset(Action),
      manager = ij(EntityManager),
      events = ij(EventManager)) {
    super();
    this.actions = actions;
    this.keyedActions = this.createKeyedActions();
    
    this.queuedActions = new Set();
        
    this.manager = manager;
    this.events = events;
    this.events.subscribe(
        EventType.TEXT_INPUT,
        (id) => this.input(id));
  }
  
  createKeyedActions() {
    const keyed = new Map();
    for (const action of this.actions) {
      keyed.set(action.command, action);
    }
    return keyed;
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
      
      if (this.keyedActions.has(command)) {
        const action = this.keyedActions.get(command);
        if (cyclesComponent.cycles >= action.cycles) {
          cyclesComponent.cycles -= action.cycles;
          this.queuedActions.add(action);
          action.start(...params);
          this.events.emit(EventType.ACTION_START);
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
        this.events.emit(EventType.END_TURN);
      }
    } else {
      action.frame(delta);
    }
  }
}

export {ActionsSystem};