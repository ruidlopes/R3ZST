import {BLACK, BLUE_BRIGHT} from '../../common/palette.js';
import {ActiveComponent} from '../../components/active.js';
import {
  ChipComponent,
  ChipType,
  ChipBiosVersion,
  ChipCamVersion,
  ChipCpuVersion,
  ChipMemVersion,
  ChipNicVersion,
} from '../../components/chip.js';
import {CompositeComponent} from '../../components/composite.js';
import {ConnectionComponent} from '../../components/connection.js';
import {EntityManager} from '../../entity/manager.js';
import {IdentifiedComponent} from '../../components/identified.js';
import {IpComponent} from '../../components/ip.js';
import {NodeComponent, NodeType} from '../../components/node.js';
import {RetCamStatusComponent} from '../../components/retcamstatus.js';
import {SentryComponent, SentryCapabilities} from '../../components/sentry.js';
import {SpatialComponent} from '../../components/spatial.js';
import {StyleComponent} from '../../components/style.js';
import {TagComponent} from '../../components/tag.js';
import {VisitedComponent} from '../../components/visited.js';
import {enumValue} from '../../../stdlib/collections.js';
import {ij} from '../../../injection/api.js';

class NodeFactory {
  constructor(manager = ij(EntityManager)) {
    this.manager = manager;
  }
  
  makeVisited(width, height) {
    const visited = new Array(height);
    for (let i = 0; i < height; ++i) {
      visited[i] = new Array(width);
      visited[i].fill(0);
    }
    return visited;
  }
  
  make() {
    const node1 = this.manager.nextId();
    this.manager.add(
        node1,
        new ActiveComponent(false),
        new NodeComponent(NodeType.WORKSTATION),
        new SpatialComponent(0, 0, 40, 20),
        new StyleComponent(BLUE_BRIGHT, BLACK),
        new VisitedComponent(this.makeVisited(42, 22)));

    const sentry1 = this.manager.nextId();
    this.manager.add(
        sentry1,
        new SentryComponent([SentryCapabilities.CHIPID]),
        new SpatialComponent(6, 6, 0, 0),
        new StyleComponent(BLUE_BRIGHT, BLACK),
        new IdentifiedComponent(false),
        new ActiveComponent(false));
    
    const chip1 = this.manager.nextId();
    this.manager.add(
        chip1,
        new ActiveComponent(false),
        new ChipComponent(ChipType.CPU, enumValue(ChipCpuVersion, 'RET.ARM R8')),
        new SpatialComponent(0, 0, 12, 12),
        new StyleComponent(BLUE_BRIGHT, BLACK),
        new IdentifiedComponent(false),
        new CompositeComponent([sentry1]),
        new TagComponent());
    
    const chip2 = this.manager.nextId();
    this.manager.add(
        chip2,
        new ActiveComponent(false),
        new ChipComponent(ChipType.BIOS, enumValue(ChipBiosVersion, 'RET.BIOS EMBED')),
        new SpatialComponent(18, 4, 4, 4),
        new StyleComponent(BLUE_BRIGHT, BLACK),
        new IdentifiedComponent(false),
        new CompositeComponent([]),
        new TagComponent());
    
    const chip3 = this.manager.nextId();
    this.manager.add(
        chip3,
        new ActiveComponent(false),
        new ChipComponent(ChipType.NIC, enumValue(ChipNicVersion, 'RET.NET GIGA1')),
        new SpatialComponent(37, 4, 3, 4),
        new StyleComponent(BLUE_BRIGHT, BLACK),
        new IdentifiedComponent(false),
        new CompositeComponent([]),
        new IpComponent([10, 10, 1, 1]),
        new TagComponent());
    
    this.manager.add(
        node1,
        new CompositeComponent([chip1, chip2, chip3]));
    
    
    const node2 = this.manager.nextId();
    this.manager.add(
        node2,
        new ActiveComponent(true),
        new NodeComponent(NodeType.FIREWALL),
        new SpatialComponent(0, 0, 50, 10),
        new StyleComponent(BLUE_BRIGHT, BLACK),
        new VisitedComponent(this.makeVisited(52, 12)));
    
    const chip4 = this.manager.nextId();
    this.manager.add(
        chip4,
        new ActiveComponent(false),
        new ChipComponent(ChipType.NIC, enumValue(ChipNicVersion, 'RET.NET FIBER1')),
        new SpatialComponent(1, 7, 4, 3),
        new StyleComponent(BLUE_BRIGHT, BLACK),
        new IdentifiedComponent(false),
        new CompositeComponent([]),
        new IpComponent([10, 10, 1, 2]),
        new TagComponent());
    
    const chip5 = this.manager.nextId();
    this.manager.add(
        chip5,
        new ActiveComponent(false),
        new ChipComponent(ChipType.CAM, enumValue(ChipCamVersion, 'RETINA CAM1')),
        new SpatialComponent(7, 6, 6, 4),
        new StyleComponent(BLUE_BRIGHT, BLACK),
        new IdentifiedComponent(false),
        new RetCamStatusComponent(),
        new CompositeComponent([]),
        new TagComponent());
    
    this.manager.add(
        node2,
        new CompositeComponent([chip4, chip5]));
    
    
    const conn1 = this.manager.nextId();
    this.manager.add(
        conn1,
        new ConnectionComponent(),
        new CompositeComponent([chip3, chip4]));
  }
}

export {NodeFactory};