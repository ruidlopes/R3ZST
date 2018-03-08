import {ActiveComponent} from '../components/active.js';
import {Color} from '../../renderer/graphics/color.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent, NodeType} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {StyleComponent} from '../components/style.js';
import {ij} from '../../injection/api.js';
import {randomInt} from '../../stdlib/random.js';

class NodeFactory {
  constructor(manager = ij(EntityManager)) {
    this.manager = manager;
  }
  
  make() {
    const id = this.manager.nextId();
    this.manager.add(id, new ActiveComponent(true));
    this.manager.add(id, new NodeComponent(NodeType.HVAC));
    this.manager.add(id, new SpatialComponent(10, 10, 40, 20));
    this.manager.add(id, new StyleComponent(
        new Color().setHSV(0, 0, 1).lock(),
        new Color().setHSV(randomInt(360), 1, .5).lock()));
  }
}

export {NodeFactory};