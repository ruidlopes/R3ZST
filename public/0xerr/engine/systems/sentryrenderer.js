import {ActiveComponent} from '../components/active.js';
import {ChipComponent} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {SentryComponent} from '../components/sentry.js';
import {SpatialComponent} from '../components/spatial.js';
import {StyleComponent} from '../components/style.js';
import {System} from '../system.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class SentryRendererSystem extends System {
  constructor(
      manager = ij(EntityManager),
      drawing = ij(Drawing)) {
    super();
    this.manager = manager;
    this.drawing = drawing;
  }
  
  activeNode() {
    return firstOf(this.manager.query()
        .filter(ActiveComponent, component => component.active)
        .filter(NodeComponent)
        .iterate(SpatialComponent, CompositeComponent));
  }
  
  activeNodeCompositeIds() {
    return this.activeNode().get(CompositeComponent).ids;
  }
  
  chips() {
    return this.manager.query(this.activeNodeCompositeIds())
        .filter(ChipComponent)
        .iterate(CompositeComponent, SpatialComponent);
  }
  
  sentries(chip) {
    return this.manager.query(chip.get(CompositeComponent).ids)
        .filter(SentryComponent)
        .iterate(SpatialComponent, StyleComponent);
  }
  
  frame(delta) {
    const nodeSpatial = this.activeNode().get(SpatialComponent);
    const draw = this.drawing.clipping(nodeSpatial);
    
    for (const chip of this.chips()) {
      const chipSpatial = chip.get(SpatialComponent);
      
      for (const sentry of this.sentries(chip)) {
        const spatial = sentry.get(SpatialComponent);
        const style = sentry.get(StyleComponent);
        const dx = Math.floor(nodeSpatial.x + chipSpatial.x + spatial.x);
        const dy = Math.floor(nodeSpatial.y + chipSpatial.y + spatial.y);

        draw.putCxel(dx, dy, 0x73, style.foregroundColor, style.backgroundColor);
      }
    }
  }
}

export {SentryRendererSystem};