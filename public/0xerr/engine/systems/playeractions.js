import {ORANGE_FADED} from '../common/palette.js';
import {PLAYER} from '../actions/qualifiers.js';
import {Action, ActionRefreshEnum} from '../action.js';
import {ActiveComponent} from '../components/active.js';
import {ChipComponent} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {CyclesComponent} from '../components/cycles.js';
import {DeckComponent} from '../components/deck.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {System} from '../system.js';
import {TextInputComponent} from '../components/textinput.js';
import {TurnActionsComponent} from '../components/turnactions.js';
import {TurnComponent, TurnEnum} from '../components/turn.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {firstOf, isEmpty, mapOf} from '../../stdlib/collections.js';
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
    this.events.subscribe(
        EventType.NODE,
        () => this.refreshDeckNode());
    this.events.subscribe(
        EventType.END_TURN,
        (turn) => turn == TurnEnum.PLAYER && this.refreshDeckTurn());
  }
  
  terminalViewComposite() {
    return firstOf(this.manager.query()
        .filter(ViewComponent, view => view.type == ViewType.TERMINAL)
        .iterate(CompositeComponent));
  }
  
  textInput(id) {
    return firstOf(this.manager.query([id])
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
        .iterate(TurnActionsComponent))
        .get(TurnActionsComponent);
  }
  
  activeChip() {
    return this.manager.query()
        .filter(ChipComponent)
        .filter(ActiveComponent, component => component.active)
        .iterate(ActiveComponent);
  }
  
  deck() {
    return firstOf(this.manager.query()
        .filter(DeckComponent)
        .iterate(DeckComponent))
        .get(DeckComponent);
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
    const terminalViewComposite = this.terminalViewComposite();
    if (!terminalViewComposite ||
        !terminalViewComposite.get(CompositeComponent).ids.includes(id)) {
      return;
    }
    
    const textInput = this.textInput(id);
    const text = textInput.text.trim();
    this.events.emit(EventType.LOG, `>${text}`, mapOf('foregroundColor', ORANGE_FADED));
    
    if (text.length > 0) {
      const tokens = textInput.text.trim().split(/\s+/);
      const command = tokens.shift();
      const params = tokens;
      const cyclesComponent = this.cyclesComponent();
      
      if (this.actions.has(command)) {
        const action = this.actions.get(command);
        const deck = this.deck().items;
        const count = deck.get(command);
        
        if (count == Infinity || count > 0) {
          if (cyclesComponent.cycles >= action.cycles) {
            if (action.constraints(...params)) {
              cyclesComponent.cycles -= action.cycles;
              this.queuedActions.add(action);
              this.recordAction(command, ...params);
              if (count != Infinity) {
                deck.set(command, count - 1);
              }
              
              action.start(...params);
              this.events.emit(EventType.ACTION_START);
            }
          } else {
            this.events.emit(
                EventType.LOG,
                'INSUFFICIENT CYCLES THIS TURN.');
          }
        } else if (count == 0) {
          this.events.emit(
              EventType.LOG,
              'SCRIPT IS EXHAUSTED.');
        }
      } else {
        this.events.emit(EventType.LOG, `UNKNOWN SCRIPT: '${command}'.`);
      }
    }
    
    textInput.text = '';
    textInput.cursor = 0;
  }
  
  refreshDeckNode() {
    this.refreshDeck(ActionRefreshEnum.NODE);
  }
  
  refreshDeckTurn() {
    this.refreshDeck(ActionRefreshEnum.TURN);
  }
  
  refreshDeck(type) {
    const deck = this.deck().items;
    for (const key of deck.keys()) {
      const action = this.actions.get(key);
      if (action.refresh == type) {
        deck.set(key, action.limit);
      }
    }
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