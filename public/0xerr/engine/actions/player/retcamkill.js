import {ChipScriptAction} from './base/chipscript.js';
import {ChipType} from '../../components/chip.js';
import {EntityManager} from '../../entity/manager.js';
import {EventManager} from '../../event/manager.js';
import {EventType} from '../../event/type.js';
import {RetCamStatusComponent, RetCamStatus} from '../../components/retcamstatus.js';
import {ij} from '../../../injection/api.js';

class RetCamKillAction extends ChipScriptAction {
  constructor(
      entities = ij(EntityManager),
      events = ij(EventManager)) {
    super(entities, events, ChipType.CAM);
    
    this.command = 'RETCAMKILL';
    this.cycles = 2;
  }
  
  activeChip() {
    return this.activeChipWithComponents(RetCamStatusComponent);
  }
  
  start() {
    this.activeChip().get(RetCamStatusComponent).status = RetCamStatus.DISCONNECTED;
    this.events.emit(EventType.LOG, 'RETCAM DISCONNECTED.');
  }
}

export {RetCamKillAction};