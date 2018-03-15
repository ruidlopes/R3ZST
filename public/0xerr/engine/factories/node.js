import {ActiveComponent} from '../components/active.js';
import {ChipComponent, ChipType} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
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
    const nodeId = this.manager.nextId();
    this.manager.add(
        nodeId,
        new ActiveComponent(true),
        new NodeComponent(NodeType.WORKSTATION),
        new SpatialComponent(10, 10, 40, 20),
        new StyleComponent(BLUE_BRIGHT, BLACK));

    const chip1 = this.manager.nextId();
    this.manager.add(
        chip1,
        new ChipComponent(ChipType.CPU),
        new SpatialComponent(5, 5, 10, 10),
        new StyleComponent(BLUE_BRIGHT, BLACK));
    
    this.manager.add(
        nodeId,
        new CompositeComponent([chip1]));
  }
}

export {NodeFactory};