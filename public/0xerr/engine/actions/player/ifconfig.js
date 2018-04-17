import {ActionRefreshEnum} from '../../action.js';
import {ChipComponent, ChipType, ChipNicVersion} from '../../components/chip.js';
import {ChipScriptAction} from './lib/chipscript.js';
import {EntityLib} from '../../entity/lib.js';
import {EntityManager} from '../../entity/manager.js';
import {EventManager} from '../../event/manager.js';
import {EventType} from '../../event/type.js';
import {IdentifiedComponent} from '../../components/identified.js';
import {IpComponent} from '../../components/ip.js';
import {enumLabel} from '../../../stdlib/collections.js';
import {ij} from '../../../injection/api.js';

class IfConfigAction extends ChipScriptAction {
  constructor(
      entities = ij(EntityManager),
      lib = ij(EntityLib),
      events = ij(EventManager)) {
    super(entities, events, ChipType.BIOS);
    this.lib = lib;
    
    this.cycles = 3;
    this.stealthCost = 1;
    this.limit = 1;
    this.refresh = ActionRefreshEnum.NODE;
  }
  
  activeNodeChips() {
    return this.lib.activeNodeChips().iterate(
        ChipComponent,
        IdentifiedComponent,
        IpComponent);
  }
  
  start() {
    let count = 0;
    for (const chip of this.activeNodeChips()) {
      if (chip.get(ChipComponent).type == ChipType.NIC) {
        chip.get(IdentifiedComponent).identified = true;
        count++;
        
        const ip = chip.get(IpComponent).ip;
        const version = enumLabel(ChipNicVersion, chip.get(ChipComponent).version);
        
        this.events.emit(EventType.LOG, ip.join('.'));
        this.events.emit(EventType.LOG, version);
        this.events.emit(EventType.LOG, ' ');
      }
    }
    
    const pluralized = count == 1 ? 'CHIP' : 'CHIPS';
    this.events.emit(EventType.LOG, `FOUND ${count} NIC ${pluralized}.`);
  }
}

export {IfConfigAction};