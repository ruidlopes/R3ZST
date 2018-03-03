import {CxelBuffer} from '../renderer/cxel/buffer.js';
import {Keyboard} from '../observers/keyboard.js';
import {MainScene} from './scenes/main.js';
import {Renderer} from '../renderer/renderer.js';
import {Viewport} from '../observers/viewport.js';

class Engine {
  constructor() {
    this.viewport = new Viewport();
    this.keyboard = new Keyboard();
    this.screen = new CxelBuffer();
    
    this.renderer = new Renderer();
    this.scene = new MainScene(this.screen, this.keyboard);
    
    this.running = false;
    
    this.width = undefined;
    this.height = undefined;
  }
  
  async start() {
    this.renderer.attach();
    await this.renderer.init();
    
    this.keyboard.observe();
    this.viewport.observe();
    this.resize();
    
    const timestamp = performance.now();
    this.scene.start(timestamp);
    this.running = true;
    this.loop(timestamp);
  }
  
  stop() {
    this.keyboard.stop();
    this.viewport.stop();
    this.running = false;
  }
  
  loop(timestamp) {
    if (!this.running) {
      return;
    }
    this.update(timestamp);
    this.render(timestamp);
    this.keyboard.reset();

    requestAnimationFrame(() => this.loop(performance.now()));
  }
  
  resize() {
    if (this.viewport.needsLayout(this)) {
      this.viewport.resizeClient(this);
      this.viewport.resizeRenderer(this.renderer);
      this.viewport.resizeScreen(this.screen);
      this.viewport.resizeScene(this.scene);
    }
  }
  
  update(timestamp) {
    this.resize();
    this.scene.tick(timestamp);
  }
  
  render(timestamp) {
    this.renderer.clear();
    this.renderer.renderScreen(this.screen);
  }
}

export {Engine};