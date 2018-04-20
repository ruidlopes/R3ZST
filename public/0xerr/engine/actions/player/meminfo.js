import {ActionRefreshEnum} from '../../action.js';
import {ChipComponent, ChipType, ChipNicVersion} from '../../components/chip.js';
import {ChipScriptAction} from './lib/chipscript.js';
import {EventType} from '../../event/type.js';
import {IdentifiedComponent} from '../../components/identified.js';
import {IpComponent} from '../../components/ip.js';
import {enumLabel} from '../../../stdlib/collections.js';

class MemInfoAction extends ChipScriptAction {
  constructor() {
    super(ChipType.BIOS);
    this.cycles = 2;
    this.stealthCost = 1;
    this.limit = 1;
    this.refresh = ActionRefreshEnum.NODE;
  }
  
  activeNodeChips() {
    return this.lib.activeNodeChips().iterate(ChipComponent, IdentifiedComponent);
  }
  
  start() {
    let count = 0;
    for (const chip of this.activeNodeChips()) {
      if (chip.get(ChipComponent).type == ChipType.MEM) {
        chip.get(IdentifiedComponent).identified = true;
        count++;
      }
    }
    
    const pluralized = count == 1 ? 'CHIP' : 'CHIPS';
    this.events.emit(EventType.LOG, `FOUND ${count} MEM ${pluralized}.`);
  }
}

export {MemInfoAction};