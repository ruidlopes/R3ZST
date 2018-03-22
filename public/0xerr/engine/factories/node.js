import {BLACK, BLUE_BRIGHT} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {ChipComponent, ChipType} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {EntityManager} from '../entity/manager.js';
import {IdentifiedComponent} from '../components/identified.js';
import {NodeComponent, NodeType} from '../components/node.js';
import {SentinelComponent} from '../components/sentinel.js';
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

    const sentinel1 = this.manager.nextId();
    this.manager.add(
        sentinel1,
        new SentinelComponent(),
        new SpatialComponent(6, 6, 0, 0),
        new StyleComponent(BLUE_BRIGHT, BLACK));
    
    const chip1 = this.manager.nextId();
    this.manager.add(
        chip1,
        new ChipComponent(ChipType.CPU, 'RET V.33'),
        new SpatialComponent(4, 4, 12, 12),
        new StyleComponent(BLUE_BRIGHT, BLACK),
        new IdentifiedComponent(false),
        new CompositeComponent([sentinel1]));
    
    const chip2 = this.manager.nextId();
    this.manager.add(
        chip2,
        new ChipComponent(ChipType.BIOS, 'RETBIOS V.1'),
        new SpatialComponent(18, 4, 4, 4),
        new StyleComponent(BLUE_BRIGHT, BLACK),
        new IdentifiedComponent(false),
        new CompositeComponent([]));
    
    this.manager.add(
        nodeId,
        new CompositeComponent([chip1, chip2]));
  }
}

export {NodeFactory};