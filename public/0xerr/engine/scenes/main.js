import {MAIN_SCENE_UPDATE} from '../systems/qualifiers.js';
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
import {System} from '../system.js';
import {TerminalView} from './main/terminal.js';
import {ViewFactory} from '../factory/view.js';
import {ViewType} from '../components/view.js';
import {enumOf, mapOf} from '../../stdlib/collections.js';
import {ij, ijset} from '../../injection/api.js';

const States = enumOf(
  'LOOP',
);

class MainScene extends Scene {
  constructor(
      screen = ij(CxelBuffer, SCREEN),
      keyboard = ij(Keyboard),
      manager = ij(EntityManager),
      nodeFactory = ij(NodeFactory),
      viewFactory = ij(ViewFactory),
      updateSystems = ijset(System, MAIN_SCENE_UPDATE)) {
    super(screen, keyboard);
    
    this.manager = manager;
    nodeFactory.make();
    viewFactory.make();
        
    this.updateSystems = updateSystems;
    
    this.views = mapOf(
        ViewType.HARDWARE, new HardwareView(this.screen, this.manager),
        ViewType.TERMINAL, new TerminalView(this.screen),
        ViewType.STATUS, new StatusView(this.screen),
    );
    this.selectedView = ViewType.TERMINAL;
    this.views.get(this.selectedView).focus();
    
    this.globalShortcuts = mapOf(
        new KeyShortcut('TAB'), () => this.nextView(),
        new KeyShortcut('TAB', KeyModifiers.SHIFT), () => this.previousView(),
    );
    
    this.sm.fixed(States.LOOP, (delta) => this.mainLoop(delta));
    this.sm.jump(States.LOOP);
  }
  
  resize(width, height) {
    super.resize(width, height);
    this.views.get(ViewType.HARDWARE).layout(new Rect(0, 0, width - 25, height - 20));
    this.views.get(ViewType.STATUS).layout(new Rect(width - 25, 0, 25, height));
    this.views.get(ViewType.TERMINAL).layout(new Rect(0, height - 20, width - 24, 20));
  }
  
  nextView() {
    this.views.get(this.selectedView).blur();
    
    switch (this.selectedView) {
      case ViewType.HARDWARE:
        this.selectedView = ViewType.TERMINAL;
        break;
      case ViewType.TERMINAL:
        this.selectedView = ViewType.STATUS;
        break;
      case ViewType.STATUS:
        this.selectedView = ViewType.HARDWARE;
        break;
    }
    
    this.views.get(this.selectedView).focus();
  }
  
  previousView() {
    this.views.get(this.selectedView).blur();
    
    switch (this.selectedView) {
      case ViewType.HARDWARE:
        this.selectedView = ViewType.STATUS;
        break;
      case ViewType.TERMINAL:
        this.selectedView = ViewType.HARDWARE;
        break;
      case ViewType.STATUS:
        this.selectedView = ViewType.TERMINAL;
        break;
    }
    
    this.views.get(this.selectedView).focus();
  }
  
  processKeyEvents() {
    this.keyboard.processShortcuts(this.globalShortcuts);
    this.keyboard.processShortcuts(this.views.get(this.selectedView).shortcuts);
  }
  
  mainLoop(delta) {
    this.processKeyEvents();
    
    for (const system of this.updateSystems) {
      system.frame(delta);
    }
    
    this.views.get(ViewType.HARDWARE).render();
    this.views.get(ViewType.STATUS).render();
    this.views.get(ViewType.TERMINAL).render();
  }
}

export {MainScene};