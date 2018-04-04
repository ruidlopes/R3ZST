import {BLACK, BLUE_BRIGHT} from '../../common/palette.js';
import {NETWORK} from '../qualifiers.js';
import {ActiveComponent} from '../../components/active.js';
import {ChipFactory} from './chip.js';
import {CompositeComponent} from '../../components/composite.js';
import {EntityManager} from '../../entity/manager.js';
import {NodeComponent} from '../../components/node.js';
import {NodeSpec} from './nodespec.js';
import {SpatialComponent} from '../../components/spatial.js';
import {StyleComponent} from '../../components/style.js';
import {ij} from '../../../injection/api.js';
import {mapOf} from '../../../stdlib/collections.js';

class NodeFactory {
  constructor(
      entities = ij(EntityManager),
      chipFactory = ij(ChipFactory, NETWORK)) {
    this.entities = entities;
    this.chipFactory = chipFactory;
  }
  
  make(type) {
    const chipIds = [];
    for (const [chipType, chipSpec] of NodeSpec.get(type)) {
      const constraints = mapOf('versions', chipSpec.get('versions'));
      const id = this.chipFactory.make(chipType, constraints);
      chipIds.push(id);
    }
    
    chipIds.forEach((chipId, i) => {
      this.entities.add(
        chipId,
        new SpatialComponent(i * 5, 0, 4, 4));
    });
    
    const nodeId = this.entities.nextId();
    this.entities.add(
        nodeId,
        new ActiveComponent(false),
        new CompositeComponent(chipIds),
        new NodeComponent(type),
        new SpatialComponent(0, 0, 5 * (chipIds.length + 1), 10),
        new StyleComponent(BLUE_BRIGHT, BLACK));
    return nodeId;
  }
}

export {NodeFactory};