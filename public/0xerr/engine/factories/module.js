import {Module} from '../../injection/module.js';
import {GameFactory} from './game.js';
import {NodeFactory} from './node.js';
import {PlayerFactory} from './player.js';
import {ViewFactory} from './view.js';

class FactoryModule extends Module {
  configure() {
    this.bindClass(GameFactory);
    this.bindClass(NodeFactory);
    this.bindClass(PlayerFactory);
    this.bindClass(ViewFactory);
  }
}

export {FactoryModule};