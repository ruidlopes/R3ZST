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

const ViewEnum = {
  HARDWARE: Symbol(),
  TERMINAL: Symbol(),
  STATUS: Symbol(),
};

class MainScene extends Scene {
  constructor(scr, keyboard) {
    super(scr, keyboard);
    
    this.views = mapOf(
        ViewEnum.HARDWARE, new HardwareView(this.screen),
        ViewEnum.STATUS, new StatusView(this.screen),
        ViewEnum.TERMINAL, new TerminalView(this.screen),
    );
    this.selectedView = ViewEnum.TERMINAL;
    this.views.get(this.selectedView).focus();
    
    this.shortcuts = mapOf(
        'TAB', () => this.nextView(),
    );
    
    this.sm.fixed(States.LOOP, () => this.mainLoop());
    this.sm.jump(States.LOOP);
  }
  
  resize(width, height) {
    super.resize(width, height);
    this.views.get(ViewEnum.HARDWARE).layout(new Rect(0, 0, width - 25, height - 20));
    this.views.get(ViewEnum.STATUS).layout(new Rect(width - 25, 0, 25, height));
    this.views.get(ViewEnum.TERMINAL).layout(new Rect(0, height - 20, width - 24, 20));
  }
  
  nextView() {
    this.views.get(this.selectedView).blur();
    
    switch (this.selectedView) {
      case ViewEnum.HARDWARE:
        this.selectedView = ViewEnum.TERMINAL;
        break;
      case ViewEnum.TERMINAL:
        this.selectedView = ViewEnum.STATUS;
        break;
      case ViewEnum.STATUS:
        this.selectedView = ViewEnum.HARDWARE;
        break;
    }
    
    this.views.get(this.selectedView).focus();
  }
  
  processKeyEvents() {
    for (const [shortcut, handler] of this.shortcuts.entries()) {
      if (this.keyboard.capturingUp(shortcut)) {
        handler();
      }
    }
  }
  
  mainLoop() {
    this.processKeyEvents();
    
    // update game state
    // if layout invalidated, measure() & layout()
    for (const view of this.views.values()) {
      view.render();
    }
  }
}

export {MainScene};