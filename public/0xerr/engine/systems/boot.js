import {BLACK, BLUE_BRIGHT} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {DeckFactory} from '../factories/debug/deck.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {GameFactory} from '../factories/game.js';
import {NetworkFactory} from '../factories/network.js';
import {NodeFactory} from '../factories/debug/node.js';
import {PlayerFactory} from '../factories/debug/player.js';
import {Random} from '../../stdlib/random.js';
import {SpatialComponent} from '../components/spatial.js';
import {System} from '../system.js';
import {TextInputComponent} from '../components/textinput.js';
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
      random = ij(Random),
      
      gameFactory = ij(GameFactory),
      networkFactory = ij(NetworkFactory),
      viewFactory = ij(ViewFactory),
      
      debugDeckFactory = ij(DeckFactory),
      debugNodeFactory = ij(NodeFactory),
      debugPlayerFactory = ij(PlayerFactory)) {
    super();
        
    this.entities = entities;
    this.events = events;
    this.viewport = viewport;
    this.drawing = drawing;
    this.random = random;
    
    this.gameFactory = gameFactory;
    this.networkFactory = networkFactory;
    this.viewFactory = viewFactory;
    
    this.debugDeckFactory = debugDeckFactory;
    this.debugNodeFactory = debugNodeFactory;
    this.debugPlayerFactory = debugPlayerFactory;
    
    this.booting = false;
    this.events.subscribe(
        EventType.BOOT,
        () => this.boot());
    
    this.bootInputId = undefined;
    this.events.once(
        EventType.TEXT_INPUT,
        (id) => id == this.bootInputId && this.handleBootInput(id));
  }
  
  boot() {
    this.booting = true;
    this.entities.clear();
    this.createPrompt();
  }
  
  createPrompt() {
    this.bootInputId = this.entities.nextId();
    this.entities.add(
        this.bootInputId,
        new TextInputComponent('BOOT>'),
        new ActiveComponent(true),
        new SpatialComponent(0, 1, 50, 1));
  }
  
  bootInput() {
    return firstOf(this.entities.query()
        .filter(TextInputComponent)
        .iterate(TextInputComponent, SpatialComponent));
  }
  
  handleBootInput() {
    const textInput = this.bootInput().get(TextInputComponent).text.trim();
    const tokens = textInput.split(/\s+/);
    const params = new Map(tokens.map(token => token.split('=')));
    
    this.booting = false;
    this.entities.clear();
    this.gameFactory.make();
    this.viewFactory.make();
    
    const rawSeed = params.get('SEED') || '';
    if (rawSeed == 'DEBUG') {
      this.debugDeckFactory.make();
      this.debugNodeFactory.make();
      this.debugPlayerFactory.make();
    } else {
      // TODO: replace debug factories.
      this.debugDeckFactory.make();
      this.debugPlayerFactory.make();
      
      this.random.setSeed(rawSeed);
      this.networkFactory.make();
    }
    
    this.events.emit(EventType.CONNECTED);
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
    
    this.bootInput().get(SpatialComponent).width = width;
  }
}

export {BootSystem};