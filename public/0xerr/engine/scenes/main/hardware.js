import {BLACK, BLUE_BRIGHT, BLUE_FADED2} from '../../common/palette.js';
import {NodeRendererSystem} from '../../systems/noderenderer.js';
import {Rect} from '../../../renderer/graphics/rect.js';
import {Widget} from '../../../uitoolkit/widget.js';
import {rect} from '../../../renderer/primitives/drawing.js';

class HardwareView extends Widget {
  constructor(scr, manager) {
    super(scr, Rect.size(0, 0), BLUE_FADED2, BLACK);
    this.nodeRenderer = new NodeRendererSystem(manager, this.screen);
  }
  
  render() {
    rect(this.screen, this.rect.x, this.rect.y, this.rect.width, this.rect.height,
        0xef, this.foregroundColor, this.backgroundColor);
    this.nodeRenderer.frame();
  }
  
  focus() {
    super.focus();
    this.foregroundColor = BLUE_BRIGHT;
  }
  
  blur() {
    super.blur();
    this.foregroundColor = BLUE_FADED2;
  }
}

export {HardwareView};