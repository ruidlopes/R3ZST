import {BLACK, BLUE_BRIGHT} from '../common/palette.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {GameFactory} from '../factories/game.js';
import {NodeFactory} from '../factories/node.js';
import {PlayerFactory} from '../factories/player.js';
import {System} from '../system.js';
import {ViewFactory} from '../factories/view.js';
import {Viewport} from '../../observers/viewport.js';
import {ij} from '../../injection/api.js';

class BootSystem extends System {
  constructor(
      entities = ij(EntityManager),
      events = ij(EventManager),
      viewport = ij(Viewport),
      drawing = ij(Drawing),
      nodeFactory = ij(NodeFactory),
      viewFactory = ij(ViewFactory),
      playerFactory = ij(PlayerFactory),
      gameFactory = ij(GameFactory)) {
    super();
        
    this.entities = entities;
    this.events = events;
    this.viewport = viewport;
    this.drawing = drawing;
        
    this.nodeFactory = nodeFactory;
    this.viewFactory = viewFactory;
    this.playerFactory = playerFactory;
    this.gameFactory = gameFactory;
        
    this.events.subscribe(
        EventType.BOOT,
        () => this.boot());
        
    this.initialized = false;
  }
  
  boot() {
    this.entities.clear();
    this.initialized = false;
  }
  
  createNetwork() {
    this.nodeFactory.make();
    this.viewFactory.make();
    this.playerFactory.make();
    this.gameFactory.make();
    
    this.events.emit(EventType.CONNECTED);
  }
  
  frame(delta) {
    if (!this.initialized) {
      this.createNetwork();
      this.initialized = true;
    }
    
    const width = this.viewport.screenWidth();
    const height = this.viewport.screenHeight();
    
    this.drawing.absolute()
        .rect(0, 0, width, height, 0x20, BLUE_BRIGHT, BLACK)
        .sprint('WELCOME TO RETSAFE.', 0, 0, BLUE_BRIGHT, BLACK);
  }
}

export {BootSystem};