import {WHITE} from '../common/palette.js';
import {ChipComponent} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {Drawing} from '../common/drawing.js';
import {EntityLib} from '../entity/lib.js';
import {EntityManager} from '../entity/manager.js';
import {IdentifiedComponent} from '../components/identified.js';
import {NodeComponent} from '../components/node.js';
import {SentryComponent} from '../components/sentry.js';
import {SpatialComponent} from '../components/spatial.js';
import {StyleComponent} from '../components/style.js';
import {System} from '../system.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class SentryRendererSystem extends System {
  constructor(
      entities = ij(EntityManager),
      lib = ij(EntityLib),
      drawing = ij(Drawing)) {
    super();
    this.entities = entities;
    this.lib = lib;
    this.drawing = drawing;
  }
  
  activeNodeSpatial() {
    return firstOf(this.lib.activeNode().iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  chips() {
    return this.lib.activeNodeChips().iterate(CompositeComponent, IdentifiedComponent);
  }
  
  sentries(chip) {
    return this.entities.query(chip.get(CompositeComponent).ids)
        .filter(SentryComponent)
        .iterate(IdentifiedComponent, SpatialComponent, StyleComponent);
  }
  
  frame(delta) {
    const nodeSpatial = this.activeNodeSpatial();
    const draw = this.drawing.clipping(nodeSpatial);
    
    for (const chip of this.chips()) {
      if (!chip.get(IdentifiedComponent).identified) {
        continue;
      }
      
      for (const sentry of this.sentries(chip)) {
        const spatial = sentry.get(SpatialComponent);
        const style = sentry.get(StyleComponent);
        const dx = Math.floor(nodeSpatial.x + spatial.x);
        const dy = Math.floor(nodeSpatial.y + spatial.y);

        const identified = sentry.get(IdentifiedComponent).identified;
        const foregroundColor = identified ? WHITE : style.foregroundColor;
        
        draw.putCxel(dx, dy, 0x73, foregroundColor, style.backgroundColor);
      }
    }
  }
}

export {SentryRendererSystem};