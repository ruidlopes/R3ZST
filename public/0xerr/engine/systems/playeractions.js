import {HIGHLIGHT_FADED} from '../common/palette.js';
import {PLAYER} from '../actions/qualifiers.js';
import {Action, ActionRefreshEnum} from '../action.js';
import {ActiveComponent} from '../components/active.js';
import {ChipComponent} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {CyclesComponent} from '../components/cycles.js';
import {DeckComponent} from '../components/deck.js';
import {EntityLib} from '../entity/lib.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {System} from '../system.js';
import {TextInputComponent} from '../components/textinput.js';
import {TurnActionsComponent} from '../components/turnactions.js';
import {TurnComponent, TurnEnum} from '../components/turn.js';
import {firstOf, isEmpty, mapOf} from '../../stdlib/collections.js';
import {ij, ijmap} from '../../injection/api.js';

class PlayerActionsSystem extends System {
  constructor(
      actions = ijmap(Action, PLAYER),
      manager = ij(EntityManager),
      lib = ij(EntityLib),
      events = ij(EventManager)) {
    super();
    this.actions = actions;
    this.queuedActions = new Set();
        
    this.manager = manager;
    this.lib = lib;
    
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
    return firstOf(this.lib.terminalView().iterate(CompositeComponent));
  }
  
  textInput(id) {
    return firstOf(this.manager.query([id])
        .iterate(TextInputComponent))
        .get(TextInputComponent);
  }
  
  cyclesComponent() {
    return this.manager.query()
        .head(CyclesComponent)
        .get(CyclesComponent);
  }
  
  isPlayerTurn() {
    return this.manager.query()
        .filter(TurnComponent, component => component.turn == TurnEnum.PLAYER)
        .count() == 1;
  }
  
  turnActionsComponent() {
    return this.manager.query()
        .head(TurnActionsComponent)
        .get(TurnActionsComponent);
  }
  
  activeChip() {
    return firstOf(this.manager.query()
        .filter(ActiveComponent, component => component.active)
        .filter(ChipComponent)
        .iterate(ActiveComponent));
  }
  
  deck() {
    return this.manager.query()
        .head(DeckComponent)
        .get(DeckComponent);
  }
  
  recordAction(...params) {
    const turnActions = this.turnActionsComponent();
    const activeChip = this.activeChip();
    
    if (activeChip && activeChip.get(ActiveComponent).active) {
      const chipId = activeChip.id;
      if (!turnActions.chipActions.has(chipId)) {
        turnActions.chipActions.set(chipId, []);
      }
      turnActions.chipActions.get(chipId).push(params);
    } else {
      turnActions.globalActions.add(params);
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
    textInput.text = '';
    textInput.cursor = 0;
    
    this.events.emit(EventType.LOG, `>${text}`, mapOf('foregroundColor', HIGHLIGHT_FADED));
    
    if (text.length == 0) {
      return;
    }
    
    const tokens = text.split(/\s+/);
    const command = tokens.shift();
    const params = tokens;
    const cyclesComponent = this.cyclesComponent();

    if (!this.actions.has(command)) {
      this.events.emit(EventType.LOG, `UNKNOWN SCRIPT: '${command}'.`);
      return;
    }
      
    const action = this.actions.get(command);
    const deck = this.deck().items;
    const count = deck.get(command);

    if (count == 0) {
      this.events.emit(EventType.LOG, 'SCRIPT IS EXHAUSTED.');
      return;
    }
    
    const mutators = this.events.emitAndEval(EventType.CYCLES, action);
    let cycles = action.cycles;
    for (const mutator of mutators) {
      const value = mutator(cycles);
      if (value !== undefined) {
        cycles = value;
      }
    }
    cycles = Math.max(0, cycles);

    if (cyclesComponent.cycles < cycles) {
      this.events.emit(EventType.LOG, 'INSUFFICIENT CYCLES THIS TURN.');
      return;
    }
    
    if (action.constraints(...params)) {
      cyclesComponent.cycles -= cycles;
      this.queuedActions.add(action);
      this.recordAction(command, ...params);
      if (count != Infinity) {
        deck.set(command, count - 1);
      }

      action.start(...params);
      this.events.emit(EventType.ACTION_START);
    }
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