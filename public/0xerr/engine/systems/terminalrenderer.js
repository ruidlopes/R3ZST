import {BLACK, BLUE_BRIGHT, BLUE_FADED} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {BoxType} from '../../renderer/primitives/boxes.js';
import {CompositeComponent} from '../components/composite.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {SpatialComponent} from '../components/spatial.js';
import {System} from '../system.js';
import {TextBufferComponent} from '../components/textbuffer.js';
import {TextInputComponent} from '../components/textinput.js';
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
  
  textInput() {
    return firstOf(this.manager.query(this.terminalViewChildren())
        .filter(TextInputComponent)
        .first()
        .iterate(TextInputComponent, SpatialComponent));
  }
  
  renderFrame(delta) {
    const terminalView = this.terminalView();
    const spatial = terminalView.get(SpatialComponent);
    const foreground = terminalView.get(ActiveComponent).active ?
        BLUE_BRIGHT :
        BLUE_FADED;
    
    this.drawing.absolute()
        .box(spatial.x, spatial.y, spatial.width, spatial.height,
            BoxType.SINGLE, foreground, BLACK)
        .rect(spatial.x + 1, spatial.y + 1, spatial.width - 2, spatial.height - 2,
            0x00, foreground, BLACK)
        .sprint('TERMINAL', spatial.x + 2, spatial.y, foreground, BLACK);
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
  
  renderTextInput(delta) {
    const input = this.textInput();
    const textInput = input.get(TextInputComponent);
    const textInputSpatial = input.get(SpatialComponent);
    
    const maxInputWidth = textInputSpatial.width - 2;
    
    const inputStart = Math.max(textInput.cursor - maxInputWidth, 0);
    const text = textInput.text.substr(inputStart, maxInputWidth);
    
    const cursorX = textInput.cursor - inputStart; 
    
    this.drawing.clipping(textInputSpatial)
        .sprint('>', textInputSpatial.x, textInputSpatial.y, BLUE_BRIGHT, BLACK)
        .sprint(text, textInputSpatial.x + 1, textInputSpatial.y, BLUE_BRIGHT, BLACK)
        .sprint(text[cursorX] || ' ',
            textInputSpatial.x + 1 + cursorX, textInputSpatial.y,
            BLACK, BLUE_BRIGHT);
  }
  
  frame(delta) {
    this.renderFrame(delta);
    this.renderTextBuffer(delta);
    this.renderTextInput(delta);
  }
}

export {TerminalRendererSystem};