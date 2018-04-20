import {Action, ActionType, ActionRefreshEnum} from '../../action.js';
import {ChipComponent, ChipType} from '../../components/chip.js';
import {EntityLib} from '../../entity/lib.js';
import {EntityManager} from '../../entity/manager.js';
import {EventManager} from '../../event/manager.js';
import {EventType} from '../../event/type.js';
import {IdentifiedComponent} from '../../components/identified.js';
import {ij} from '../../../injection/api.js';
import {setOf} from '../../../stdlib/collections.js';

class TraceBiosAction extends Action {
  constructor(
      entities = ij(EntityManager),
      lib = ij(EntityLib),
      events = ij(EventManager)) {
    super();
    this.entities = entities;
    this.lib = lib;
    this.events = events;
    
    this.cycles = 4;
    this.stealthCost = 2;
    this.limit = 1;
    this.refresh = ActionRefreshEnum.NODE;
        
    this.types = setOf(ActionType.GLOBAL);
    this.man = [
      'USAGE: TRACEBIOS',
      'FINDS AND IDENTIFIES ALL BIOS CHIPS IN CURRENT NODE.',
    ];
  }
  
  start() {
    const activeNodeChips = this.lib.activeNodeChips().iterate(ChipComponent, IdentifiedComponent);
    let count = 0;
    for (const chip of activeNodeChips) {
      if (chip.get(ChipComponent).type == ChipType.BIOS) {
        chip.get(IdentifiedComponent).identified = true;
        count++;
      }
    }
    
    const pluralized = count == 1 ? 'CHIP' : 'CHIPS';
    this.events.emit(EventType.LOG, `FOUND ${count} BIOS ${pluralized}.`);
  }
}

export {TraceBiosAction};