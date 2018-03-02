import {nextPow2} from '../../stdlib/math.js';

class Buffer {
  constructor(width, height, wordSize = 1) {
    this.width = width;
    this.height = height;
    this.wordSize = wordSize;
    this.data = new Uint8Array(this.length());
  }
  
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Uint8Array(this.length());
  }
  
  length() {
    return this.width * this.height * this.wordSize;
  }
  
  computedWidth() {
    return this.width;
  }
  
  computedHeight() {
    return this.height;
  }
  
  offset(x, y) {
    return this.sizeof(y * this.computedWidth() + x);
  }
  
  xFromOffset(offset) {
    return Math.floor(offset / this.wordSize) % this.computedWidth();
  }
  
  yFromOffset(offset) {
    return Math.floor(Math.floor(offset / this.wordSize) / this.computedWidth());
  }
  
  sizeof(wordCount) {
    return wordCount * this.wordSize;
  }
  
  sizeofWidth() {
    return this.sizeof(this.computedWidth());
  }
}

class TextureBuffer extends Buffer {
  constructor(width, height) {
    super(width, height, 4);
    this.textureWidth = nextPow2(width);
    this.textureHeight = nextPow2(height);
  }
  
  resize(width, height) {
    super.resize(width, height);
    this.textureWidth = nextPow2(width);
    this.textureHeight = nextPow2(height);
  }
  
  length() {
    return nextPow2(this.width) * nextPow2(this.height) * this.wordSize;
  }
  
  computedWidth() {
    return this.textureWidth;
  }
  
  computedHeight() {
    return this.textureHeight;
  }
}

export {
  Buffer,
  TextureBuffer,
};