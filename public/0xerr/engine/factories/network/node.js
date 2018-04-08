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
import {SentryFactory} from './sentry.js';
import {SentrySpec} from './sentryspec.js';
import {SpatialComponent} from '../../components/spatial.js';
import {StyleComponent} from '../../components/style.js';
import {ij} from '../../../injection/api.js';
import {mapOf, shuffle} from '../../../stdlib/collections.js';

class NodeFactory {
  constructor(
      entities = ij(EntityManager),
      random = ij(Random),
      chipFactory = ij(ChipFactory, NETWORK),
      sentryFactory = ij(SentryFactory, NETWORK)) {
    this.entities = entities;
    this.random = random;
    this.chipFactory = chipFactory;
    this.sentryFactory = sentryFactory;
  }
  
  make(type, overrides = new Map()) {
    const chipTemplates = [];
    for (const [chipType, chipSpec] of NodeSpec.get(type)) {
      const min = overrides.has(chipType) ?
          overrides.get(chipType).get('min') :
          chipSpec.get('min');
      const max = overrides.has(chipType) ?
          overrides.get(chipType).get('max') :
          chipSpec.get('max');
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
    
    const minWidth = Math.ceil(Math.sqrt(chipIds.length));
    const minHeight = Math.ceil(chipIds.length / minWidth);
    
    const width = this.random.channel(RNG_NETWORK)
        .randomRangeInclusive(minWidth, minWidth * 2);
    const height = this.random.channel(RNG_NETWORK)
        .randomRangeInclusive(minHeight, minHeight * 2);
    
    const cells = new Array(width * height);
    cells.fill(-1);
    for (let i = 0; i < chipIds.length; ++i) {
      cells[i] = i;
    }
    shuffle(cells, this.random.channel(RNG_NETWORK));
    
    chipIds.forEach((chipId, i) => {
      const cell = cells.indexOf(i);
      const cellY = Math.floor(cell / width);
      const cellX = cell % width;
      
      const cellWidth = 4;
      const cellHeight = 4;
      
      this.entities.add(
          chipId,
          new SpatialComponent(
              1 + cellX * (cellWidth + 1),
              1 + cellY * (cellHeight + 1),
              cellWidth,
              cellHeight)
      );
      
      const chipType = chipTemplates[i];
      const sentrySpec = SentrySpec.get(type).get(chipType);
      const ratio = sentrySpec.get('ratio');
      const sentryCount = this.random.channel(RNG_NETWORK)
          .randomRangeInclusive(1, Math.floor(cellWidth * cellHeight * ratio));
      
      const sentryIds = [];
      for (let i = 0; i < sentryCount; ++i) {
        const sentryId = this.sentryFactory.make(sentrySpec);
        const sentryY = Math.floor(i / cellHeight);
        const sentryX = i % cellWidth;
        
        this.entities.add(
            sentryId,
            new SpatialComponent(sentryX, sentryY, 0, 0));
        
        sentryIds.push(sentryId);
      }
      
      this.entities.add(
          chipId,
          new CompositeComponent(sentryIds));
    });
    
    const nodeId = overrides.has('nodeId') ?
        overrides.get('nodeId') :
        this.entities.nextId();
    this.entities.add(
        nodeId,
        new ActiveComponent(false),
        new CompositeComponent(chipIds),
        new NodeComponent(type),
        new SpatialComponent(0, 0, 1 + 5 * width, 1 + 5 * height),
        new StyleComponent(BLUE_BRIGHT, BLACK));
    return nodeId;
  }
}

export {NodeFactory};