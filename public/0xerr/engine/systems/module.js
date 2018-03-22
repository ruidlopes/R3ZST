import {
  MAIN_SCENE_GLOBAL,
  MAIN_SCENE_INPUT,
  MAIN_SCENE_UPDATE,
  MAIN_SCENE_RENDER,
} from './qualifiers.js';

import {ActionsSystem} from './actions.js';
import {CameraTransformSystem} from './cameratransform.js';
import {ChipRendererSystem} from './chiprenderer.js';
import {GameStatsRendererSystem} from './gamestatsrenderer.js';
import {Module} from '../../injection/module.js';
import {NodeStatsRendererSystem} from './nodestatsrenderer.js';
import {NodeRendererSystem} from './noderenderer.js';
import {PlayerChipBoundsSystem} from './playerchipbounds.js';
import {PlayerPositionSystem} from './playerposition.js';
import {PlayerRendererSystem} from './playerrenderer.js';
import {PlayerVelocitySystem} from './playervelocity.js';
import {SentinelRendererSystem} from './sentinelrenderer.js';
import {TerminalBufferSystem} from './terminalbuffer.js';
import {TerminalInputSystem} from './terminalinput.js';
import {TerminalRendererSystem} from './terminalrenderer.js';
import {TurnManagementSystem} from './turnmanagement.js';
import {System} from '../system.js';
import {ViewFocusSystem} from './viewfocus.js';
import {ViewSpatialSystem} from './viewspatial.js';
import {ViewRendererSystem} from './viewrenderer.js';

class SystemsModule extends Module {
  configure() {
    this.bindClassIntoSet(System, MAIN_SCENE_GLOBAL, ActionsSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_GLOBAL, TurnManagementSystem);

    this.bindClassIntoSet(System, MAIN_SCENE_INPUT, ViewFocusSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_INPUT, TerminalInputSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_INPUT, PlayerVelocitySystem);
    
    this.bindClassIntoSet(System, MAIN_SCENE_UPDATE, CameraTransformSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_UPDATE, PlayerPositionSystem);
    
    this.bindClassIntoSet(System, MAIN_SCENE_UPDATE, PlayerChipBoundsSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_UPDATE, ViewSpatialSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_UPDATE, TerminalBufferSystem);
    
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, ViewRendererSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, TerminalRendererSystem);
    
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, NodeRendererSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, ChipRendererSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, SentinelRendererSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, PlayerRendererSystem);
    
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, GameStatsRendererSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, NodeStatsRendererSystem);
  }
}

export {SystemsModule};