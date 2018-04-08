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
  
  terminalView() {
    return firstOf(this.manager.query()
        .filter(ViewComponent, view => view.type == ViewType.TERMINAL)
        .iterate(CompositeComponent, SpatialComponent));
  }
  
  resizeTerminalChildren() {
    const terminalView = this.terminalView();
    const terminalViewSpatial = terminalView.get(SpatialComponent);
    const ids = terminalView.get(CompositeComponent).ids;
    
    const textBufferSpatial = firstOf(this.manager.query(ids)
        .filter(TextBufferComponent)
        .iterate(SpatialComponent))
        .get(SpatialComponent);
    
    textBufferSpatial.x = terminalViewSpatial.x + 1;
    textBufferSpatial.y = Math.floor(terminalViewSpatial.y) + 1;
    textBufferSpatial.width = terminalViewSpatial.width - 2;
    textBufferSpatial.height = Math.floor(terminalViewSpatial.height) - 3;
    
    const textInputSpatial = firstOf(this.manager.query(ids)
        .filter(TextInputComponent)
        .iterate(SpatialComponent))
        .get(SpatialComponent);
    
    textInputSpatial.x = terminalViewSpatial.x + 1;
    textInputSpatial.y = Math.floor(terminalViewSpatial.y) +
        Math.floor(terminalViewSpatial.height) - 2;
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
          spatial.height = this.terminalView().get(SpatialComponent).y;
          break;
          
        case ViewType.TERMINAL:
          spatial.x = 0;
          spatial.width = this.viewport.screenWidth() - 25;
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