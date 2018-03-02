import {Widget} from './widget.js';
import {sprint} from '../renderer/primitives/print.js';

class Label extends Widget {
  constructor(scr, rect, foregroundColor, backgroundColor, text) {
    super(scr, rect, foregroundColor, backgroundColor);
    this.text = text;
  }
  
  render() {
    sprint(this.text, this.screen,
        this.rect.x, this.rect.y,
        this.foregroundColor, this.backgroundColor);
  }
}

export {Label};