import {ActionHistoryComponent} from '../components/actionhistory.js';
import {ActiveComponent} from '../components/active.js';
import {CompositeComponent} from '../components/composite.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {Keyboard} from '../../observers/keyboard.js';
import {KeyModifiers} from '../../observers/keyboard/modifiers.js';
import {KeyShortcut, KeyShortcutRE} from '../../observers/keyboard/shortcut.js';
import {System} from '../system.js';
import {TextInputComponent} from '../components/textinput.js';
import {TurnComponent, TurnEnum} from '../components/turn.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {clamp} from '../../stdlib/math.js';
import {firstOf, isEmpty} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class TerminalInputSystem extends System {
  constructor(
      manager = ij(EntityManager),
      events = ij(EventManager),
      keyboard = ij(Keyboard)) {
    super();
    this.manager = manager;
    this.events = events;
    this.keyboard = keyboard;

    this.shortcutChars = new KeyShortcutRE(/^.$/);
    this.shortcutCharsShift = new KeyShortcutRE(/^.$/, KeyModifiers.SHIFT);
    this.shortcutBackspace = new KeyShortcut('BACKSPACE');
    this.shortcutEscape = new KeyShortcut('ESCAPE');
    this.shortcutEnter = new KeyShortcut('ENTER');
    this.shortcutLeft = new KeyShortcut('ARROWLEFT');
    this.shortcutRight = new KeyShortcut('ARROWRIGHT');
    this.shortcutUp = new KeyShortcut('ARROWUP');
    this.shortcutDown = new KeyShortcut('ARROWDOWN');
    
    this.actionExecuting = false;
    this.events.subscribe(
        EventType.ACTION_START,
        () => this.actionExecuting = true);
    this.events.subscribe(
        EventType.ACTION_DONE,
        () => this.actionExecuting = false);
  }
  
  isTerminalViewActive() {
    return !isEmpty(this.manager.query()
        .filter(ViewComponent, view => view.type == ViewType.TERMINAL)
        .filter(ActiveComponent, component => component.active)
        .collect());
  }
  
  isPlayerTurn() {
    return !isEmpty(this.manager.query()
        .filter(TurnComponent, component => component.turn == TurnEnum.PLAYER)
        .collect());
  }
  
  terminalViewChildren() {
    return firstOf(this.manager.query()
        .filter(ViewComponent, view => view.type == ViewType.TERMINAL)
        .first()
        .iterate(CompositeComponent))
        .get(CompositeComponent)
        .ids;
  }
  
  textInputEntity() {
    return firstOf(this.manager.query(this.terminalViewChildren())
        .filter(TextInputComponent)
        .first()
        .iterate(TextInputComponent));
  }
  
  actionHistory() {
    return firstOf(this.manager.query()
        .filter(ActionHistoryComponent)
        .first()
        .iterate(ActionHistoryComponent))
        .get(ActionHistoryComponent);
  }
  
  frame(delta) {
    if (!this.isTerminalViewActive() ||
        !this.isPlayerTurn() ||
        this.actionExecuting) {
      return;
    }
    
    const textInputEntity = this.textInputEntity();
    const textInput = textInputEntity.get(TextInputComponent);
    
    this.updateChars(textInput, this.keyboard.released(this.shortcutChars));
    this.updateChars(textInput, this.keyboard.released(this.shortcutCharsShift));
    
    if (this.keyboard.releasedAny(this.shortcutBackspace)) {
      this.backspace(textInput);
    } else if (this.keyboard.releasedAny(this.shortcutEscape)) {
      this.escape(textInput);
    } else if (this.keyboard.releasedAny(this.shortcutEnter)) {
      this.enter(textInputEntity);
    } else if (this.keyboard.releasedAny(this.shortcutLeft)) {
      this.cursor(textInput, -1);
    } else if (this.keyboard.releasedAny(this.shortcutRight)) {
      this.cursor(textInput, 1);
    } else if (this.keyboard.releasedAny(this.shortcutUp)) {
      this.history(textInput, -1);
    } else if (this.keyboard.releasedAny(this.shortcutDown)) {
      this.history(textInput, 1);
    }
  }
  
  updateChars(textInput, chars) {
    for (const char of chars) {
      const pre = textInput.text.substr(0, textInput.cursor);
      const post = textInput.text.substr(textInput.cursor);
      textInput.text = pre + char + post;
      textInput.cursor++;
    }
  }
  
  enter(textInputEntity) {
    const textInput = textInputEntity.get(TextInputComponent);
    const actionHistory = this.actionHistory();
    actionHistory.history.push(textInput.text);
    actionHistory.cursor = actionHistory.history.length;
    
    this.events.emit(EventType.TEXT_INPUT, textInputEntity.id);
  }
  
  backspace(textInput) {
    if (textInput.cursor == 0) {
      return;
    }
    
    const pre = textInput.text.substr(0, textInput.cursor - 1);
    const post = textInput.text.substr(textInput.cursor);
    textInput.text = pre + post;
    textInput.cursor--;
  }
  
  escape(textInput) {
    textInput.text = '';
    textInput.cursor = 0;
    
    const actionHistory = this.actionHistory();
    actionHistory.cursor = actionHistory.history.length;
  }
  
  cursor(textInput, delta) {
    textInput.cursor += delta;
    textInput.cursor = clamp(textInput.cursor, 0, textInput.text.length);
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