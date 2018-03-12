import {
  MAIN_SCENE_UPDATE,
  MAIN_SCENE_RENDER_BACKGROUND,
  MAIN_SCENE_RENDER_FOREGROUND_1,
  MAIN_SCENE_RENDER_FOREGROUND_3,
} from './systems/qualifiers.js';

import {EntityManager} from './entity/manager.js';
import {NodeFactory} from './factory/node.js';
import {PlayerFactory} from './factory/player.js';
import {Scene} from './scene.js';
import {System} from './system.js';
import {ViewFactory} from './factory/view.js';
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
      updateSystems = ijset(System, MAIN_SCENE_UPDATE),
      renderBackgroundSystems = ijset(System, MAIN_SCENE_RENDER_BACKGROUND),
      renderForeground1Systems = ijset(System, MAIN_SCENE_RENDER_FOREGROUND_1),
      renderForeground3Systems = ijset(System, MAIN_SCENE_RENDER_FOREGROUND_3),
  ) {
    super();
    
    this.manager = manager;
    nodeFactory.make();
    viewFactory.make();
    playerFactory.make();
        
    this.updateSystems = updateSystems;
    this.renderBackgroundSystems = renderBackgroundSystems;
    this.renderForeground1Systems = renderForeground1Systems;
    this.renderForeground3Systems = renderForeground3Systems;
    
    this.sm.fixed(States.LOOP, (delta) => this.mainLoop(delta));
    this.sm.jump(States.LOOP);
  }
  
  mainLoop(delta) {
    for (const system of this.updateSystems) {
      system.frame(delta);
    }
    for (const system of this.renderBackgroundSystems) {
      system.frame(delta);
    }
    for (const system of this.renderForeground1Systems) {
      system.frame(delta);
    }
    for (const system of this.renderForeground3Systems) {
      system.frame(delta);
    }
  }
}

export {MainScene};