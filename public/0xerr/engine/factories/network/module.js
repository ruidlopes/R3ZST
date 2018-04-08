import {NETWORK} from '../qualifiers.js';
import {ChipFactory} from './chip.js';
import {ConnectionFactory} from './connection.js';
import {Module} from '../../../injection/module.js';
import {NodeFactory} from './node.js';
import {PlayerFactory} from './player.js';
import {SentryFactory} from './sentry.js';

class NetworkModule extends Module {
  configure() {
    this.bindClass(ChipFactory, NETWORK);
    this.bindClass(ConnectionFactory, NETWORK);
    this.bindClass(NodeFactory, NETWORK);
    this.bindClass(PlayerFactory, NETWORK);
    this.bindClass(SentryFactory, NETWORK);
  }
}

export {NetworkModule};