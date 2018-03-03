import {mapOf} from '../stdlib/collections.js';

class Widget {
  constructor(scr, rect, foregroundColor, backgroundColor) {
    this.screen = scr;
    this.rect = rect;
    this.foregroundColor = foregroundColor;
    this.backgroundColor = backgroundColor;
    this.focused = false;
    this.shortcuts = mapOf();
  }
  
  measure() {}
  
  layout(rect) {
    this.rect = rect;
  }
  
  render() {}
  
  focus() {
    this.focused = true;
  }
  
  blur() {
    this.focused = false;
  }
}

export {Widget};