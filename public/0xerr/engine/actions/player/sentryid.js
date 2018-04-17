import {ActiveComponent} from '../../components/active.js';
import {EventType} from '../../event/type.js';
import {IdentifiedComponent} from '../../components/identified.js';
import {SentryComponent, SentryCapabilities} from '../../components/sentry.js';
import {SentryScriptAction} from './lib/sentryscript.js';
import {enumLabel} from '../../../stdlib/collections.js';

class SentryIdAction extends SentryScriptAction {
  constructor() {
    super();
    this.cycles = 1;
    this.limit = 7;
  }
  
  constraints() {
    const activeSentry = this.activeSentry();
    if (!activeSentry || !activeSentry.get(ActiveComponent).active) {
      this.events.emit(EventType.LOG, 'NO SENTRY IN RANGE.');
      return false;
    }
    return true;
  }
  
  start() {
    const activeSentry = this.activeSentry();
    activeSentry.get(IdentifiedComponent).identified = true;
    
    const caps = activeSentry.get(SentryComponent).capabilities;
    let capsStr = '';
    for (const cap of caps) {
      if (capsStr.length) {
        capsStr += ', ';
      }
      capsStr += enumLabel(SentryCapabilities, cap);
    }
    
    this.events.emit(EventType.LOG, `IDENTIFIED SENTRY: ${capsStr}`); 
  }
}

export {SentryIdAction};