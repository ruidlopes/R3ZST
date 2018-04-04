import {DebugModule} from './debug/module.js';
import {GameFactory} from './game.js';
import {Module} from '../../injection/module.js';
import {NetworkFactory} from './network.js';
import {NetworkModule} from './network/module.js';
import {ViewFactory} from './view.js';

class FactoryModule extends Module {
  configure() {
    this.install(new DebugModule());
    this.install(new NetworkModule());
    
    this.bindClass(GameFactory);
    this.bindClass(NetworkFactory);
    this.bindClass(ViewFactory);
  }
}

export {FactoryModule};