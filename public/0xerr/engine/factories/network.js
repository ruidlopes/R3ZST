import {EntityManager} from '../entity/manager.js';
import {Random} from '../../stdlib/random.js';
import {ij} from '../../injection/api.js';

class NetworkFactory {
  constructor(
      entities = ij(EntityManager),
      random = ij(Random)) {
    this.entities = entities;
    this.random = random;
  }
  
  make(rawSeed) {
    this.random.setRawSeed(rawSeed);
  }
}

export {NetworkFactory};