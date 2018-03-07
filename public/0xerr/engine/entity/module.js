import {EntityManager} from './manager.js';
import {Module} from '../../injection/module.js';

class EntityModule extends Module {
  configure() {
    this.bindClass(EntityManager);
  }
}

export {EntityModule};