import {ActiveComponent} from '../components/active.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {Keyboard} from '../../observers/keyboard.js';
import {KeyModifiers} from '../../observers/keyboard/modifiers.js';
import {KeyShortcut, KeyShortcutRE} from '../../observers/keyboard/shortcut.js';
import {System} from '../system.js';
import {TextInputComponent} from '../components/textinput.js';
import {clamp} from '../../stdlib/math.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class TextInputSystem extends System {
  constructor(
      entities = ij(EntityManager),
      events = ij(EventManager),
      keyboard = ij(Keyboard)) {
    super();
    this.entities = entities;
    this.events = events;
    this.keyboard = keyboard;

    this.shortcutChars = new KeyShortcutRE(/^.$/);
    this.shortcutCharsShift = new KeyShortcutRE(/^.$/, KeyModifiers.SHIFT);
    this.shortcutBackspace = new KeyShortcut('BACKSPACE');
    this.shortcutEscape = new KeyShortcut('ESCAPE');
    this.shortcutEnter = new KeyShortcut('ENTER');
    this.shortcutLeft = new KeyShortcut('ARROWLEFT');
    this.shortcutRight = new KeyShortcut('ARROWRIGHT');
  }
  
  activeTextInputEntity() {
    return firstOf(this.entities.query()
        .filter(ActiveComponent, component => component.active)
        .filter(TextInputComponent)
        .iterate(TextInputComponent));
  }
  
  frame(delta) {
    const textInputEntity = this.activeTextInputEntity();
    if (!textInputEntity) {
      return;
    }
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
  }
  
  cursor(textInput, delta) {
    textInput.cursor += delta;
    textInput.cursor = clamp(textInput.cursor, 0, textInput.text.length);
  }
}

export {TextInputSystem};