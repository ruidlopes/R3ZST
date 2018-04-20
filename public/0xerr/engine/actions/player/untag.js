import {ChipScriptAction} from './lib/chipscript.js';
import {EventType} from '../../event/type.js';
import {TagComponent} from '../../components/tag.js';

class UntagAction extends ChipScriptAction {
  constructor() {
    super();
    this.cycles = 1;
    this.limit = 6;
  }
  
  activeChip() {
    return this.activeChipWithComponents(TagComponent);
  }
  
  start(...tags) {
    this.activeChip().get(TagComponent).tags.clear();
    this.events.emit(EventType.LOG, `CHIP UNTAGGED.`);
  }
}

export {UntagAction};