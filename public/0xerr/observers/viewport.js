import {CHAR_SIZE} from '../renderer/font/constants.js';
import {Observer} from './observer.js';

class Viewport extends Observer {
  constructor() {
    super();
    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight;
    
    this.handler = () => this.resize();
  }
  
  observe() {
    window.addEventListener('resize', this.handler);
  }
  
  stop() {
    window.removeEventListener('resize', this.handler);
  }
  
  resize() {
    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight;
  }
  
  screenWidth() {
    return Math.floor(this.width / CHAR_SIZE);
  }
  
  screenHeight() {
    return Math.floor(this.height / CHAR_SIZE);
  }
  
  needsLayout(client) {
    return this.width != client.width || this.height != client.height;
  }
  
  resizeClient(client) {
    if (this.needsLayout(client)) {
      client.width = this.width;
      client.height = this.height;
    }
  }
  
  resizeScreen(screen) {
    const sw = this.screenWidth();
    const sh = this.screenHeight();
    
    if (screen.width != sw || screen.height != sh) {
      screen.resize(sw, sh);
    }
  }
  
  resizeBuffer(buffer) {
    const width = this.width;
    const height = this.height;
    
    if (buffer.width != width || buffer.height != height) {
      buffer.resize(width, height);
    }
  }
  
  resizeRenderer(renderer) {
    renderer.resize(this.width, this.height);
  }
}

export {Viewport};