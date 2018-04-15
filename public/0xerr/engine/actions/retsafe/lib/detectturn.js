import {Action} from '../../../action.js';
import {CompositeComponent} from '../../../components/composite.js';
import {EntityLib} from '../../../entity/lib.js';
import {EntityManager} from '../../../entity/manager.js';
import {EventManager} from '../../../event/manager.js';
import {EventType} from '../../../event/type.js';
import {SentryComponent, SentryCapabilities, SentryState} from '../../../components/sentry.js';
import {TurnActionsComponent} from '../../../components/turnactions.js';
import {firstOf} from '../../../../stdlib/collections.js';
import {ij} from '../../../../injection/api.js';

class DetectTurnAction extends Action {
  constructor(
      actionName,
      capability,
      entities = ij(EntityManager),
      lib = ij(EntityLib),
      events = ij(EventManager)) {
    super();
    
    this.actionName = actionName;
    this.capability = capability;
    
    this.entities = entities;
    this.lib = lib;
    this.events = events;
  }
  
  chips() {
    return this.lib.activeNodeChips().iterate(CompositeComponent);
  }
  
  turnActionsComponent() {
    return this.entities.query()
        .head(TurnActionsComponent)
        .get(TurnActionsComponent);
  }
  
  start() {
    const turnActions = this.turnActionsComponent();
    
    for (const chip of this.chips()) {
      const chipActions = turnActions.chipActions.get(chip.id);
      if (!chipActions) {
        continue;
      }
      
      const filteredActions = chipActions.filter(params => params[0] == this.actionName);
      const filteredActionsCount = filteredActions.length;
      if (!filteredActions) {
        continue;
      }
      
      const sentryCount = this.entities.query(chip.get(CompositeComponent).ids)
          .filter(SentryComponent,
                  sentry => sentry.capabilities.has(this.capability) &&
                            sentry.state == SentryState.ACTIVE)
          .count();
      if (!sentryCount) {
        continue;
      }
      
      const hitPoints = sentryCount * filteredActionsCount;
      if (hitPoints > 0) {
        const pluralized = filteredActionsCount > 1 ? 'ACTIONS' : 'ACTION';
        this.events.emit(
            EventType.LOG, `DETECTED ${filteredActionsCount} ${this.actionName} ${pluralized}.`);
        this.events.emit(EventType.STEALTH_UPDATE, -hitPoints);
      }
    }
  }
}

export {DetectTurnAction};