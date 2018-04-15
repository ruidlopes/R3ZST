import {BLUE_FADED2} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {Drawing} from '../common/drawing.js';
import {EntityLib} from '../entity/lib.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {StyleComponent} from '../components/style.js';
import {System} from '../system.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {BoxType} from '../../renderer/primitives/boxes.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class NodeRendererSystem extends System {
  constructor(
      entities = ij(EntityManager),
      lib = ij(EntityLib),
      drawing = ij(Drawing)) {
    super();
    this.entities = entities;
    this.lib = lib;
    this.drawing = drawing;
  }
  
  activeNode() {
    return firstOf(this.lib.activeNode().iterate(
        NodeComponent,
        SpatialComponent,
        StyleComponent));
  }
  
  hardwareViewSpatial() {
    return firstOf(this.entities.query()
        .filter(ViewComponent, component => component.type == ViewType.HARDWARE)
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  frame(delta) {
    const activeNode = this.activeNode();
    const node = activeNode.get(NodeComponent);
    const spatial = activeNode.get(SpatialComponent);
    const style = activeNode.get(StyleComponent);

    this.drawing.clipping(this.hardwareViewSpatial())
        .box(Math.floor(spatial.x) - 1, Math.floor(spatial.y) - 1,
            spatial.width + 2, spatial.height + 2,
            BoxType.SINGLE, style.foregroundColor, style.backgroundColor)
        .rect(Math.floor(spatial.x), Math.floor(spatial.y),
            spatial.width, spatial.height,
            0x0d, BLUE_FADED2, style.backgroundColor);
  }
}

export {NodeRendererSystem};