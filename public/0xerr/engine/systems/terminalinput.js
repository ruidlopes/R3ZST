import {ActionHistoryComponent} from '../components/actionhistory.js';
import {ActiveComponent} from '../components/active.js';
import {CompositeComponent} from '../components/composite.js';
import {EntityLib} from '../entity/lib.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {Keyboard} from '../../observers/keyboard.js';
import {KeyShortcut} from '../../observers/keyboard/shortcut.js';
import {System} from '../system.js';
import {TextInputComponent} from '../components/textinput.js';
import {TurnComponent, TurnEnum} from '../components/turn.js';
import {clamp} from '../../stdlib/math.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class TerminalInputSystem extends System {
  constructor(
      entities = ij(EntityManager),
      lib = ij(EntityLib),
      events = ij(EventManager),
      keyboard = ij(Keyboard)) {
    super();
    this.entities = entities;
    this.lib = lib;
    this.events = events;
    this.keyboard = keyboard;

    this.shortcutEscape = new KeyShortcut('ESCAPE');
    this.shortcutEnter = new KeyShortcut('ENTER');
    this.shortcutUp = new KeyShortcut('ARROWUP');
    this.shortcutDown = new KeyShortcut('ARROWDOWN');
    
    this.actionExecuting = false;
    this.events.subscribe(
        EventType.ACTION_START,
        () => {
          this.actionExecuting = true;
          this.updateTerminalTextInputFocus();
        });
    this.events.subscribe(
        EventType.ACTION_DONE,
        () => {
          this.actionExecuting = false;
          this.updateTerminalTextInputFocus();
        });
    
    this.playerTurn = false;
    this.events.subscribe(
        EventType.END_TURN,
        (turn) => {
          this.playerTurn = turn == TurnEnum.RETSAFE;
          this.updateTerminalTextInputFocus();
        });
    this.events.subscribe(
        EventType.CONNECTED,
        () => {
          this.playerTurn = true;
          this.updateTerminalTextInputFocus();
        });
        
    this.terminalViewActive = false;
    this.events.subscribe(
        EventType.VIEW_FOCUS,
        (view) => {
          this.terminalViewActive = view == ViewType.TERMINAL;
          this.updateTerminalTextInputFocus();
        });
    this.events.subscribe(
        EventType.CONNECTED,
        () => {
          this.terminalViewActive = true;
          this.updateTerminalTextInputFocus();
        });
    this.events.subscribe(
        EventType.DISCONNECTED,
        () => {
          this.terminalViewActive = false;
          this.updateTerminalTextInputFocus();
        });
    this.events.subscribe(
        EventType.VICTORY,
        () => {
          this.terminalViewActive = false;
          this.updateTerminalTextInputFocus();
        });
  }
  
  terminalViewChildren() {
    return firstOf(this.lib.terminalView().iterate(CompositeComponent))
        .get(CompositeComponent)
        .ids;
  }
  
  terminalTextInputEntity() {
    return firstOf(this.entities.query(this.terminalViewChildren())
        .filter(TextInputComponent)
        .iterate(TextInputComponent, ActiveComponent));
  }
  
  updateTerminalTextInputFocus() {
    const focused = this.playerTurn &&
        this.terminalViewActive &&
        !this.actionExecuting;
    this.terminalTextInputEntity().get(ActiveComponent).active = focused;
  }
  
  actionHistory() {
    return this.entities.query()
        .head(ActionHistoryComponent)
        .get(ActionHistoryComponent);
  }
  
  frame(delta) {
    const textInputEntity = this.terminalTextInputEntity();
    if (!textInputEntity || !textInputEntity.get(ActiveComponent).active) {
      return;
    }
    const textInput = textInputEntity.get(TextInputComponent);
    if (this.keyboard.releasedAny(this.shortcutEscape)) {
      this.escapeHistory();
    } else if (this.keyboard.releasedAny(this.shortcutEnter)) {
      this.enterHistory(textInput);
    } else if (this.keyboard.releasedAny(this.shortcutUp)) {
      this.history(textInput, -1);
    } else if (this.keyboard.releasedAny(this.shortcutDown)) {
      this.history(textInput, 1);
    }
  }
  
  enterHistory(textInput) {
    const actionHistory = this.actionHistory();
    actionHistory.history.push(textInput.text);
    actionHistory.cursor = actionHistory.history.length;
  }
  
  escapeHistory() {
    const actionHistory = this.actionHistory();
    actionHistory.cursor = actionHistory.history.length;
  }
  
  history(textInput, delta) {
    const actionHistory = this.actionHistory();
    actionHistory.cursor += delta;
    actionHistory.cursor = clamp(actionHistory.cursor, 0, actionHistory.history.length);
    
    if (actionHistory.cursor == actionHistory.history.length) {
      textInput.text = '';
      textInput.cursor = 0;
    } else {
      textInput.text = actionHistory.history[actionHistory.cursor];
      textInput.cursor = textInput.text.length;
    }
  }
}

export {TerminalInputSystem};