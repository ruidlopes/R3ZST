import {BLACK, BLUE_BRIGHT} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {DeckFactory} from '../factories/debug/deck.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {GameFactory} from '../factories/game.js';
import {NodeFactory} from '../factories/debug/node.js';
import {PlayerFactory} from '../factories/debug/player.js';
import {TextInputComponent} from '../components/textinput.js';
import {SpatialComponent} from '../components/spatial.js';
import {System} from '../system.js';
import {ViewFactory} from '../factories/view.js';
import {Viewport} from '../../observers/viewport.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class BootSystem extends System {
  constructor(
      entities = ij(EntityManager),
      events = ij(EventManager),
      viewport = ij(Viewport),
      drawing = ij(Drawing),
      gameFactory = ij(GameFactory),
      viewFactory = ij(ViewFactory),
      debugDeckFactory = ij(DeckFactory),
      debugNodeFactory = ij(NodeFactory),
      debugPlayerFactory = ij(PlayerFactory)) {
    super();
        
    this.entities = entities;
    this.events = events;
    this.viewport = viewport;
    this.drawing = drawing;
    
    this.gameFactory = gameFactory;
    this.viewFactory = viewFactory;
    
    this.debugDeckFactory = debugDeckFactory;
    this.debugNodeFactory = debugNodeFactory;
    this.debugPlayerFactory = debugPlayerFactory;
    
    this.booting = false;
    this.events.subscribe(
        EventType.BOOT,
        () => this.boot());
    
    this.seedInputId = undefined;
    this.seedInputHandler = (id) => {
        id == this.seedInputId && this.handleSeedInput(id);
      this.events.unsubscribe(
          EventType.TEXT_INPUT, this.seedInputHandler);
    };
    this.events.subscribe(
        EventType.TEXT_INPUT, this.seedInputHandler);
  }
  
  boot() {
    this.booting = true;
    this.entities.clear();
    this.createPrompt();
  }
  
  createPrompt() {
    this.seedInputId = this.entities.nextId();
    this.entities.add(
        this.seedInputId,
        new TextInputComponent('INPUT SEED>'),
        new ActiveComponent(true),
        new SpatialComponent(0, 1, 50, 1));
  }
  
  seedInput() {
    return firstOf(this.entities.query()
        .filter(TextInputComponent)
        .iterate(TextInputComponent, SpatialComponent));
  }
  
  handleSeedInput() {
    const textInput = this.seedInput().get(TextInputComponent);
    const seed = textInput.text.trim();
    this.booting = false;
    this.entities.clear();
    this.gameFactory.make();
    this.viewFactory.make();
    
    if (seed) {
      // TODO: replace debug factories.
      this.debugDeckFactory.make();
      this.debugPlayerFactory.make();
    } else {
      this.createDebugNetwork();
    }
    
    this.events.emit(EventType.CONNECTED);
  }
  
  createDebugNetwork() {
    this.debugDeckFactory.make();
    this.debugNodeFactory.make();
    this.debugPlayerFactory.make();
  }
  
  frame(delta) {
    if (!this.booting) {
      return;
    }
    
    const width = this.viewport.screenWidth();
    const height = this.viewport.screenHeight();
    
    this.drawing.absolute()
        .rect(0, 0, width, height, 0x20, BLUE_BRIGHT, BLACK)
        .sprint('WELCOME TO RETSAFE.', 0, 0, BLUE_BRIGHT, BLACK);
    
    this.seedInput().get(SpatialComponent).width = width;
  }
}

export {BootSystem};