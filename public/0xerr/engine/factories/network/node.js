import {BLACK, BLUE_BRIGHT} from '../../common/palette.js';
import {NETWORK} from '../qualifiers.js';
import {RNG_NETWORK} from '../../common/randomchannels.js';
import {ActiveComponent} from '../../components/active.js';
import {ChipFactory} from './chip.js';
import {CompositeComponent} from '../../components/composite.js';
import {EntityManager} from '../../entity/manager.js';
import {NodeComponent} from '../../components/node.js';
import {NodeSpec} from './nodespec.js';
import {Random} from '../../../stdlib/random.js';
import {SpatialComponent} from '../../components/spatial.js';
import {StyleComponent} from '../../components/style.js';
import {ij} from '../../../injection/api.js';
import {mapOf, shuffle} from '../../../stdlib/collections.js';

class NodeFactory {
  constructor(
      entities = ij(EntityManager),
      random = ij(Random),
      chipFactory = ij(ChipFactory, NETWORK)) {
    this.entities = entities;
    this.random = random;
    this.chipFactory = chipFactory;
  }
  
  make(type) {
    const chipTemplates = [];
    for (const [chipType, chipSpec] of NodeSpec.get(type)) {
      const min = chipSpec.get('min');
      const max = chipSpec.get('max');
      const count = this.random.channel(RNG_NETWORK)
          .randomRangeInclusive(min, max);
      
      for (let i = 0; i < count; ++i) {
        chipTemplates.push(chipType);
      }
    }
    shuffle(chipTemplates, this.random.channel(RNG_NETWORK));
    
    const chipIds = [];
    for (const chipType of chipTemplates) {
      const chipSpec = NodeSpec.get(type).get(chipType);
      const constraints = mapOf('versions', chipSpec.get('versions'));
      const id = this.chipFactory.make(chipType, constraints);
      chipIds.push(id);
    }
    
    chipIds.forEach((chipId, i) => {
      this.entities.add(
        chipId,
        new SpatialComponent(1 + i * 5, 1, 4, 4));
    });
    
    const nodeId = this.entities.nextId();
    this.entities.add(
        nodeId,
        new ActiveComponent(false),
        new CompositeComponent(chipIds),
        new NodeComponent(type),
        new SpatialComponent(0, 0, 2 + 5 * (chipIds.length), 10),
        new StyleComponent(BLUE_BRIGHT, BLACK));
    return nodeId;
  }
}

export {NodeFactory};