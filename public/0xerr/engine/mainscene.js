import {
  BOOT,
  MAIN_SCENE_GLOBAL,
  MAIN_SCENE_INPUT,
  MAIN_SCENE_UPDATE,
  MAIN_SCENE_RENDER,
  DISCONNECTED,
  VICTORY,
} from './systems/qualifiers.js';
import {EntityCache, CacheScope} from './entity/cache.js';
import {EventManager} from './event/manager.js';
import {EventType} from './event/type.js';
import {Scene} from './scene.js';
import {System} from './system.js';
import {enumOf} from '../stdlib/collections.js';
import {ij, ijset} from '../injection/api.js';

const States = enumOf(
  'BOOT',
  'GAMELOOP',
  'DISCONNECTED',
  'VICTORY',
);

class MainScene extends Scene {
  constructor(
      cache = ij(EntityCache),
      events = ij(EventManager),
      bootSystems = ijset(System, BOOT),
      globalSystems = ijset(System, MAIN_SCENE_GLOBAL),
      inputSystems = ijset(System, MAIN_SCENE_INPUT),
      updateSystems = ijset(System, MAIN_SCENE_UPDATE),
      renderSystems = ijset(System, MAIN_SCENE_RENDER),
      disconnectedSystems = ijset(System, DISCONNECTED),
      victorySystems = ijset(System, VICTORY),
  ) {
    super();
    
    this.cache = cache;
        
    this.events = events;
    this.events.subscribe(
        EventType.BOOT,
        () => this.jump(States.BOOT));
    this.events.subscribe(
        EventType.CONNECTED,
        () => this.jump(States.GAMELOOP));
    this.events.subscribe(
        EventType.DISCONNECTED,
        () => this.jump(States.DISCONNECTED));
    this.events.subscribe(
        EventType.VICTORY,
        () => this.jump(States.VICTORY));
    
    this.bootSystems = bootSystems;
    this.globalSystems = globalSystems;
    this.inputSystems = inputSystems;
    this.updateSystems = updateSystems;
    this.renderSystems = renderSystems;
    this.disconnectedSystems = disconnectedSystems;
    this.victorySystems = victorySystems;
    
    this.sm.fixed(States.BOOT, (delta) => this.boot(delta));
    this.sm.fixed(States.GAMELOOP, (delta) => this.gameLoop(delta));
    this.sm.fixed(States.DISCONNECTED, (delta) => this.disconnected(delta));
    this.sm.fixed(States.VICTORY, (delta) => this.victory(delta));
    
    this.events.emit(EventType.BOOT);
  }
  
  jump(state) {
    this.cache.reset(CacheScope.SCENE);
    this.sm.jump(state);
  }
  
  boot(delta) {
    this.systemClusterFrame(this.bootSystems, delta);
  }
  
  gameLoop(delta) {
    this.cache.reset(CacheScope.FRAME);
    
    this.systemClusterFrame(this.globalSystems, delta);
    this.systemClusterFrame(this.inputSystems, delta);
    this.systemClusterFrame(this.updateSystems, delta);
    this.systemClusterFrame(this.renderSystems, delta);
  }
  
  disconnected(delta) {
    this.systemClusterFrame(this.disconnectedSystems, delta);
  }
  
  victory(delta) {
    this.systemClusterFrame(this.victorySystems, delta);
  }
  
  systemClusterFrame(systemCluster, delta) {
    for (const system of systemCluster) {
      system.frame(delta);
    }
  }
}

export {MainScene};