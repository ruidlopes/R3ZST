import {NETWORK} from './qualifiers.js';
import {RNG_NETWORK} from '../common/randomchannels.js';
import {ActiveComponent} from '../components/active.js';
import {ChipType} from '../components/chip.js';
import {ConnectionFactory} from './network/connection.js';
import {EntityManager} from '../entity/manager.js';
import {NetSpec} from './network/netspec.js';
import {NodeFactory} from './network/node.js';
import {NodeType} from '../components/node.js';
import {Random} from '../../stdlib/random.js';
import {firstOf, mapOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class NetworkFactory {
  constructor(
      entities = ij(EntityManager),
      random = ij(Random),
      nodeFactory = ij(NodeFactory, NETWORK),
      connectionFactory = ij(ConnectionFactory, NETWORK)) {
    this.entities = entities;
    this.random = random;
    
    this.nodeFactory = nodeFactory;
    this.connectionFactory = connectionFactory;
  }
  
  ids(type) {
    const spec = NetSpec.get(type);
    const min = spec.get('min');
    const max = spec.get('max');
    const count = this.random.channel(RNG_NETWORK).randomRangeInclusive(min, max);
    
    const ids = [];
    for (let i = 0; i < count; ++i) {
      ids.push(this.entities.nextId());
    }
    return ids;
  }
  
  make() {
    const children = new Map();
    
    const coreId = this.entities.nextId();
    const datacenterIds = this.ids(NodeType.DATACENTER_UNIT);
    const datacenterTypes = new Map();
    children.set(coreId, datacenterIds);
    
    for (const datacenterId of datacenterIds) {
      const isCameraNetwork = this.random.channel(RNG_NETWORK).randomBoolean();
      datacenterTypes.set(datacenterId, isCameraNetwork);
      
      const routerIds = this.ids(isCameraNetwork ?
          NodeType.RETSAFE_CAMROUTER_L1 :
          NodeType.ROUTER);
      
      children.set(datacenterId, routerIds);
      
      for (const routerId of routerIds) {
        const machineIds = this.ids(isCameraNetwork ?
            NodeType.RETSAFE_CAM :
            NodeType.WORKSTATION);
        
        children.set(routerId, machineIds);
      }
    }
    
    this.nodeFactory.make(NodeType.CORE, mapOf(
      'nodeId', coreId,
      ChipType.NIC, mapOf(
        'min', children.get(coreId).length,
        'max', children.get(coreId).length,
      ),
    ));
    
    for (const datacenterId of children.get(coreId)) {
      this.nodeFactory.make(NodeType.DATACENTER_UNIT, mapOf(
        'nodeId', datacenterId,
        ChipType.NIC, mapOf(
          'min', children.get(datacenterId).length + 1,
          'max', children.get(datacenterId).length + 1,
        ),
      ));
      this.connectionFactory.make(coreId, datacenterId);
      
      const isCameraNetwork = datacenterTypes.get(datacenterId);
      const routerType = isCameraNetwork ?
          NodeType.RETSAFE_CAMROUTER_L1 :
          NodeType.ROUTER;
      const machineType = isCameraNetwork ?
          NodeType.RETSAFE_CAM :
          NodeType.WORKSTATION;
      
      for (const routerId of children.get(datacenterId)) {
        this.nodeFactory.make(routerType, mapOf(
          'nodeId', routerId,
          ChipType.NIC, mapOf(
            'min', children.get(routerId).length + 1,
            'max', children.get(routerId).length + 1,
          ),
        ));
        this.connectionFactory.make(datacenterId, routerId);
        
        for (const machineId of children.get(routerId)) {
          this.nodeFactory.make(machineType, mapOf(
            'nodeId', machineId,
          ));
          this.connectionFactory.make(routerId, machineId);
        }
      }
    }
    
    firstOf(this.entities.query([coreId])
        .iterate(ActiveComponent))
        .get(ActiveComponent).active = true;
  }
}

export {NetworkFactory};