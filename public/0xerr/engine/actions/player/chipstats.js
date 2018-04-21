import {ChipComponent, ChipType} from '../../components/chip.js';
import {ChipScriptAction} from './lib/chipscript.js';
import {EventType} from '../../event/type.js';
import {IpComponent} from '../../components/ip.js';
import {TagComponent} from '../../components/tag.js';
import {enumLabel} from '../../../stdlib/collections.js';

class ChipStatsAction extends ChipScriptAction {
  constructor() {
    super();
    
    this.man = [
      'USAGE: CHIPSTATS',
      'LOGS STATS OF THE CURRENT CHIP.'
    ];
  }
  
  activeChip() {
    return this.activeChipWithComponents(
        IpComponent,
        TagComponent
    );
  }
  
  start() {
    const chip = this.context();
    const tags = chip.get(TagComponent).tags;
    
    const type = enumLabel(ChipType, chip.get(ChipComponent).type);
    this.events.emit(EventType.LOG, `CHIP: ${type}`);
    
    let tagsStr = '';
    for (const tag of tags) {
      if (tagsStr.length) {
        tagsStr += ', ';
      }
      tagsStr += tag;
    }
    
    if (tags.length) {
      this.events.emit(EventType.LOG, `TAGS: ${tagsStr}`);
    } else {
      this.events.emit(EventType.LOG, 'NO TAGS');
    }
  }
}

export {ChipStatsAction};