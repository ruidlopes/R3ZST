import {
  MAIN_SCENE_GLOBAL,
  MAIN_SCENE_INPUT,
  MAIN_SCENE_UPDATE,
  MAIN_SCENE_RENDER,
  
  BOOT,
  DISCONNECTED,
  VICTORY,
} from './qualifiers.js';

import {BootSystem} from './boot.js';
import {CameraTransformSystem} from './cameratransform.js';
import {ChipRendererSystem} from './chiprenderer.js';
import {DisconnectedSystem} from './disconnected.js';
import {GameEndingSystem} from './gameending.js';
import {HardwareRendererSystem} from './hardwarerenderer.js';
import {Module} from '../../injection/module.js';
import {NodeRendererSystem} from './noderenderer.js';
import {PlayerActionsSystem} from './playeractions.js';
import {PlayerChipBoundsSystem} from './playerchipbounds.js';
import {PlayerPositionSystem} from './playerposition.js';
import {PlayerRendererSystem} from './playerrenderer.js';
import {PlayerVelocitySystem} from './playervelocity.js';
import {PlayerVisitedSystem} from './playervisited.js';
import {RetsafeActionsSystem} from './retsafeactions.js';
import {SentryRendererSystem} from './sentryrenderer.js';
import {TerminalBufferSystem} from './terminalbuffer.js';
import {TerminalFullScreenSystem} from './terminalfullscreen.js';
import {TerminalInputSystem} from './terminalinput.js';
import {TerminalRendererSystem} from './terminalrenderer.js';
import {TextInputRendererSystem} from './textinputrenderer.js';
import {TextInputSystem} from './textinput.js';
import {TurnManagementSystem} from './turnmanagement.js';
import {StatusRendererSystem} from './statusrenderer.js';
import {System} from '../system.js';
import {VictorySystem} from './victory.js';
import {ViewFocusSystem} from './viewfocus.js';
import {ViewSpatialSystem} from './viewspatial.js';
import {VisitedRendererSystem} from './visitedrenderer.js';

class SystemsModule extends Module {
  configure() {
    this.bindClassIntoSet(System, BOOT, TextInputSystem);
    this.bindClassIntoSet(System, BOOT, BootSystem);
    this.bindClassIntoSet(System, BOOT, TextInputRendererSystem);
    
    this.bindClassIntoSet(System, MAIN_SCENE_GLOBAL, PlayerActionsSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_GLOBAL, RetsafeActionsSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_GLOBAL, TurnManagementSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_GLOBAL, GameEndingSystem);

    this.bindClassIntoSet(System, MAIN_SCENE_INPUT, ViewFocusSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_INPUT, TerminalFullScreenSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_INPUT, TerminalInputSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_INPUT, TextInputSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_INPUT, PlayerVelocitySystem);
    
    this.bindClassIntoSet(System, MAIN_SCENE_UPDATE, PlayerPositionSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_UPDATE, CameraTransformSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_UPDATE, PlayerVisitedSystem);
    
    this.bindClassIntoSet(System, MAIN_SCENE_UPDATE, PlayerChipBoundsSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_UPDATE, ViewSpatialSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_UPDATE, TerminalBufferSystem);
    
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, HardwareRendererSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, NodeRendererSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, ChipRendererSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, SentryRendererSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, PlayerRendererSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, VisitedRendererSystem);
    
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, TerminalRendererSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, TextInputRendererSystem);
    this.bindClassIntoSet(System, MAIN_SCENE_RENDER, StatusRendererSystem);
    
    this.bindClassIntoSet(System, DISCONNECTED, DisconnectedSystem);
    
    this.bindClassIntoSet(System, VICTORY, VictorySystem);
  }
}

export {SystemsModule};