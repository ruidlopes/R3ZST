import {Action} from '../../action.js';
import {ActiveComponent} from '../../components/active.js';
import {ChipComponent, ChipType} from '../../components/chip.js';
import {CompositeComponent} from '../../components/composite.js';
import {ConnectionComponent} from '../../components/connection.js';
import {EntityManager} from '../../entity/manager.js';
import {EventManager} from '../../event/manager.js';
import {EventType} from '../../event/type.js';
import {IdentifiedComponent} from '../../components/identified.js';
import {IpComponent} from '../../components/ip.js';
import {NodeComponent} from '../../components/node.js';
import {SpatialComponent} from '../../components/spatial.js';
import {StealthComponent} from '../../components/stealth.js';
import {firstOf, isEmpty, sameElements} from '../../../stdlib/collections.js';
import {ij} from '../../../injection/api.js';

class ConnectAction extends Action {
  constructor(
      entities = ij(EntityManager),
      events = ij(EventManager)) {
    super();
    this.entities = entities;
    this.events = events;
    
    this.cycles = 4;
  }
  
  activeNode() {
    return firstOf(this.entities.query()
        .filter(NodeComponent)
        .filter(ActiveComponent, component => component.active)
        .iterate(ActiveComponent));
  }
  
  activeChip() {
    return this.entities.query()
        .filter(ChipComponent)
        .filter(ActiveComponent, component => component.active)
        .iterate(ChipComponent, ActiveComponent, IdentifiedComponent, IpComponent);
  }
  
  destinationNic(ip) {
    const address = ip.split('.');
    return firstOf(this.entities.query()
        .filter(ChipComponent, chip => chip.type == ChipType.NIC)
        .filter(IpComponent, component => sameElements(component.ip, address))
        .iterate(ActiveComponent, IdentifiedComponent, SpatialComponent));
  }
  
  destinationNodeActive(nic) {
    return firstOf(this.entities.query()
        .filter(NodeComponent)
        .filter(CompositeComponent, composite => composite.ids.includes(nic))
        .iterate(ActiveComponent))
        .get(ActiveComponent);
  }
  
  hasConnection(nic1, nic2) {
    return !isEmpty(this.entities.query()
        .filter(ConnectionComponent)
        .filter(CompositeComponent,
                composite => (composite.ids[0] == nic1 &&
                              composite.ids[1] == nic2) ||
                             (composite.ids[0] == nic2 &&
                              composite.ids[1] == nic1))
        .iterate(ConnectionComponent));
  }
  
  playerSpatial() {
    return firstOf(this.entities.query()
        .filter(StealthComponent)
        .first()
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  constraints(ip) {
    if (isEmpty(this.activeChip())) {
      this.events.emit(EventType.LOG, 'NO NIC CHIP IN RANGE.');
      return false;
    }
    
    const activeChip = firstOf(this.activeChip());
    
    if (!activeChip.get(IdentifiedComponent).identified) {
      this.events.emit(EventType.LOG, 'UNIDENTIFIED CHIP.');
      return false;
    }
    
    if (activeChip.get(ChipComponent).type != ChipType.NIC) {
      this.events.emit(EventType.LOG, 'INVALID CHIP.');
      return false;
    }
    
    if (ip == undefined) {
      this.events.emit(EventType.LOG, 'MISSING IP TO CONNECT TO.');
      return false;
    }
    
    if (sameElements(ip.split('.'), activeChip.get(IpComponent).ip)) {
      this.events.emit(EventType.LOG, `ALREADY AT ${ip}`);
      return false;
    }
    
    return true;
  }
  
  start(ip) {
    this.events.emit(EventType.LOG, `CONNECTING TO ${ip}`);
    
    const nic1 = firstOf(this.activeChip());
    const nic2 = this.destinationNic(ip);
    if (!this.hasConnection(nic1.id, nic2.id)) {
      this.events.emit(EventType.LOG, 'CONNECTION TIMEOUT.');
      return;
    }
    
    this.activeNode().get(ActiveComponent).active = false;
    nic1.get(ActiveComponent).active = false;
    nic2.get(IdentifiedComponent).identified = true;
    nic2.get(ActiveComponent).active = true;
    
    const nic2Spatial = nic2.get(SpatialComponent);
    const playerSpatial = this.playerSpatial();
    playerSpatial.x = nic2Spatial.x;
    playerSpatial.y = nic2Spatial.y;
    
    this.destinationNodeActive(nic2.id).active = true;
    
    this.events.emit(EventType.LOG, 'CONNECTED');
  }
}

export {ConnectAction};