import {EntityCache} from './cache.js';
import {EntityLib} from './lib.js';
import {EntityManager} from './manager.js';
import {Module} from '../../injection/module.js';

class EntityModule extends Module {
  configure() {
    this.bindClass(EntityCache);
    this.bindClass(EntityLib);
    this.bindClass(EntityManager);
  }
}

export {EntityModule};