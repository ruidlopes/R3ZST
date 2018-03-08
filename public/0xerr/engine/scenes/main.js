import {SCREEN} from '../qualifiers.js';
import {CxelBuffer} from '../../renderer/cxel/buffer.js';
import {EntityManager} from '../entity/manager.js';
import {HardwareView} from './main/hardware.js';
import {Keyboard} from '../../observers/keyboard.js';
import {KeyModifiers} from '../../observers/keyboard/modifiers.js';
import {KeyShortcut} from '../../observers/keyboard/shortcut.js';
import {NodeFactory} from '../factory/node.js';
import {Rect} from '../../renderer/graphics/rect.js';
import {Scene} from '../scene.js';
import {StatusView} from './main/status.js';
import {TerminalView} from './main/terminal.js';
import {enumOf, mapOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

const States = enumOf(
  'LOOP',
);

const ViewEnum = enumOf(
  'HARDWARE',
  'TERMINAL',
  'STATUS',
);

class MainScene extends Scene {
  constructor(
      screen = ij(CxelBuffer, SCREEN),
      keyboard = ij(Keyboard),
      manager = ij(EntityManager),
      nodeFactory = ij(NodeFactory)) {
    super(screen, keyboard);
    
    this.manager = manager;
    nodeFactory.make();
    
    this.views = mapOf(
        ViewEnum.HARDWARE, new HardwareView(this.screen, this.manager),
        ViewEnum.TERMINAL, new TerminalView(this.screen),
        ViewEnum.STATUS, new StatusView(this.screen),
    );
    this.selectedView = ViewEnum.TERMINAL;
    this.views.get(this.selectedView).focus();
    
    this.globalShortcuts = mapOf(
        new KeyShortcut('TAB'), () => this.nextView(),
        new KeyShortcut('TAB', KeyModifiers.SHIFT), () => this.previousView(),
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
  
  previousView() {
    this.views.get(this.selectedView).blur();
    
    switch (this.selectedView) {
      case ViewEnum.HARDWARE:
        this.selectedView = ViewEnum.STATUS;
        break;
      case ViewEnum.TERMINAL:
        this.selectedView = ViewEnum.HARDWARE;
        break;
      case ViewEnum.STATUS:
        this.selectedView = ViewEnum.TERMINAL;
        break;
    }
    
    this.views.get(this.selectedView).focus();
  }
  
  processKeyEvents() {
    this.keyboard.processShortcuts(this.globalShortcuts);
    this.keyboard.processShortcuts(this.views.get(this.selectedView).shortcuts);
  }
  
  mainLoop() {
    this.processKeyEvents();
    
    // update game state
    // if layout invalidated, measure() & layout()
    
    this.views.get(ViewEnum.HARDWARE).render();
    this.views.get(ViewEnum.STATUS).render();
    this.views.get(ViewEnum.TERMINAL).render();
  }
}

export {MainScene};