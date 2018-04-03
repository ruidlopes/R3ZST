import {SCREEN} from './qualifiers.js';
import {ActionsModule} from './actions/module.js';
import {CommonModule} from './common/module.js';
import {CxelBuffer} from '../renderer/cxel/buffer.js';
import {Engine} from './engine.js';
import {EntityModule} from './entity/module.js';
import {EventModule} from './event/module.js';
import {FactoryModule} from './factories/module.js';
import {MainScene} from './mainscene.js';
import {Module} from '../injection/module.js';
import {Random} from '../stdlib/random.js';
import {Scene} from './scene.js';
import {SystemsModule} from './systems/module.js';

class EngineModule extends Module {
  configure() {
    this.install(
        new ActionsModule(),
        new CommonModule(),
        new EntityModule(),
        new EventModule(),
        new FactoryModule(),
        new SystemsModule(),
    );
    this.bindClass(CxelBuffer, SCREEN);
    this.bindClass(Engine);
    this.bindClass(Random);
    
    this.bindClassIntoSet(Scene, MainScene);
  }
}

export {EngineModule};