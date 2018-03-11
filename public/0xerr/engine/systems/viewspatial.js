import {EntityManager} from '../entity/manager.js';
import {SpatialComponent} from '../components/spatial.js';
import {System} from '../system.js';
import {Viewport} from '../../observers/viewport.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {ij} from '../../injection/api.js';

class ViewSpatialSystem extends System {
  constructor(
      manager = ij(EntityManager),
      viewport = ij(Viewport)) {
    super();
    this.manager = manager;
    this.viewport = viewport;
  }
  
  entities() {
    return this.manager.query()
        .filter(ViewComponent)
        .iterate(SpatialComponent, ViewComponent);
  }
  
  frame(delta) {
    for (const entity of this.entities()) {
      const spatial = entity.get(SpatialComponent);
      switch (entity.get(ViewComponent).type) {
        case ViewType.HARDWARE:
          spatial.x = 0;
          spatial.y = 0;
          spatial.width = this.viewport.screenWidth() - 25;
          spatial.height = this.viewport.screenHeight() - 20;
          break;
        case ViewType.TERMINAL:
          spatial.x = 0;
          spatial.y = this.viewport.screenHeight() - 20;
          spatial.width = this.viewport.screenWidth() - 24;
          spatial.height = 20;
          break;
        case ViewType.STATUS:
          spatial.x = this.viewport.screenWidth() - 25;
          spatial.y = 0;
          spatial.width = 25;
          spatial.height = this.viewport.screenHeight();
          break;
      }
    }
  }
}

export {ViewSpatialSystem};