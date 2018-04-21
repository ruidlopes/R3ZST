import {ChipScriptAction} from './lib/chipscript.js';
import {EventType} from '../../event/type.js';
import {TagComponent} from '../../components/tag.js';

class UntagAction extends ChipScriptAction {
  constructor() {
    super();
    this.cycles = 1;
    this.limit = 6;
    
    this.man = [
      'USAGE: UNTAG',
      'REMOVES ALL TAGS FROM CURRENT CHIP.',
    ];
  }
  
  activeChip() {
    return this.activeChipWithComponents(TagComponent);
  }
  
  start(...tags) {
    this.context().get(TagComponent).tags.clear();
    this.events.emit(EventType.LOG, `CHIP UNTAGGED.`);
  }
}

export {UntagAction};