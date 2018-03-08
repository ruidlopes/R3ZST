import {GraphicsModule} from './graphics/module.js';
import {Module} from '../injection/module.js';
import {Renderer} from './renderer.js';

class RendererModule extends Module {
  configure() {
    this.install(new GraphicsModule());
    this.bindClass(Renderer);
  }
}

export {RendererModule};