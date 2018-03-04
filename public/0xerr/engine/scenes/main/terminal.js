import {BLACK, BLUE_BRIGHT, BLUE_FADED} from '../../common/palette.js';
import {KeyShortcutRE} from '../../../observers/keyboard/shortcut.js';
import {KeyModifiers} from '../../../observers/keyboard/modifiers.js';
import {Label} from '../../../uitoolkit/label.js';
import {Panel} from '../../../uitoolkit/panel.js';
import {Rect} from '../../../renderer/graphics/rect.js';
import {mapOf} from '../../../stdlib/collections.js';

class TerminalView extends Panel {
  constructor(scr) {
    super(scr, Rect.size(0, 0), BLUE_FADED, BLACK,
        new Label(scr, Rect.size(0, 0), BLUE_FADED, BLACK, 'TERMINAL'));
    this.shortcuts = mapOf(
      new KeyShortcutRE(/^.$/), (code) => this.char(code),
      new KeyShortcutRE(/^.$/, KeyModifiers.SHIFT), (code) => this.char(code),
    );
  }
  
  focus() {
    super.focus();
    this.foregroundColor = BLUE_BRIGHT;
    this.label.foregroundColor = BLUE_BRIGHT;
  }
  
  blur() {
    super.blur();
    this.foregroundColor = BLUE_FADED;
    this.label.foregroundColor = BLUE_FADED;
  }
  
  char(code) {}
}

export {TerminalView};