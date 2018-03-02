import {BLACK, BLUE_BRIGHT, BLUE_FADED} from '../common/palette.js';
import {HardwareView} from './main/hardware.js';
import {Rect} from '../../renderer/graphics/rect.js';
import {TerminalView} from './main/terminal.js';
import {Scene} from '../scene.js';
import {StatusView} from './main/status.js';
import {mapOf} from '../../stdlib/collections.js';

const States = {
  LOOP: Symbol(),
};

const PanelEnum = {
  HARDWARE: Symbol(),
  TERMINAL: Symbol(),
  STATUS: Symbol(),
};

class MainScene extends Scene {
  constructor(scr) {
    super(scr);
    
    this.panels = mapOf(
        PanelEnum.HARDWARE, new HardwareView(this.screen),
        PanelEnum.STATUS, new StatusView(this.screen),
        PanelEnum.TERMINAL, new TerminalView(this.screen),
    );
    this.selectedPanel = PanelEnum.TERMINAL;
    
    this.sm.fixed(States.LOOP, () => this.mainLoop());
    this.sm.jump(States.LOOP);
  }
  
  resize(width, height) {
    super.resize(width, height);
    this.panels.get(PanelEnum.HARDWARE).layout(new Rect(0, 0, width - 25, height - 20));
    this.panels.get(PanelEnum.STATUS).layout(new Rect(width - 25, 0, 25, height));
    this.panels.get(PanelEnum.TERMINAL).layout(new Rect(0, height - 20, width - 24, 20));
  }
  
  mainLoop() {
    // update game state
    // if layout invalidated, this.root.measure(); this.root.layout();
    for (const panel of this.panels.values()) {
      panel.render();
    }
  }
}

export {MainScene};