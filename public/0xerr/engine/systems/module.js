import {
  MAIN_SCENE_UPDATE,
  MAIN_SCENE_RENDER_BACKGROUND,
  MAIN_SCENE_RENDER_FOREGROUND_1,
} from './qualifiers.js';

import {Module} from '../../injection/module.js';
import {NodeRendererSystem} from './noderenderer.js';
import {System} from '../system.js';
import {ViewFocusSystem} from './viewfocus.js';
import {ViewSpatialSystem} from './viewspatial.js';
import {ViewRendererSystem} from './viewrenderer.js';

class SystemsModule extends Module {
  configure() {
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER_FOREGROUND_1, NodeRendererSystem);
    
    this.bindClassIntoSet(System, MAIN_SCENE_UPDATE, ViewFocusSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_UPDATE, ViewSpatialSystem);
    
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER_BACKGROUND, ViewRendererSystem);
  }
}

export {SystemsModule};