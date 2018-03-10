import {ActiveComponent} from '../components/active.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent, NodeType} from '../components/node.js';
import {BLACK, BLUE_BRIGHT} from '../common/palette.js';
import {SpatialComponent} from '../components/spatial.js';
import {StyleComponent} from '../components/style.js';
import {ij} from '../../injection/api.js';

class NodeFactory {
  constructor(manager = ij(EntityManager)) {
    this.manager = manager;
  }
  
  make() {
    this.manager.add(
        this.manager.nextId(),
        new ActiveComponent(true),
        new NodeComponent(NodeType.HVAC),
        new SpatialComponent(10, 10, 40, 20),
        new StyleComponent(BLUE_BRIGHT, BLACK));
  }
}

export {NodeFactory};