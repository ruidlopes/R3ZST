import {SCREEN} from './qualifiers.js';
import {CxelBuffer} from '../renderer/cxel/buffer.js';
import {Engine} from './engine.js';
import {EntityModule} from './entity/module.js';
import {FactoryModule} from './factory/module.js';
import {Module} from '../injection/module.js';
import {ScenesModule} from './scenes/module.js';

class EngineModule extends Module {
  configure() {
    this.install(
        new EntityModule(),
        new FactoryModule(),
        new ScenesModule(),
    );
    this.bindClass(CxelBuffer, SCREEN);
    this.bindClass(Engine);
  }
}

export {EngineModule};