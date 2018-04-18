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
    for (const tag of tags) {
      if (!component.tags.has(tag)) {
        component.tags.add(tag);
      }
    }
    
    const allTags = [];
    for (const tag of component.tags) {
      allTags.push(tag);
    }
    const tagsStr = allTags.join(', ');
    
    this.events.emit(EventType.LOG, `CHIP TAGGED WITH: ${tagsStr}.`);
  }
}

export {TagAction};