import {BLACK, BLUE_BRIGHT} from '../common/palette.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {System} from '../system.js';
import {Viewport} from '../../observers/viewport.js';
import {ij} from '../../injection/api.js';

class DisconnectedSystem extends System {
  constructor(
      entities = ij(EntityManager),
      events = ij(EventManager),
      viewport = ij(Viewport),
      drawing = ij(Drawing)) {
    super();
    this.entities = entities;
    this.events = events;
    this.viewport = viewport;
    this.drawing = drawing;
  }
  
  frame(delta) {
    const width = this.viewport.screenWidth();
    const height = this.viewport.screenHeight();
    
    this.drawing.absolute()
        .rect(0, 0, width, height, 0x20, BLUE_BRIGHT, BLACK)
        .sprint('DISCONNECTED. PRESS R TO REBOOT.', 0, 0, BLUE_BRIGHT, BLACK);
  }
}

export {DisconnectedSystem};