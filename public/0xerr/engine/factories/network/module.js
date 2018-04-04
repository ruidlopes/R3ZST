import {NETWORK} from '../qualifiers.js';
import {ChipFactory} from './chip.js';
import {Module} from '../../../injection/module.js';
import {NodeFactory} from './node.js';

class NetworkModule extends Module {
  configure() {
    this.bindClass(ChipFactory, NETWORK);
    this.bindClass(NodeFactory, NETWORK);
  }
}

export {NetworkModule};