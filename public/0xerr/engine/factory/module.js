import {Module} from '../../injection/module.js';
import {NodeFactory} from './node.js';

class FactoryModule extends Module {
  configure() {
    this.bindClass(NodeFactory);
  }
}

export {FactoryModule};