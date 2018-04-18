import {ActiveComponent} from '../../components/active.js';
import {ChipComponent, ChipType} from '../../components/chip.js';
import {ChipScriptAction} from './lib/chipscript.js';
import {CompositeComponent} from '../../components/composite.js';
import {ConnectionComponent} from '../../components/connection.js';
import {EventType} from '../../event/type.js';
import {IdentifiedComponent} from '../../components/identified.js';
import {IpComponent} from '../../components/ip.js';
import {NodeComponent} from '../../components/node.js';
import {SentryComponent} from '../../components/sentry.js';
import {SpatialComponent} from '../../components/spatial.js';
import {StealthComponent} from '../../components/stealth.js';
import {firstOf} from '../../../stdlib/collections.js';

class ConnectAction extends ChipScriptAction {
  constructor() {
    super(ChipType.NIC);
    this.cycles = 4;
  }
  
  activeNode() {
    return firstOf(this.lib.activeNode().iterate(ActiveComponent));
  }
  
  activeChip() {
    return this.activeChipWithComponents(IpComponent);
  }
  
  activeSentry() {
    return firstOf(this.entities.query()
        .filter(ActiveComponent, component => component.active)
        .filter(SentryComponent)
        .iterate(ActiveComponent));
  }
  
  connection() {
    const activeChipId = this.activeChip().id;
    return firstOf(this.entities.query()
        .filter(ConnectionComponent)
        .filter(CompositeComponent, composite => composite.ids.includes(activeChipId))
        .iterate(ConnectionComponent, CompositeComponent));
  }
  
  destinationNic() {
    const connection = this.connection();
    const composite = connection.get(CompositeComponent);
    const position = composite.ids.indexOf(this.activeChip().id);
    const destination = composite.ids[1 - position];
    return firstOf(this.entities.query([destination])
        .iterate(ActiveComponent, IdentifiedComponent, SpatialComponent, IpComponent));
  }
  
  destinationNodeActive(nic) {
    return firstOf(this.entities.query()
        .filter(NodeComponent)
        .filter(CompositeComponent, composite => composite.ids.includes(nic))
        .iterate(ActiveComponent))
        .get(ActiveComponent);
  }
  
  playerSpatial() {
    return this.entities.query()
        .head(StealthComponent, SpatialComponent)
        .get(SpatialComponent);
  }
  
  start() {
    this.events.emit(EventType.LOG, 'CONNECTING...');
    if (!this.connection()) {
      this.events.emit(EventType.LOG, 'CONNECTION TIMEOUT.');
      return;
    }
    
    this.activeNode().get(ActiveComponent).active = false;
    const activeSentry = this.activeSentry();
    if (activeSentry) {
      activeSentry.get(ActiveComponent).active = false;
    }
    
    const nic1 = this.activeChip();
    const nic1ActiveComponent = nic1.get(ActiveComponent);
    
    const nic2 = this.destinationNic();
    const nic2Id = nic2.id;
    const nic2ActiveComponent = nic2.get(ActiveComponent);
    const nic2Spatial = nic2.get(SpatialComponent);
    const targetIp = nic2.get(IpComponent).ip;
    
    nic2.get(IdentifiedComponent).identified = true;
    this.destinationNodeActive(nic2Id).active = true;
    
    const playerSpatial = this.playerSpatial();
    playerSpatial.x = nic2Spatial.x;
    playerSpatial.y = nic2Spatial.y;
    
    nic1ActiveComponent.active = false;
    nic2ActiveComponent.active = true;
    
    this.lib.clearActiveNodeCache();
    
    this.events.emit(EventType.NODE);
    this.events.emit(EventType.LOG, `CONNECTED TO ${targetIp}.`);
  }
}

export {ConnectAction};