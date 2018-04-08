import {BLACK, BLUE_BRIGHT} from '../../common/palette.js';
import {EntityManager} from '../../entity/manager.js';
import {Random} from '../../../stdlib/random.js';
import {SentryComponent, SentryCapabilities} from '../../components/sentry.js';
import {SentrySpec} from './sentryspec.js';
import {SpatialComponent} from '../../components/spatial.js';
import {StyleComponent} from '../../components/style.js';
import {ij} from '../../../injection/api.js';

class SentryFactory {
  constructor(
      entities = ij(EntityManager),
      random = ij(Random)) {
    this.entities = entities;
    this.random = random;
  }
  
  make(spec = new Map()) {
    const id = this.entities.nextId();
    
    this.entities.add(
        id,
        new SentryComponent([]),
        new StyleComponent(BLUE_BRIGHT, BLACK));
    
    return id;
  }
}

export {SentryFactory};