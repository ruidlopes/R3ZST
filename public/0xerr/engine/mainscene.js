import {
  MAIN_SCENE_GLOBAL,
  MAIN_SCENE_INPUT,
  MAIN_SCENE_UPDATE,
  MAIN_SCENE_RENDER,
} from './systems/qualifiers.js';

import {EntityManager} from './entity/manager.js';
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
);

class MainScene extends Scene {
  constructor(
      manager = ij(EntityManager),
      nodeFactory = ij(NodeFactory),
      viewFactory = ij(ViewFactory),
      playerFactory = ij(PlayerFactory),
      gameFactory = ij(GameFactory),
      globalSystems = ijset(System, MAIN_SCENE_GLOBAL),
      inputSystems = ijset(System, MAIN_SCENE_INPUT),
      updateSystems = ijset(System, MAIN_SCENE_UPDATE),
      renderSystems = ijset(System, MAIN_SCENE_RENDER),
  ) {
    super();
    
    this.manager = manager;
    nodeFactory.make();
    viewFactory.make();
    playerFactory.make();
    gameFactory.make();
    
    this.globalSystems = globalSystems;
    this.inputSystems = inputSystems;
    this.updateSystems = updateSystems;
    this.renderSystems = renderSystems;
    
    this.sm.fixed(States.LOOP, (delta) => this.mainLoop(delta));
    this.sm.jump(States.LOOP);
  }
  
  mainLoop(delta) {
    this.systemClusterFrame(this.globalSystems, delta);
    this.systemClusterFrame(this.inputSystems, delta);
    this.systemClusterFrame(this.updateSystems, delta);
    this.systemClusterFrame(this.renderSystems, delta);
  }
  
  systemClusterFrame(systemCluster, delta) {
    for (const system of systemCluster) {
      system.frame(delta);
    }
  }
}

export {MainScene};