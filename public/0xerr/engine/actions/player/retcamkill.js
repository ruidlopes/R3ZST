import {Action} from '../../action.js';
import {ActiveComponent} from '../../components/active.js';
import {ChipComponent, ChipType} from '../../components/chip.js';
import {EntityManager} from '../../entity/manager.js';
import {EventManager} from '../../event/manager.js';
import {EventType} from '../../event/type.js';
import {RetCamStatusComponent, RetCamStatus} from '../../components/retcamstatus.js';
import {IdentifiedComponent} from '../../components/identified.js';
import {firstOf, isEmpty} from '../../../stdlib/collections.js';
import {ij} from '../../../injection/api.js';

class RetCamKillAction extends Action {
  constructor(
      entities = ij(EntityManager),
      events = ij(EventManager)) {
    super();
    this.entities = entities;
    this.events = events;
    
    this.command = 'RETCAMKILL';
    this.cycles = 2;
  }
  
  activeChip() {
    return this.entities.query()
        .filter(ActiveComponent, component => component.active)
        .filter(ChipComponent)
        .iterate(ChipComponent, ActiveComponent, IdentifiedComponent, RetCamStatusComponent);
  }
  
  constraints() {
  if (isEmpty(this.activeChip())) {
      this.events.emit(EventType.LOG, 'NO RETCAM CHIP IN RANGE.');
      return false;
    }
    
    const activeChip = firstOf(this.activeChip());
    
    if (!activeChip.get(IdentifiedComponent).identified) {
      this.events.emit(EventType.LOG, 'UNIDENTIFIED CHIP.');
      return false;
    }
    
    if (activeChip.get(ChipComponent).type != ChipType.CAM) {
      this.events.emit(EventType.LOG, 'INVALID CHIP.');
      return false;
    }
    
    return true;
  }
  
  start() {
    const activeChip = firstOf(this.activeChip());
    activeChip.get(RetCamStatusComponent).status = RetCamStatus.DISCONNECTED;
    
    this.events.emit(EventType.LOG, 'RETCAM DISCONNECTED.');
  }
}

export {RetCamKillAction};