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
import {ViewComponent, ViewType} from '../components/view.js';
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
    this.shortcutEnter = new KeyShortcut('ENTER');
    this.shortcutLeft = new KeyShortcut('ARROWLEFT');
    this.shortcutRight = new KeyShortcut('ARROWRIGHT');
  }
  
  isTerminalViewActive() {
    return !isEmpty(this.manager.query()
        .filter(ViewComponent, view => view.type == ViewType.TERMINAL)
        .filter(ActiveComponent, component => component.active)
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
  
  frame(delta) {
    if (!this.isTerminalViewActive()) {
      return;
    }
    
    const textInputEntity = this.textInputEntity();
    const textInput = textInputEntity.get(TextInputComponent);
    this.updateChars(textInput, this.keyboard.released(this.shortcutChars));
    this.updateChars(textInput, this.keyboard.released(this.shortcutCharsShift));
    if (this.keyboard.releasedAny(this.shortcutBackspace)) {
      this.backspace(textInput);
    } else if (this.keyboard.releasedAny(this.shortcutEnter)) {
      this.events.emit(EventType.TEXT_INPUT, textInputEntity.id);
    } else if (this.keyboard.releasedAny(this.shortcutLeft)) {
      this.cursor(textInput, -1);
    } else if (this.keyboard.releasedAny(this.shortcutRight)) {
      this.cursor(textInput, 1);
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
  
  backspace(textInput) {
    if (textInput.cursor == 0) {
      return;
    }
    
    const pre = textInput.text.substr(0, textInput.cursor - 1);
    const post = textInput.text.substr(textInput.cursor);
    textInput.text = pre + post;
    textInput.cursor--;
  }
  
  cursor(textInput, delta) {
    textInput.cursor += delta;
    textInput.cursor = Math.max(Math.min(textInput.cursor, textInput.text.length), 0);
  }
}

export {TerminalInputSystem};