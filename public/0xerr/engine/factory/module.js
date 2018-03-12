import {Module} from '../../injection/module.js';
import {NodeFactory} from './node.js';
import {PlayerFactory} from './player.js';
import {ViewFactory} from './view.js';

class FactoryModule extends Module {
  configure() {
    this.bindClass(NodeFactory);
    this.bindClass(PlayerFactory);
    this.bindClass(ViewFactory);
  }
}

export {FactoryModule};