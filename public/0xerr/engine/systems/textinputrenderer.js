import {BLACK, BLUE_BRIGHT} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {SpatialComponent} from '../components/spatial.js';
import {System} from '../system.js';
import {TextInputComponent} from '../components/textinput.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class TextInputRendererSystem extends System {
  constructor(
      entities = ij(EntityManager),
      drawing = ij(Drawing)) {
    super();
    this.entities = entities;
    this.drawing = drawing;
    this.deltaAcc = 0;
  }
  
  frame(delta) {
    const inputs = this.entities.query()
        .filter(TextInputComponent)
        .iterate(TextInputComponent, SpatialComponent, ActiveComponent);
    for (const input of inputs) {
      this.renderTextInput(input, delta);
    }
  }
  
  renderTextInput(input, delta) {
    const textInput = input.get(TextInputComponent);
    const textInputSpatial = input.get(SpatialComponent);
    
    const maxInputWidth = textInputSpatial.width - 2;
    
    const inputStart = Math.max(textInput.cursor - maxInputWidth, 0);
    const text = textInput.text.substr(inputStart, maxInputWidth);
    const prompt = textInput.prompt;
    
    const cursorX = textInput.cursor - inputStart;
    const active = input.get(ActiveComponent).active;
    this.deltaAcc = (this.deltaAcc + delta) % 1000;
    const cursorForeground = active && this.deltaAcc < 500 ? BLACK : BLUE_BRIGHT;
    const cursorBackground = active && this.deltaAcc < 500 ? BLUE_BRIGHT : BLACK;
    
    this.drawing.clipping(textInputSpatial)
        .sprint(prompt, textInputSpatial.x, textInputSpatial.y, BLUE_BRIGHT, BLACK)
        .sprint(text,
            textInputSpatial.x + prompt.length, textInputSpatial.y,
            BLUE_BRIGHT, BLACK)
        .sprint(text[cursorX] || ' ',
            textInputSpatial.x + prompt.length + cursorX, textInputSpatial.y,
            cursorForeground, cursorBackground);
  }
}

export {TextInputRendererSystem};