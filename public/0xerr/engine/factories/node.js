import {BLACK, BLUE_BRIGHT} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {ChipComponent, ChipType} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {ConnectionComponent} from '../components/connection.js';
import {EntityManager} from '../entity/manager.js';
import {IdentifiedComponent} from '../components/identified.js';
import {IpComponent} from '../components/ip.js';
import {NodeComponent, NodeType} from '../components/node.js';
import {SentryComponent, SentryCapabilities} from '../components/sentry.js';
import {SpatialComponent} from '../components/spatial.js';
import {StyleComponent} from '../components/style.js';
import {ij} from '../../injection/api.js';

class NodeFactory {
  constructor(manager = ij(EntityManager)) {
    this.manager = manager;
  }
  
  make() {
    const node1 = this.manager.nextId();
    this.manager.add(
        node1,
        new ActiveComponent(false),
        new NodeComponent(NodeType.WORKSTATION),
        new SpatialComponent(0, 0, 40, 20),
        new StyleComponent(BLUE_BRIGHT, BLACK));

    const sentry1 = this.manager.nextId();
    this.manager.add(
        sentry1,
        new SentryComponent([SentryCapabilities.CHIPID]),
        new SpatialComponent(6, 6, 0, 0),
        new StyleComponent(BLUE_BRIGHT, BLACK));
    
    const chip1 = this.manager.nextId();
    this.manager.add(
        chip1,
        new ActiveComponent(false),
        new ChipComponent(ChipType.CPU, 'RET V.33'),
        new SpatialComponent(4, 4, 12, 12),
        new StyleComponent(BLUE_BRIGHT, BLACK),
        new IdentifiedComponent(false),
        new CompositeComponent([sentry1]));
    
    const chip2 = this.manager.nextId();
    this.manager.add(
        chip2,
        new ActiveComponent(false),
        new ChipComponent(ChipType.BIOS, 'RETBIOS V.1'),
        new SpatialComponent(18, 4, 4, 4),
        new StyleComponent(BLUE_BRIGHT, BLACK),
        new IdentifiedComponent(false),
        new CompositeComponent([]));
    
    const chip3 = this.manager.nextId();
    this.manager.add(
        chip3,
        new ActiveComponent(false),
        new ChipComponent(ChipType.NIC, 'RETNET V.2'),
        new SpatialComponent(37, 4, 3, 4),
        new StyleComponent(BLUE_BRIGHT, BLACK),
        new IdentifiedComponent(false),
        new CompositeComponent([]),
        new IpComponent([10, 10, 1, 1]));
    
    this.manager.add(
        node1,
        new CompositeComponent([chip1, chip2, chip3]));
    
    
    const node2 = this.manager.nextId();
    this.manager.add(
        node2,
        new ActiveComponent(true),
        new NodeComponent(NodeType.FIREWALL),
        new SpatialComponent(0, 0, 50, 10),
        new StyleComponent(BLUE_BRIGHT, BLACK));
    
    const chip4 = this.manager.nextId();
    this.manager.add(
        chip4,
        new ActiveComponent(false),
        new ChipComponent(ChipType.NIC, 'RETNET V.3'),
        new SpatialComponent(1, 7, 4, 3),
        new StyleComponent(BLUE_BRIGHT, BLACK),
        new IdentifiedComponent(false),
        new CompositeComponent([]),
        new IpComponent([10, 10, 1, 2]));
    
    this.manager.add(
        node2,
        new CompositeComponent([chip4]));
    
    
    const conn1 = this.manager.nextId();
    this.manager.add(
        conn1,
        new ConnectionComponent(),
        new CompositeComponent([chip3, chip4]));
  }
}

export {NodeFactory};