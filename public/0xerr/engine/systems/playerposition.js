import {ActiveComponent} from '../components/active.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {StealthComponent} from '../components/stealth.js';
import {System} from '../system.js';
import {VelocityComponent} from '../components/velocity.js';
import {clamp} from '../../stdlib/math.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';


class PlayerPositionSystem extends System {
  constructor(manager = ij(EntityManager)) {
    super();
    this.manager = manager;
  }
  
  activeNodeSpatial() {
    return firstOf(this.manager.query()
        .filter(NodeComponent)
        .filter(ActiveComponent, component => component.active)
        .first()
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  player() {
    return firstOf(this.manager.query()
        .filter(StealthComponent)
        .first()
        .iterate(SpatialComponent, VelocityComponent));
  }
  
  frame(delta) {
    const player = this.player();
    const playerSpatial = player.get(SpatialComponent);
    const playerVelocity = player.get(VelocityComponent);
    
    const activeNodeSpatial = this.activeNodeSpatial();

    playerSpatial.x = clamp(
        playerSpatial.x + playerVelocity.vx, 0, activeNodeSpatial.width - 1);
    playerSpatial.y = clamp(
        playerSpatial.y + playerVelocity.vy, 0, activeNodeSpatial.height - 1);
  }
}

export {PlayerPositionSystem};