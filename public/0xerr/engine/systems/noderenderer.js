import {SCREEN} from '../qualifiers.js';
import {ActiveComponent} from '../components/active.js';
import {CxelBuffer} from '../../renderer/cxel/buffer.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {StyleComponent} from '../components/style.js';
import {System} from '../system.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {box, BoxType} from '../../renderer/primitives/boxes.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';
import {rect} from '../../renderer/primitives/drawing.js';

class NodeRendererSystem extends System {
  constructor(
      manager = ij(EntityManager),
      screen = ij(CxelBuffer, SCREEN)) {
    super();
    this.manager = manager;
    this.screen = screen;
  }
  
  entity() {
    return firstOf(this.manager.query()
        .filter(NodeComponent)
        .filter(ActiveComponent, component => component.active)
        .first()
        .iterate(NodeComponent, SpatialComponent, StyleComponent));
  }
  
  hardwareViewSpatial() {
    return firstOf(this.manager.query()
        .filter(ViewComponent, component => component.type == ViewType.HARDWARE)
        .first()
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  frame(delta) {
    const hardwareViewSpatial = this.hardwareViewSpatial();
    const entity = this.entity();
    const node = entity.get(NodeComponent);
    const spatial = entity.get(SpatialComponent);
    const style = entity.get(StyleComponent);

    box(this.screen,
        spatial.x, spatial.y, spatial.width, spatial.height,
        BoxType.OUTER, style.foregroundColor, style.backgroundColor, hardwareViewSpatial);
    rect(this.screen,
        spatial.x + 1, spatial.y + 1, spatial.width - 2, spatial.height - 2,
        0x00, style.foregroundColor, style.backgroundColor, hardwareViewSpatial);
  }
}

export {NodeRendererSystem};