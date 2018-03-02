import {Buffer, TextureBuffer} from '../graphics/buffer.js';
import {CxelPtr} from './ptr.js';

class CxelBuffer {  
  constructor(width = 0, height = 0) {
    this.width = width;
    this.height = height;
    
    this.chars = new Buffer(width, height);
    this.background = new TextureBuffer(width, height);
    this.foreground = new TextureBuffer(width, height);
  }
  
  charByOffset(offset) {
    return this.chars.data[offset];
  }
  
  resize(width, height) {
    if (this.width != width || this.height != height) {
      this.chars.resize(width, height);
      this.background.resize(width, height);
      this.foreground.resize(width, height);
      this.width = width;
      this.height = height;
    }
  }
  
  ptr(x, y) {
    return new CxelPtr(this, x, y);
  }
}

export {CxelBuffer};