import {BLACK, BLUE_BRIGHT, BLUE_FADED} from '../../common/palette.js';
import {Label} from '../../../uitoolkit/label.js';
import {Panel} from '../../../uitoolkit/panel.js';
import {Rect} from '../../../renderer/graphics/rect.js';

class TerminalView extends Panel {
  constructor(scr) {
    super(scr, Rect.size(0, 0), BLUE_FADED, BLACK,
        new Label(scr, Rect.size(0, 0), BLUE_FADED, BLACK, 'TERMINAL'));
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
}

export {TerminalView};