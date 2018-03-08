import {Module} from '../../injection/module.js';
import {NodeRendererSystem} from './noderenderer.js';
import {ViewFocusSystem} from './viewfocus.js';

class SystemsModule extends Module {
  configure() {
    this.bindClass(NodeRendererSystem);
    this.bindClass(ViewFocusSystem);
  }
}

export {SystemsModule};