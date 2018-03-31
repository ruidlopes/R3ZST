import {EntityManager} from '../entity/manager.js';
import {Keyboard} from '../../observers/keyboard.js';
import {KeyModifiers} from '../../observers/keyboard/modifiers.js';
import {KeyShortcut} from '../../observers/keyboard/shortcut.js';
import {SpatialComponent} from '../components/spatial.js';
import {System} from '../system.js';
import {Viewport} from '../../observers/viewport.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {clamp} from '../../stdlib/math.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

const SPEED = 300 / 1000;
const MIN_HEIGHT = 20;

class TerminalFullScreenSystem extends System {
  constructor(
      entities = ij(EntityManager),
      keyboard = ij(Keyboard),
      viewport = ij(Viewport)) {
    super();
    this.entities = entities;
    this.keyboard = keyboard;
    this.viewport = viewport;
        
    this.shortcutFullscreen = new KeyShortcut('F', KeyModifiers.CTRL);
    this.animating = false;
    this.isFullscreen = false;
    
    this.initialized = false;
  }
  
  terminalSpatial() {
    return firstOf(this.entities.query()
        .filter(ViewComponent, view => view.type == ViewType.TERMINAL)
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  frame(delta) {
    const spatial = this.terminalSpatial();
    const screenHeight = this.viewport.screenHeight();
    
    if (!this.initialized) {  
      spatial.y = screenHeight - MIN_HEIGHT;
      this.initialized = true;
    }
    
    if (this.keyboard.releasedAny(this.shortcutFullscreen)) {
      this.isFullscreen = !this.isFullscreen;
      this.animating = true;
    }
    
    if (this.animating) {
      const deltaV = delta * SPEED;
      spatial.y += this.isFullscreen ? -deltaV : deltaV;
    }
    
    spatial.y = clamp(spatial.y, 0, screenHeight - MIN_HEIGHT);
    spatial.height = screenHeight - Math.floor(spatial.y);
    if (spatial.y == 0 || spatial.y == screenHeight - MIN_HEIGHT) {
      this.animating = false;
    }
  }
}

export {TerminalFullScreenSystem};