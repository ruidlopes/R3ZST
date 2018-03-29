import {BLACK, BLUE_BRIGHT} from '../common/palette.js';
import {Drawing} from '../common/drawing.js';
import {Keyboard} from '../../observers/keyboard.js';
import {KeyModifiers} from '../../observers/keyboard/modifiers.js';
import {KeyShortcut} from '../../observers/keyboard/shortcut.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {System} from '../system.js';
import {Viewport} from '../../observers/viewport.js';
import {ij} from '../../injection/api.js';

class VictorySystem extends System {
  constructor(
      entities = ij(EntityManager),
      events = ij(EventManager),
      keyboard = ij(Keyboard),
      viewport = ij(Viewport),
      drawing = ij(Drawing)) {
    super();
    this.entities = entities;
    this.events = events;
    this.keyboard = keyboard;
    this.viewport = viewport;
    this.drawing = drawing;
        
    this.shortcutR = new KeyShortcut('R');
    this.shortcutRShift = new KeyShortcut('R', KeyModifiers.SHIFT);
  }
  
  frame(delta) {
    const width = this.viewport.screenWidth();
    const height = this.viewport.screenHeight();
    
    this.drawing.absolute()
        .rect(0, 0, width, height, 0x20, BLUE_BRIGHT, BLACK)
        .sprint('VICTORY! ALL RETSAFE CAMERAS STOPPED RECORDING! ' +
                'PRESS R TO REBOOT.', 0, 0, BLUE_BRIGHT, BLACK);
    
    if (this.keyboard.releasedAny(this.shortcutR) ||
        this.keyboard.releasedAny(this.shortcutRShift)) {
      this.events.emit(EventType.BOOT);
    }
  }
}

export {VictorySystem};