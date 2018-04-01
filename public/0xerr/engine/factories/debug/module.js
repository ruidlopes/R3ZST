import {DeckFactory} from './deck.js';
import {Module} from '../../../injection/module.js';
import {NodeFactory} from './node.js';
import {PlayerFactory} from './player.js';

class DebugModule extends Module {
  configure() {
    this.bindClass(DeckFactory);
    this.bindClass(NodeFactory);
    this.bindClass(PlayerFactory);
  }
}

export {DebugModule};