import {ActiveComponent} from '../components/active.js';
import {NodeComponent} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {StyleComponent} from '../components/style.js';
import {box, BoxType} from '../../renderer/primitives/boxes.js';

class NodeRendererSystem {
  constructor(manager, screen) {
    this.manager = manager;
    this.screen = screen;
  }
  
  entities() {
    return this.manager.query()
        .filter(ActiveComponent, component => component.active)
        .collect(NodeComponent, SpatialComponent, StyleComponent);
  }
  
  frame(delta) {
    for (const entity of this.entities()) {
    }
  }
}

export {NodeRendererSystem};