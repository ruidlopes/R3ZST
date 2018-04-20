import {Action, ActionType} from '../../../action.js';
import {ActiveComponent} from '../../../components/active.js';
import {EntityManager} from '../../../entity/manager.js';
import {EventManager} from '../../../event/manager.js';
import {EventType} from '../../../event/type.js';
import {IdentifiedComponent} from '../../../components/identified.js';
import {SentryComponent} from '../../../components/sentry.js';
import {firstOf, setOf} from '../../../../stdlib/collections.js';
import {ij} from '../../../../injection/api.js';

class SentryScriptAction extends Action {
  constructor(
      entities = ij(EntityManager),
      events = ij(EventManager)) {
    super();
    this.types = setOf(ActionType.SENTRY);
    
    this.entities = entities;
    this.events = events;
  }
  
  activeSentry() {
    return firstOf(this.entities.query()
        .filter(ActiveComponent, component => component.active)
        .filter(SentryComponent)
        .iterate(SentryComponent, ActiveComponent, IdentifiedComponent));
  }
  
  constraints() {
    const activeSentry = this.activeSentry();
    if (!activeSentry) {
      this.events.emit(EventType.LOG, 'NO SENTRY IN RANGE.');
      return false;
    }
    
    if (!activeSentry.get(IdentifiedComponent).identified) {
      this.events.emit(EventType.LOG, 'UNIDENTIFIED SENTRY.');
      return false;
    }
    
    return true;
  }
}

export {SentryScriptAction};