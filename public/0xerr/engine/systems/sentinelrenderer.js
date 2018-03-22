import {ActiveComponent} from '../components/active.js';
import {ChipComponent} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {SentinelComponent} from '../components/sentinel.js';
import {SpatialComponent} from '../components/spatial.js';
import {StyleComponent} from '../components/style.js';
import {System} from '../system.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class SentinelRendererSystem extends System {
  constructor(
      manager = ij(EntityManager),
      drawing = ij(Drawing)) {
    super();
    this.manager = manager;
    this.drawing = drawing;
  }
  
  activeNode() {
    return firstOf(this.manager.query()
        .filter(NodeComponent)
        .filter(ActiveComponent, component => component.active)
        .first()
        .iterate(SpatialComponent, CompositeComponent));
  }
  
  activeNodeCompositeIds() {
    return this.activeNode().get(CompositeComponent).ids;
  }
  
  chipsComposite() {
    return this.manager.query(this.activeNodeCompositeIds())
        .filter(ChipComponent)
        .iterate(CompositeComponent);
  }
  
  *sentinels() {
    for (const chip of this.chipsComposite()) {
      yield* this.manager.query(chip.ids)
          .filter(SentinelComponent)
          .iterate(SpatialComponent, StyleComponent);
    }
  }
  
  frame(delta) {
    const nodeSpatial = this.activeNode().get(SpatialComponent);
    const draw = this.drawing.clipping(nodeSpatial);
    
    for (const sentinel of this.sentinels()) {
      const spatial = sentinel.get(SpatialComponent);
      const style = sentinel.get(StyleComponent);
      const dx = Math.round(nodeSpatial.x + spatial.x);
      const dy = Math.round(nodeSpatial.y + spatial.y);
      
      draw.putCxel(dx, dy, 0x73, style.foregroundColor, style.backgroundColor);
    }
  }
}

export {SentinelRendererSystem};