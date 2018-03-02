import {box, boxPtr, BoxType} from '../renderer/primitives/boxes.js';
import {rect, rectPtr, putCxelPtr} from '../renderer/primitives/drawing.js';
import {sprint} from '../renderer/primitives/print.js';
import {Container} from './container.js';

class Panel extends Container {
  constructor(scr, rect, foregroundColor, backgroundColor, label) {
    super(scr, rect, foregroundColor, backgroundColor);
    this.label = label;
  }
  
  layout(rect) {
    super.layout(rect);
    this.label.layout(rect.clone().moveTo(rect.x + 2, rect.y));
  }
  
  render() {
    box(this.screen,
        this.rect.x, this.rect.y, this.rect.width, this.rect.height,
        BoxType.SINGLE, this.foregroundColor, this.backgroundColor);
    rect(this.screen,
        this.rect.x + 1, this.rect.y + 1, this.rect.width - 2, this.rect.height - 2,
        0x00, this.foregroundColor, this.backgroundColor);
    
    this.label.render();
  }
}

export {Panel};