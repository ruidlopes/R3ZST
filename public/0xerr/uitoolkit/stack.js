import {Container} from './container.js';

const StackOrientation = {
  HORIZONTAL: Symbol(),
  VERTICAL: Symbol(),
};

class Stack extends Container {
  constructor(scr, rect, foregroundColor, backgroundColor, orientation) {
    super(scr, rect, foregroundColor, backgroundColor);
    this.orientation = orientation;
  }
}

export {
  Stack,
  StackOrientation,
};