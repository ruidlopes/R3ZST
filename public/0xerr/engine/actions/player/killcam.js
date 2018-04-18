import {ChipScriptAction} from './lib/chipscript.js';
import {ChipType} from '../../components/chip.js';
import {EventType} from '../../event/type.js';
import {RetCamStatusComponent, RetCamStatus} from '../../components/retcamstatus.js';

class KillCamAction extends ChipScriptAction {
  constructor() {
    super(ChipType.CAM);
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

export {KillCamAction};