import {ActionRefreshEnum} from '../../action.js';
import {ChipScriptAction} from './lib/chipscript.js';
import {CompositeComponent} from '../../components/composite.js';
import {EventType} from '../../event/type.js';
import {IdentifiedComponent} from '../../components/identified.js';

class TraceSentriesAction extends ChipScriptAction {
  constructor() {
    super();
    
    this.cycles = 2;
    this.stealthCost = 1;
    this.limit = 3;
    this.refresh = ActionRefreshEnum.NODE;
    
    this.man = [
      'USAGE: TRACESENTRIES',
      'FINDS AND IDENTIFIES ALL SENTRIES IN CURRENT CHIP.',
    ];
  }
  
  activeChip() {
    return this.activeChipWithComponents(CompositeComponent);
  }
  
  start() {
    const activeChip = this.context();
    const sentryIds = activeChip.get(CompositeComponent).ids;
    const sentries = this.entities.query(sentryIds)
        .iterate(IdentifiedComponent);
    
    let count = 0;
    for (const sentry of sentries) {
      sentry.get(IdentifiedComponent).identified = true;
      count++;
    }
    
    const pluralized = count == 1 ? 'SENTRY' : 'SENTRIES';
    this.events.emit(EventType.LOG, `FOUND ${count} ${pluralized}.`);
  }
}

export {TraceSentriesAction};