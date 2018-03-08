import {Canvas3D} from './canvas3d.js';
import {Module} from '../../injection/module.js';
import {Program} from './program.js';

class GraphicsModule extends Module {
  configure() {
    const canvas = Canvas3D.fromContainer();
    this.bindInstance(Canvas3D, canvas);
    this.bindInstance(WebGLRenderingContext, canvas.gl);
    this.bindClass(Program);
  }
}

export {GraphicsModule};