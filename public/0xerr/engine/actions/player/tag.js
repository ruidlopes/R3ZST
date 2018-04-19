import {ChipScriptAction} from './lib/chipscript.js';
import {EventType} from '../../event/type.js';
import {TagComponent} from '../../components/tag.js';

class TagAction extends ChipScriptAction {
  constructor() {
    super();
    this.cycles = 1;
    this.limit = 6;
  }
  
  activeChip() {
    return this.activeChipWithComponents(TagComponent);
  }
  
  constraints(...tags) {
    if (!super.constraints()) {
      return false;
    }
    
    if (!tags.length) {
      this.events.emit(EventType.LOG, 'MISSING TAG(S).');
      return false;
    }
    
    return true;
  }
  
  start(...tags) {
    const component = this.activeChip().get(TagComponent);
    component.tags.clear();
    for (const tag of tags) {
      component.tags.add(tag);
    }
    
    const tagsStr = tags.join(', ');
    this.events.emit(EventType.LOG, `CHIP TAGGED WITH: ${tagsStr}.`);
  }
}

export {TagAction};