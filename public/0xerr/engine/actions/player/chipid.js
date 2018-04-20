import {ActionRefreshEnum} from '../../action.js';
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
import {ChipScriptAction} from './lib/chipscript.js';
import {EventType} from '../../event/type.js';
import {IdentifiedComponent} from '../../components/identified.js';
import {enumLabel} from '../../../stdlib/collections.js';

class ChipIdAction extends ChipScriptAction {
  constructor() {
    super();
    this.cycles = 1;
    this.limit = 3;
    this.refresh = ActionRefreshEnum.NODE;
    
    this.man = [
      'USAGE: CHIPID',
      'IDENTIFIES THE CURRENT CHIP.',
    ];
  }
  
  constraints() {
    const activeChip = this.activeChip();
    if (!activeChip || !activeChip.get(ActiveComponent).active) {
      this.events.emit(EventType.LOG, 'NO CHIP IN RANGE.');
      return false;
    }
    return true;
  }
  
  start() {
    const chip = this.activeChip();
    chip.get(IdentifiedComponent).identified = true;
    
    const type = chip.get(ChipComponent).type;
    const typeStr = enumLabel(ChipType, type);
    const version = chip.get(ChipComponent).version;
    const versionStr = this.versionStr(type, version);
    this.events.emit(
        EventType.LOG,
        `IDENTIFIED CHIP ${typeStr} ${versionStr}`); 
  }
  
  versionStr(type, value) {
    const versionType =
        type == ChipType.BIOS ? ChipBiosVersion :
        type == ChipType.CAM ? ChipCamVersion :
        type == ChipType.CPU ? ChipCpuVersion :
        type == ChipType.MEM ? ChipMemVersion :
        type == ChipType.NIC ? ChipNicVersion : null;
    return enumLabel(versionType, value)
  }
}

export {ChipIdAction};