import {CompositeComponent} from '../components/composite.js';
import {EntityManager} from '../entity/manager.js';
import {SpatialComponent} from '../components/spatial.js';
import {System} from '../system.js';
import {TextBufferComponent} from '../components/textbuffer.js';
import {TextInputComponent} from '../components/textinput.js';
import {Viewport} from '../../observers/viewport.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class ViewSpatialSystem extends System {
  constructor(
      manager = ij(EntityManager),
      viewport = ij(Viewport)) {
    super();
    this.manager = manager;
    this.viewport = viewport;
  }
  
  views() {
    return this.manager.query()
        .filter(ViewComponent)
        .iterate(SpatialComponent, ViewComponent);
  }
  
  resizeTerminalChildren() {
    const terminalView = firstOf(this.manager.query()
        .filter(ViewComponent, view => view.type == ViewType.TERMINAL)
        .first()
        .iterate(CompositeComponent, SpatialComponent));
    
    const terminalViewSpatial = terminalView.get(SpatialComponent);
    const ids = terminalView.get(CompositeComponent).ids;
    
    const textBufferSpatial = firstOf(this.manager.query(ids)
        .filter(TextBufferComponent)
        .first()
        .iterate(SpatialComponent))
        .get(SpatialComponent);
    
    textBufferSpatial.x = terminalViewSpatial.x + 1;
    textBufferSpatial.y = terminalViewSpatial.y + 1;
    textBufferSpatial.width = terminalViewSpatial.width - 2;
    textBufferSpatial.height = terminalViewSpatial.height - 4;
    
    const textInputSpatial = firstOf(this.manager.query(ids)
        .filter(TextInputComponent)
        .first()
        .iterate(SpatialComponent))
        .get(SpatialComponent);
    
    textInputSpatial.x = terminalViewSpatial.x + 1;
    textInputSpatial.y = terminalViewSpatial.y + terminalViewSpatial.height - 3;
    textInputSpatial.width = terminalViewSpatial.width - 2;
    textInputSpatial.height = 1;
  }
  
  frame(delta) {
    for (const view of this.views()) {
      const spatial = view.get(SpatialComponent);
      switch (view.get(ViewComponent).type) {
        case ViewType.HARDWARE:
          spatial.x = 0;
          spatial.y = 0;
          spatial.width = this.viewport.screenWidth() - 25;
          spatial.height = this.viewport.screenHeight() - 20;
          break;
          
        case ViewType.TERMINAL:
          spatial.x = 0;
          spatial.y = this.viewport.screenHeight() - 20;
          spatial.width = this.viewport.screenWidth() - 25;
          spatial.height = 20;
          this.resizeTerminalChildren();
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