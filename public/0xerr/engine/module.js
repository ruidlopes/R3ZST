import {SCREEN} from './qualifiers.js';
import {CommonModule} from './common/module.js';
import {CxelBuffer} from '../renderer/cxel/buffer.js';
import {Engine} from './engine.js';
import {EntityModule} from './entity/module.js';
import {FactoryModule} from './factories/module.js';
import {MainScene} from './mainscene.js';
import {Module} from '../injection/module.js';
import {Scene} from './scene.js';
import {SystemsModule} from './systems/module.js';

class EngineModule extends Module {
  configure() {
    this.install(
        new CommonModule(),
        new EntityModule(),
        new FactoryModule(),
        new SystemsModule(),
    );
    this.bindClass(CxelBuffer, SCREEN);
    this.bindClass(Engine);
    
    this.bindClassIntoSet(Scene, MainScene);
  }
}

export {EngineModule};