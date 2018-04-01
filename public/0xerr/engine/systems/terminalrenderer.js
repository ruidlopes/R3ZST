import {BLACK, BLUE_BRIGHT, BLUE_FADED} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {BoxType} from '../../renderer/primitives/boxes.js';
import {CompositeComponent} from '../components/composite.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {SpatialComponent} from '../components/spatial.js';
import {System} from '../system.js';
import {TextBufferComponent} from '../components/textbuffer.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class TerminalRendererSystem extends System {
  constructor(
      manager = ij(EntityManager),
      drawing = ij(Drawing)) {
    super();
    this.manager = manager;
    this.drawing = drawing;
  }
  
  terminalView() {
    return firstOf(this.manager.query()
        .filter(ViewComponent, view => view.type == ViewType.TERMINAL)
        .first()
        .iterate(CompositeComponent, SpatialComponent, ActiveComponent));
  }
  
  terminalViewChildren() {
    return this.terminalView().get(CompositeComponent).ids;
  }
  
  textBuffer() {
    return firstOf(this.manager.query(this.terminalViewChildren())
        .filter(TextBufferComponent)
        .first()
        .iterate(TextBufferComponent, SpatialComponent));
  }
  
  renderFrame(delta) {
    const terminalView = this.terminalView();
    const spatial = terminalView.get(SpatialComponent);
    const foreground = terminalView.get(ActiveComponent).active ?
        BLUE_BRIGHT :
        BLUE_FADED;
    
    const x = Math.floor(spatial.x);
    const y = Math.floor(spatial.y);
    const width = Math.floor(spatial.width);
    const height = Math.floor(spatial.height);
    
    this.drawing.absolute()
        .box(x, y, width, height, BoxType.SINGLE, foreground, BLACK)
        .rect(x + 1, y + 1, width - 2, height - 2, 0x00, foreground, BLACK)
        .sprint('TERMINAL', x + 2, y, foreground, BLACK);
  }
  
  renderTextBuffer(delta) {
    const textBuffer = this.textBuffer();
    const textBufferSpatial = textBuffer.get(SpatialComponent);
    const textBufferLines = textBuffer.get(TextBufferComponent).buffer;
    const textBufferDraw = this.drawing.clipping(textBufferSpatial);
    
    let cursor = textBufferLines.length - 1;
    for (let yy = textBufferSpatial.height - 1;
         yy >= 0 && cursor >= 0;) {
      const line = textBufferLines[cursor];
      const lineHeight = Math.ceil(line.length / textBufferSpatial.width);
      
      for (let lineY = 0; lineY < lineHeight; ++lineY) {
        const y = textBufferSpatial.y + yy + lineY - lineHeight + 1;
        const text = line.substr(
            lineY * textBufferSpatial.width,
            textBufferSpatial.width);
        textBufferDraw.sprint(text, textBufferSpatial.x, y, BLUE_BRIGHT, BLACK);
      }
      
      yy -= lineHeight;
      cursor--;
    }
  }
  
  frame(delta) {
    this.renderFrame(delta);
    this.renderTextBuffer(delta);
  }
}

export {TerminalRendererSystem};