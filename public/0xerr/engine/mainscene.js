import {
  MAIN_SCENE_GLOBAL,
  MAIN_SCENE_INPUT,
  MAIN_SCENE_UPDATE,
  MAIN_SCENE_RENDER,
  DISCONNECTED,
} from './systems/qualifiers.js';

import {EventManager} from './event/manager.js';
import {EventType} from './event/type.js';
import {GameFactory} from './factories/game.js';
import {NodeFactory} from './factories/node.js';
import {PlayerFactory} from './factories/player.js';
import {Scene} from './scene.js';
import {System} from './system.js';
import {ViewFactory} from './factories/view.js';
import {enumOf} from '../stdlib/collections.js';
import {ij, ijset} from '../injection/api.js';

const States = enumOf(
  'LOOP',
  'DISCONNECTED',
);

class MainScene extends Scene {
  constructor(
      events = ij(EventManager),
      nodeFactory = ij(NodeFactory),
      viewFactory = ij(ViewFactory),
      playerFactory = ij(PlayerFactory),
      gameFactory = ij(GameFactory),
      globalSystems = ijset(System, MAIN_SCENE_GLOBAL),
      inputSystems = ijset(System, MAIN_SCENE_INPUT),
      updateSystems = ijset(System, MAIN_SCENE_UPDATE),
      renderSystems = ijset(System, MAIN_SCENE_RENDER),
      disconnectedSystems = ijset(System, DISCONNECTED),
  ) {
    super();
    
    this.events = events;
    this.events.subscribe(
        EventType.DISCONNECTED,
        () => this.sm.jump(States.DISCONNECTED));

    nodeFactory.make();
    viewFactory.make();
    playerFactory.make();
    gameFactory.make();
    
    this.globalSystems = globalSystems;
    this.inputSystems = inputSystems;
    this.updateSystems = updateSystems;
    this.renderSystems = renderSystems;
    this.disconnectedSystems = disconnectedSystems;
    
    this.sm.fixed(States.LOOP, (delta) => this.mainLoop(delta));
    this.sm.fixed(States.DISCONNECTED, (delta) => this.disconnected(delta));
    this.sm.jump(States.LOOP);
  }
  
  mainLoop(delta) {
    this.systemClusterFrame(this.globalSystems, delta);
    this.systemClusterFrame(this.inputSystems, delta);
    this.systemClusterFrame(this.updateSystems, delta);
    this.systemClusterFrame(this.renderSystems, delta);
  }
  
  disconnected(delta) {
    this.systemClusterFrame(this.disconnectedSystems, delta);
  }
  
  systemClusterFrame(systemCluster, delta) {
    for (const system of systemCluster) {
      system.frame(delta);
    }
  }
}

export {MainScene};