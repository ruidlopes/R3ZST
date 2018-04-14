import {BLACK, BLUE_BRIGHT} from '../common/palette.js';
import {NETWORK} from '../factories/qualifiers.js';
import {ActiveComponent} from '../components/active.js';
import {DeckFactory} from '../factories/debug/deck.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {GameFactory} from '../factories/game.js';
import {NetworkFactory} from '../factories/network.js';
import {NodeFactory} from '../factories/debug/node.js';
import {PlayerFactory} from '../factories/network/player.js';
import {PlayerFactory as DebugPlayerFactory} from '../factories/debug/player.js';
import {Random} from '../../stdlib/random.js';
import {SpatialComponent} from '../components/spatial.js';
import {System} from '../system.js';
import {TextInputComponent} from '../components/textinput.js';
import {ViewFactory} from '../factories/view.js';
import {Viewport} from '../../observers/viewport.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

const BOOT_TIMEOUT_MS = 5 * 1000;

class BootSystem extends System {
  constructor(
      entities = ij(EntityManager),
      events = ij(EventManager),
      viewport = ij(Viewport),
      drawing = ij(Drawing),
      random = ij(Random),
      
      gameFactory = ij(GameFactory),
      networkFactory = ij(NetworkFactory, NETWORK),
      playerFactory = ij(PlayerFactory, NETWORK),
      viewFactory = ij(ViewFactory),
      
      debugDeckFactory = ij(DeckFactory),
      debugNodeFactory = ij(NodeFactory),
      debugPlayerFactory = ij(DebugPlayerFactory)) {
    super();
        
    this.entities = entities;
    this.events = events;
    this.viewport = viewport;
    this.drawing = drawing;
    this.random = random;
    
    this.gameFactory = gameFactory;
    this.networkFactory = networkFactory;
    this.playerFactory = playerFactory;
    this.viewFactory = viewFactory;
    
    this.debugDeckFactory = debugDeckFactory;
    this.debugNodeFactory = debugNodeFactory;
    this.debugPlayerFactory = debugPlayerFactory;
    
    this.booting = false;
    this.bootTimer = BOOT_TIMEOUT_MS;
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
    this.bootTimer = BOOT_TIMEOUT_MS;
    this.entities.clear();
    this.createPrompt();
  }
  
  createPrompt() {
    this.bootInputId = this.entities.nextId();
    this.entities.add(
        this.bootInputId,
        new TextInputComponent('BOOT>'),
        new ActiveComponent(true),
        new SpatialComponent(0, 2, 50, 1));
  }
  
  bootInput() {
    return firstOf(this.entities.query()
        .filter(TextInputComponent)
        .iterate(TextInputComponent, SpatialComponent));
  }
  
  handleBootInput() {
    const textInput = this.bootInput().get(TextInputComponent).text.trim();
    this.createNetwork(textInput);
  }
  
  createNetwork(input = '') {
    const tokens = input.split(/\s+/);
    const params = new Map(tokens.map(token => token.split('=')));
    
    this.booting = false;
    this.bootTimer = BOOT_TIMEOUT_MS;
    this.entities.clear();
    this.gameFactory.make();
    this.viewFactory.make();
    
    const rawSeed = params.has('SEED') ? params.get('SEED') : Date.now();
    if (rawSeed == 'DEBUG') {
      this.debugDeckFactory.make();
      this.debugNodeFactory.make();
      this.debugPlayerFactory.make();
    } else {
      // TODO: replace debug factories.
      this.debugDeckFactory.make();
      
      this.random.setRawSeed(rawSeed);
      this.networkFactory.make();
      this.playerFactory.make();
    }
    
    this.events.emit(EventType.CONNECTED);
  }
  
  frame(delta) {
    if (!this.booting) {
      return;
    }
    
    this.bootTimer = Math.max(0, this.bootTimer - delta);
    const seconds = Math.ceil(this.bootTimer / 1000);
    
    if (seconds == 0) {
      this.createNetwork();
      return;
    }
    
    const timeUnit = seconds != 1 ? 'SECONDS' : 'SECOND';
    
    const width = this.viewport.screenWidth();
    const height = this.viewport.screenHeight();
    
    this.drawing.absolute()
        .rect(0, 0, width, height, 0x20, BLUE_BRIGHT, BLACK)
        .sprint('WELCOME TO RETSAFE.', 0, 0, BLUE_BRIGHT, BLACK)
        .sprint(`AUTO-BOOTING IN ${seconds} ${timeUnit}.`, 0, 1, BLUE_BRIGHT, BLACK);
    
    this.bootInput().get(SpatialComponent).width = width;
  }
}

export {BootSystem};