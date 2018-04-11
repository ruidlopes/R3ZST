import {ActiveComponent} from '../components/active.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {StealthComponent} from '../components/stealth.js';
import {System} from '../system.js';
import {VisitedComponent} from '../components/visited.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';
import {lerp} from '../../stdlib/math.js';

const MAX_FOV_DISTANCE = 5.5;
const MIN_FOV = 0.2;
const MAX_FOV = 1.0;

class PlayerVisitedSystem extends System {
  constructor(entities = ij(EntityManager)) {
    super();
    this.entities = entities;
  }
  
  activeNodeVisited() {
    return firstOf(this.entities.query()
        .filter(ActiveComponent, component => component.active)
        .filter(NodeComponent)
        .iterate(VisitedComponent))
        .get(VisitedComponent);
  }
  
  playerSpatial() {
    return this.entities.query()
        .head(StealthComponent, SpatialComponent)
        .get(SpatialComponent);
  }
  
  frame(delta) {
    const cells = this.activeNodeVisited().cells;
    const playerSpatial = this.playerSpatial();
    const playerX = playerSpatial.x;
    const playerY = playerSpatial.y;
    
    for (let y = 0; y < cells.length; ++y) {
      const row = cells[y];
      for (let x = 0; x < row.length; ++x) {
        const dx = x - playerX - 1;
        const dy = y - playerY - 1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (Math.floor(dx) == 0 && Math.floor(dy) == 0) {
          row[x] = MAX_FOV;
        } else if (distance > MAX_FOV_DISTANCE && row[x] != 0) {
          row[x] = MIN_FOV;
        } else if (distance <= MAX_FOV_DISTANCE) {
          const factor = distance / MAX_FOV_DISTANCE;
          row[x] = lerp(1.0 - factor, MIN_FOV, MAX_FOV);
        }
      }
    }
  }
}

export {PlayerVisitedSystem};