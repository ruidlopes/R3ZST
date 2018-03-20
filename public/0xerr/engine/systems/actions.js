import {Action} from '../action.js';
import {CompositeComponent} from '../components/composite.js';
import {CyclesComponent} from '../components/cycles.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {System} from '../system.js';
import {TextInputComponent} from '../components/textinput.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij, ijset} from '../../injection/api.js';

class ActionsSystem extends System {
  constructor(
      actions = ijset(Action),
      manager = ij(EntityManager),
      events = ij(EventManager)) {
    super();
    this.actions = actions;
    this.keyedActions = this.createKeyedActions();
        
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
  
  input(id) {
    if (!this.terminalViewChildren().includes(id)) {
      return;
    }
    
    const textInput = this.textInput(id);
    const text = textInput.text.trim();
    this.events.emit(EventType.LOG, `> ${text}`);
    
    if (text.length > 0) {
      const tokens = textInput.text.trim().split(/\s+/);
      const command = tokens.shift();
      const params = tokens;
      const cyclesComponent = this.cyclesComponent();
      
      if (this.keyedActions.has(command)) {
        const action = this.keyedActions.get(command);
        if (cyclesComponent.cycles >= action.cycles) {
          action.execute(...params);
          cyclesComponent.cycles--;
        } else {
          this.events.emit(
              EventType.LOG,
              'INSUFFICIENT CYCLES THIS TURN.');
        }
      } else {
        this.events.emit(EventType.LOG, 'UNKNOWN ACTION.');
      }
    }
    
    textInput.text = '';
    textInput.cursor = 0;
  }
  
  frame(delta) {}
}

export {ActionsSystem};