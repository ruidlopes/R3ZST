import {MAIN_SCENE_UPDATE} from './qualifiers.js';
import {Module} from '../../injection/module.js';
import {NodeRendererSystem} from './noderenderer.js';
import {System} from '../system.js';
import {ViewFocusSystem} from './viewfocus.js';
import {ViewSpatialSystem} from './viewspatial.js';

class SystemsModule extends Module {
  configure() {
    this.bindClass(NodeRendererSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_UPDATE, ViewFocusSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_UPDATE, ViewSpatialSystem);
  }
}

export {SystemsModule};