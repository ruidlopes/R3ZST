import {ActiveComponent} from '../components/active.js';
import {ChipComponent} from '../components/chip.js';
import {EntityLib} from '../entity/lib.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {SpatialComponent} from '../components/spatial.js';
import {StealthComponent} from '../components/stealth.js';
import {System} from '../system.js';
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
  
  chips() {
    return this.lib.activeNodeChips()
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