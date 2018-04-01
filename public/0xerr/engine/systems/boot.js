import {BLACK, BLUE_BRIGHT} from '../common/palette.js';
import {DeckFactory} from '../factories/debug/deck.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {GameFactory} from '../factories/game.js';
import {NodeFactory} from '../factories/debug/node.js';
import {PlayerFactory} from '../factories/debug/player.js';
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
      deckFactory = ij(DeckFactory),
      gameFactory = ij(GameFactory),
      nodeFactory = ij(NodeFactory),
      playerFactory = ij(PlayerFactory),
      viewFactory = ij(ViewFactory)) {
    super();
        
    this.entities = entities;
    this.events = events;
    this.viewport = viewport;
    this.drawing = drawing;
    
    this.deckFactory = deckFactory;
    this.gameFactory = gameFactory;
    this.nodeFactory = nodeFactory;
    this.playerFactory = playerFactory;
    this.viewFactory = viewFactory;
        
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
    this.deckFactory.make();
    this.gameFactory.make();
    this.nodeFactory.make();
    this.playerFactory.make();
    this.viewFactory.make();
    
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