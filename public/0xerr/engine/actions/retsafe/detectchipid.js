import {Action} from '../../action.js';
import {ActiveComponent} from '../../components/active.js';
import {ChipComponent} from '../../components/chip.js';
import {CompositeComponent} from '../../components/composite.js';
import {EntityManager} from '../../entity/manager.js';
import {EventManager} from '../../event/manager.js';
import {EventType} from '../../event/type.js';
import {NodeComponent} from '../../components/node.js';
import {SentryComponent, SentryCapabilities} from '../../components/sentry.js';
import {StealthComponent, STEALTH_MAX} from '../../components/stealth.js';
import {TurnActionsComponent} from '../../components/turnactions.js';
import {firstOf} from '../../../stdlib/collections.js';
import {ij} from '../../../injection/api.js';

class DetectChipIdAction extends Action {
  constructor(
      manager = ij(EntityManager),
      events = ij(EventManager)) {
    super();
    this.manager = manager;
    this.events = events;
  }
  
  activeNodeCompositeIds() {
    return firstOf(this.manager.query()
        .filter(ActiveComponent, component => component.active)
        .filter(NodeComponent)
        .iterate(CompositeComponent))
        .get(CompositeComponent).ids;
  }
  
  chips() {
    return this.manager.query(this.activeNodeCompositeIds())
        .filter(ChipComponent)
        .iterate(ChipComponent, CompositeComponent);
  }
  
  turnActionsComponent() {
    return this.manager.query()
        .head(TurnActionsComponent)
        .get(TurnActionsComponent);
  }
  
  stealthComponent() {
    return this.manager.query()
        .head(StealthComponent)
        .get(StealthComponent);
  }
  
  start() {
    const turnActions = this.turnActionsComponent();
    
    for (const chip of this.chips()) {
      const chipActions = turnActions.chipActions.get(chip.id);
      if (!chipActions) {
        continue;
      }
      
      const chipIdActions = chipActions.filter(params => params[0] == 'CHIPID');
      const chipIdActionsCount = chipIdActions.length;
      if (!chipIdActionsCount) {
        continue;
      }
      
      const sentryCount = this.manager.query(chip.get(CompositeComponent).ids)
          .filter(SentryComponent, sentry => sentry.capabilities.has(SentryCapabilities.CHIPID))
          .count();
      if (!sentryCount) {
        continue;
      }
      
      const hitPoints = sentryCount * chipIdActionsCount;
      if (hitPoints > 0) {
        this.events.emit(
            EventType.LOG, `DETECTED ${chipIdActionsCount} CHIPID ACTION(S).`);
        this.events.emit(EventType.STEALTH_UPDATE, -hitPoints);
      }
    }
  }
}

export {DetectChipIdAction};