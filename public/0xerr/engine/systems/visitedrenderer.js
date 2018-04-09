import {BLACK, BLUE_FADED2} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {SpatialComponent} from '../components/spatial.js';
import {System} from '../system.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {VisitedComponent} from '../components/visited.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class VisitedRendererSystem extends System {
  constructor(
      entities = ij(EntityManager),
      drawing = ij(Drawing)) {
    super();
    this.entities = entities;
    this.buffer = drawing.buffer();
  }
  
  hardwareView() {
    return firstOf(this.entities.query()
        .filter(ViewComponent, view => view.type == ViewType.HARDWARE)
        .iterate(ActiveComponent, SpatialComponent));
  }
  
  activeNode() {
    return firstOf(this.entities.query()
        .filter(NodeComponent)
        .filter(ActiveComponent, component => component.active)
        .iterate(SpatialComponent, VisitedComponent));
  }
  
  frame(delta) {
    const hardwareView = this.hardwareView();
    const hardwareActive = hardwareView.get(ActiveComponent).active;
    const hardwareSpatial = hardwareView.get(SpatialComponent);
    const hardwareX = hardwareSpatial.x;
    const hardwareY = hardwareSpatial.y;
    
    const activeNode = this.activeNode();
    const spatial = activeNode.get(SpatialComponent);
    const visited = activeNode.get(VisitedComponent).cells;
    
    for (let y = 0; y < spatial.height + 2; ++y) {
      for (let x = 0; x < spatial.width + 2; ++x) {
        const xx = Math.floor(spatial.x) + x - 1;
        const yy = Math.floor(spatial.y) + y - 1;
        
        if (xx < hardwareX || xx >= hardwareX + hardwareSpatial.width ||
            yy < hardwareY || yy >= hardwareY + hardwareSpatial.height) {
          continue;
        }
        
        const foregroundOffset = this.buffer.foreground.offset(xx, yy);
        const backgroundOffset = this.buffer.background.offset(xx, yy);
        const charsOffset = this.buffer.chars.offset(xx, yy);
        
        const visitedValue = visited[y][x];
        if (visitedValue == 0) {
          this.buffer.foreground.data.set(BLUE_FADED2.data, foregroundOffset);
          this.buffer.background.data.set(BLACK.data, backgroundOffset);
          this.buffer.chars.data[charsOffset] = hardwareActive ? 0xef : 0x00;
        } else {
          this.buffer.foreground.data[foregroundOffset] *= visitedValue;
          this.buffer.foreground.data[foregroundOffset + 1] *= visitedValue;
          this.buffer.foreground.data[foregroundOffset + 2] *= visitedValue;
          
          this.buffer.background.data[backgroundOffset] *= visitedValue;
          this.buffer.background.data[backgroundOffset + 1] *= visitedValue;
          this.buffer.background.data[backgroundOffset + 2] *= visitedValue;
        }
      }
    }
  }
}

export {VisitedRendererSystem};