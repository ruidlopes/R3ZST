import {BLACK, BLUE_FADED2} from '../../common/palette.js';
import {Widget} from '../../../uitoolkit/widget.js';
import {Rect} from '../../../renderer/graphics/rect.js';
import {rect} from '../../../renderer/primitives/drawing.js';

class HardwareView extends Widget {
  constructor(scr) {
    super(scr, Rect.size(0, 0), BLUE_FADED2, BLACK);
  }
  
  render() {
    rect(this.screen, this.rect.x, this.rect.y, this.rect.width, this.rect.height,
        0xef, this.foregroundColor, this.backgroundColor);
  }
}

export {HardwareView};