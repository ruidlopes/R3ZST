import {BLACK, BLUE_FADED} from '../../common/palette.js';
import {Label} from '../../../uitoolkit/label.js';
import {Panel} from '../../../uitoolkit/panel.js';
import {Rect} from '../../../renderer/graphics/rect.js';

class StatusView extends Panel {
  constructor(scr) {
    super(scr, Rect.size(0, 0), BLUE_FADED, BLACK,
        new Label(scr, Rect.size(0, 0), BLUE_FADED, BLACK, 'STATUS'));
  }
}

export {StatusView};