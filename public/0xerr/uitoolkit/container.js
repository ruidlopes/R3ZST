import {Widget} from './widget.js';

class Container extends Widget {
  constructor(scr, rect, foregroundColor, backgroundColor) {
    super(scr, rect, foregroundColor, backgroundColor);
    this.children = [];
  }
  
  measure() {
    this.children.forEach(child => child.measure());
  }
  
  render() {
    this.children.forEach(child => child.render());
  }
}

export {Container};