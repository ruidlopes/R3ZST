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
    const id = this.manager.nextId();
    this.manager.add(id, new ActiveComponent(true));
    this.manager.add(id, new NodeComponent(NodeType.HVAC));
    this.manager.add(id, new SpatialComponent(10, 10, 40, 20));
    this.manager.add(id, new StyleComponent(BLUE_BRIGHT, BLACK));
  }
}

export {NodeFactory};