import {ActiveComponent} from '../components/active.js';
import {ChipComponent} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {EntityLib} from '../entity/lib.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {NodeComponent} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {StealthComponent} from '../components/stealth.js';
import {System} from '../system.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class PlayerChipBoundsSystem extends System {
  constructor(
      entities = ij(EntityManager),
      lib = ij(EntityLib),
      events = ij(EventManager)) {
    super();
    this.entities = entities;
    this.lib = lib;
    this.events = events;
  }
  
  activeNode() {
    return firstOf(this.lib.activeNode().iterate(SpatialComponent, CompositeComponent));
  }
  
  activeNodeCompositeIds() {
    return this.activeNode().get(CompositeComponent).ids;
  }
  
  chips() {
    return this.entities.query(this.activeNodeCompositeIds())
        .filter(ChipComponent)
        .iterate(ChipComponent, SpatialComponent, ActiveComponent);
  }
  
  playerSpatial() {
    return this.entities.query()
        .head(StealthComponent, SpatialComponent)
        .get(SpatialComponent);
  }
  
  frame(delta) {
    const playerSpatial = this.playerSpatial();
    const px = playerSpatial.x;
    const py = playerSpatial.y;
    
    for (const chip of this.chips()) {
      const chipSpatial = chip.get(SpatialComponent);
      const chipActive = chip.get(ActiveComponent);
      if (px >= chipSpatial.x &&
          px < chipSpatial.x + chipSpatial.width &&
          py >= chipSpatial.y &&
          py < chipSpatial.y + chipSpatial.height) {
        chipActive.active = true;
      } else {
        chipActive.active = false;
      }
    }
  }
}

export {PlayerChipBoundsSystem};