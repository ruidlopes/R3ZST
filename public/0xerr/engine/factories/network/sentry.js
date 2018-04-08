import {BLACK, BLUE_BRIGHT} from '../../common/palette.js';
import {RNG_NETWORK} from '../../common/randomchannels.js';
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
    const capability = spec.has('capabilities') ?
        this.random.channel(RNG_NETWORK).randomItem(spec.get('capabilities')) :
        undefined;
    
    this.entities.add(
        id,
        new SentryComponent(capability ? [capability] : []),
        new StyleComponent(BLUE_BRIGHT, BLACK));
    
    return id;
  }
}

export {SentryFactory};