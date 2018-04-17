import {ActiveComponent} from '../components/active.js';
import {ChipComponent} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {EntityLib} from '../entity/lib.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {SentryComponent} from '../components/sentry.js';
import {SpatialComponent} from '../components/spatial.js';
import {StealthComponent} from '../components/stealth.js';
import {System} from '../system.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class PlayerSentryBoundsSystem extends System {
  constructor(
      entities = ij(EntityManager),
      lib = ij(EntityLib),
      events = ij(EventManager)) {
    super();
    this.entities = entities;
    this.lib = lib;
    this.events = events;
  }
  
  activeChip() {
    return firstOf(this.entities.query()
        .filter(ActiveComponent, component => component.active)
        .filter(ChipComponent)
        .iterate(CompositeComponent));
  }
  
  activeSentry() {
    return firstOf(this.entities.query()
        .filter(ActiveComponent, component => component.active)
        .filter(SentryComponent)
        .iterate(ActiveComponent));
  }
  
  sentries(ids) {
    return this.entities.query(ids)
        .iterate(ActiveComponent, SpatialComponent);
  }
  
  playerSpatial() {
    return this.entities.query()
        .head(StealthComponent, SpatialComponent)
        .get(SpatialComponent);
  }
  
  frame(delta) {
    const activeChip = this.activeChip();
    if (!activeChip) {
      return;
    }
    
    const sentryIds = activeChip.get(CompositeComponent).ids;
    
    const activeSentry = this.activeSentry();
    if (activeSentry) {
      activeSentry.get(ActiveComponent).active = false;
    }
    
    const playerSpatial = this.playerSpatial();
    const px = Math.floor(playerSpatial.x);
    const py = Math.floor(playerSpatial.y);
    
    for (const sentry of this.sentries(sentryIds)) {
      const sentrySpatial = sentry.get(SpatialComponent);
      const sentryActive = sentry.get(ActiveComponent);
      sentryActive.active = px == sentrySpatial.x && py == sentrySpatial.y;
    }
  }
}

export {PlayerSentryBoundsSystem};