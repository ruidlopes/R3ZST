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
  
  connection() {
    const activeChip = firstOf(this.activeChip());
    return firstOf(this.entities.query()
        .filter(ConnectionComponent)
        .filter(CompositeComponent, composite => composite.ids.includes(activeChip.id))
        .iterate(ConnectionComponent, CompositeComponent));
  }
  
  destinationNic() {
    const connection = this.connection();
    const activeChip = firstOf(this.activeChip());
    const composite = connection.get(CompositeComponent);
    const position = composite.ids.indexOf(activeChip.id);
    const destination = composite.ids[1 - position];
    return firstOf(this.entities.query([destination])
        .iterate(ActiveComponent, IdentifiedComponent, SpatialComponent));
  }
  
  destinationNodeActive(nic) {
    return firstOf(this.entities.query()
        .filter(NodeComponent)
        .filter(CompositeComponent, composite => composite.ids.includes(nic))
        .iterate(ActiveComponent))
        .get(ActiveComponent);
  }
  
  playerSpatial() {
    return firstOf(this.entities.query()
        .filter(StealthComponent)
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  constraints() {
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
    
    return true;
  }
  
  start() {
    this.events.emit(EventType.LOG, `CONNECTING...`);
    if (!this.connection()) {
      this.events.emit(EventType.LOG, 'CONNECTION TIMEOUT.');
      return;
    }
    
    const nic1 = firstOf(this.activeChip());
    const nic2 = this.destinationNic();
    
    this.activeNode().get(ActiveComponent).active = false;
    nic1.get(ActiveComponent).active = false;
    nic2.get(IdentifiedComponent).identified = true;
    nic2.get(ActiveComponent).active = true;
    
    const nic2Spatial = nic2.get(SpatialComponent);
    const playerSpatial = this.playerSpatial();
    playerSpatial.x = nic2Spatial.x;
    playerSpatial.y = nic2Spatial.y;
    
    this.destinationNodeActive(nic2.id).active = true;
    
    this.events.emit(EventType.NODE);
    this.events.emit(EventType.LOG, 'CONNECTED');
  }
}

export {ConnectAction};