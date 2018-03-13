import {SCREEN} from '../qualifiers.js';
import {CxelBuffer} from '../../renderer/cxel/buffer.js';
import {box} from '../../renderer/primitives/boxes.js';
import {ij} from '../../injection/api.js';
import {rect, vline, hline, putCxel} from '../../renderer/primitives/drawing.js';
import {sprint} from '../../renderer/primitives/print.js';

class DrawingApi {
  constructor(screen, clipping) {
    this.screen = screen;
    this.clipping = clipping;
  }
  
  box(x, y, width, height, type, foregroundColor, backgroundColor) {
    box(this.screen,
        x, y, width, height, type,
        foregroundColor, backgroundColor, this.clipping);
    return this;
  }
  
  rect(x, y, width, height, charByte, foregroundColor, backgroundColor) {
    rect(this.screen,
        x, y, width, height, charByte,
        foregroundColor, backgroundColor, this.clipping);
    return this;
  }
  
  vline(x, y, height, charByte, foregroundColor, backgroundColor) {
    vline(this.screen,
        x, y, height, charByte,
        foregroundColor, backgroundColor, this.clipping);
    return this;
  }
  
  hline(x, y, width, charByte, foregroundColor, backgroundColor) {
    hline(this.screen,
        x, y, width, charByte,
        foregroundColor, backgroundColor, this.clipping);
    return this;
  }
  
  putCxel(x, y, charByte, foregroundColor, backgroundColor) {
    putCxel(this.screen,
        x, y, charByte,
        foregroundColor, backgroundColor, this.clipping);
    return this;
  }
  
  sprint(str, x, y, foregroundColor, backgroundColor) {
    sprint(str, this.screen, x, y, foregroundColor, backgroundColor);
    return this;
  }
}

class Drawing {
  constructor(screen = ij(CxelBuffer, SCREEN)) {
    this.screen = screen;
  }
  
  clipping(clipping) {
    return new DrawingApi(this.screen, clipping);
  }
  
  absolute() {
    return new DrawingApi(this.screen, {
      x: 0, y: 0, width: screen.width, height: screen.height
    });
  }
}

export {Drawing};