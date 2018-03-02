import {CHAR_SIZE} from '../../../renderer/font/constants.js';
import {Color} from '../../../renderer/graphics/color.js';
import {CxelBuffer} from '../../../renderer/cxel/buffer.js';
import {Scene} from '../../scene.js';
import {lerp} from '../../../stdlib/math.js';
import {memblt} from '../../../renderer/cxel/mem.js';
import {randomInt, randomRangeDouble} from '../../../stdlib/random.js';
import {unpackChar} from '../../../renderer/font/packing.js';

const WIDTH = 40;

const TITLE_CHARS_BITMAP = [
  [0, 1016, 776, 776,  880, 776, 776, 776, 776,  776, 0, 0],
  [0, 1016,  24,  24,  504,  24,  24,  24,  24, 1016, 0, 0],
  [0, 1016, 776,  16,   96, 128, 768, 768, 768, 1016, 0, 0],
  [0, 1016, 768, 768, 1016,   8,   8,   8, 776, 1016, 0, 0],
  [0, 1016, 192, 192,  192, 192, 192, 192, 192,  192, 0, 0],
].map(unpackChar);

const States = {
  START: Symbol(),
  FADE_IN: Symbol(),
  LOOP: Symbol(),
};

class ScrollerScene extends Scene {
  constructor(scr) {
    super(scr);
    
    this.colorMixer = new Color();
    this.titleBuffer = new CxelBuffer(CHAR_SIZE, CHAR_SIZE);
    
    this.screenPtr = this.screen.ptr(this.titleX(), this.titleY());
    this.titlePtr = this.titleBuffer.ptr(0, 0);
    
    this.sm.add(States.START, () => this.renderStart());
    this.sm.add(States.FADE_IN, () => this.renderFadeIn());
    this.sm.add(States.LOOP, () => this.renderLoop());
    
    this.sm.cond(() => this.delta == 0, States.START);
    this.sm.cond(() => this.delta > 0 && this.delta <= 1000, States.FADE_IN);
    this.sm.cond(() => this.delta > 1000, States.LOOP);
    
    this.sm.onStateStart(States.FADE_IN, () => this.preparePtrs());
  }
  
  resize(width, height) {
    super.resize(width, height);
    this.screenPtr = this.screen.ptr(this.titleX(), this.titleY());
    this.titlePtr = this.titleBuffer.ptr(0, 0);
  }

  preparePtrs() {
    memblt(this.titlePtr, this.screenPtr, CHAR_SIZE, CHAR_SIZE);
  }
  
  renderStart() {
    for (let y = 0; y < this.height; ++y) {
      this.createLine(y);
      this.alphaLine(y, 0);
    }
  }
  
  renderFadeIn() {
    this.renderLoop();
    const alpha = Math.round(lerp(this.delta / 1000, 0, 255));
    for (let y = 0; y < this.height; ++y) {
      this.alphaLine(y, alpha);
    }
  }
  
  renderLoop() {
    // restore saved area.
    memblt(this.screenPtr, this.titlePtr, CHAR_SIZE, CHAR_SIZE);
    
    this.scrollDown();
    this.createLine(0);
    this.alphaLine(0, 255);
    
    // save area we're about to paint over.
    memblt(this.titlePtr, this.screenPtr, CHAR_SIZE, CHAR_SIZE);
    
    const charDelta = Math.floor(this.delta / 200);
    const charIndex = charDelta % (TITLE_CHARS_BITMAP.length + 3);
    if (charIndex < TITLE_CHARS_BITMAP.length) {
      this.paintChar(TITLE_CHARS_BITMAP[charIndex]);
    }
  }
  
  scrollDown() {
    const offsetX = (this.width - WIDTH) >> 1;
    for (let y = this.height - 2; y >= 0; --y) {
      this.screen.chars.data.copyWithin(
          this.screen.chars.offset(offsetX, y + 1),
          this.screen.chars.offset(offsetX, y),
          this.screen.chars.offset(offsetX + WIDTH, y));
      
      this.screen.foreground.data.copyWithin(
          this.screen.foreground.offset(offsetX, y + 1),
          this.screen.foreground.offset(offsetX, y),
          this.screen.foreground.offset(offsetX + WIDTH, y));
    }
  }
  
  createLine(y) {
    const offsetX = (this.width - WIDTH) >> 1;
    for (let x = offsetX; x < offsetX + WIDTH; ++x) {
      this.screen.chars.data[this.screen.chars.offset(x, y)] = randomInt(256);
      
      this.colorMixer.setHSL(195, 1, randomRangeDouble(1/4, 3/4));
      this.screen.foreground.data.set(
          this.colorMixer.data,
          this.screen.foreground.offset(x, y));
    }
  }
  
  alphaLine(y, alpha) {
    const offsetX = (this.width - WIDTH) >> 1;
    for (let x = offsetX; x < offsetX + WIDTH; ++x) {
      const offset = this.screen.foreground.offset(x, y);
      this.screen.foreground.data[offset + 3] = alpha;
    }
  }

  titleX() {
    return (this.width - CHAR_SIZE) >> 1;
  }
  
  titleY() {
    return (this.height - CHAR_SIZE) >> 1;
  }
  
  paintChar(char) {
    this.colorMixer.setHSL(55, 1, this.colorMixer.hsl.l);
    for (let y = 0; y < CHAR_SIZE; ++y) {
      for (let x = 0; x < CHAR_SIZE; ++x) {
        const bit = char[y][x];
        if (bit) {
          this.screen.foreground.data.set(
              this.colorMixer.data,
              this.screen.foreground.offset(this.titleX() + x, this.titleY() + y));
        }
      }
    }
  }
}

export {ScrollerScene};