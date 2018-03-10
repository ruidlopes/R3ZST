import {ActiveComponent} from '../components/active.js';
import {NodeComponent} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {StyleComponent} from '../components/style.js';
import {System} from '../system.js';
import {box, BoxType} from '../../renderer/primitives/boxes.js';
import {rect} from '../../renderer/primitives/drawing.js';

class NodeRendererSystem extends System {
  constructor(manager, screen) {
    super();
    this.manager = manager;
    this.screen = screen;
  }
  
  entities() {
    return this.manager.query()
        .filter(NodeComponent)
        .filter(ActiveComponent, component => component.active)
        .iterate(NodeComponent, SpatialComponent, StyleComponent);
  }
  
  frameEntity(entity, delta) {
    const node = entity.get(NodeComponent);
    const spatial = entity.get(SpatialComponent);
    const style = entity.get(StyleComponent);

    box(this.screen,
        spatial.x, spatial.y, spatial.width, spatial.height,
        BoxType.OUTER, style.foregroundColor, style.backgroundColor);
    rect(this.screen,
        spatial.x + 1, spatial.y + 1, spatial.width - 2, spatial.height - 2,
        0x00, style.foregroundColor, style.backgroundColor);
  }
}

export {NodeRendererSystem};