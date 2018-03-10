import {Module} from '../../injection/module.js';
import {NodeFactory} from './node.js';
import {ViewFactory} from './view.js';

class FactoryModule extends Module {
  configure() {
    this.bindClass(NodeFactory);
    this.bindClass(ViewFactory);
  }
}

export {FactoryModule};