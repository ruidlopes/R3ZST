import {ActiveComponent} from '../components/active.js';
import {EntityLib} from '../entity/lib.js';
import {EntityManager} from '../entity/manager.js';
import {Keyboard} from '../../observers/keyboard.js';
import {KeyShortcutRE} from '../../observers/keyboard/shortcut.js';
import {StealthComponent} from '../components/stealth.js';
import {VelocityComponent} from '../components/velocity.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {System} from '../system.js';
import {TurnComponent, TurnEnum} from '../components/turn.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

const SPEED = 15 / 1000;

class PlayerVelocitySystem extends System {
  constructor(
      manager = ij(EntityManager),
      lib = ij(EntityLib),
      keyboard = ij(Keyboard)) {
    super();
    this.manager = manager;
    this.lib = lib;
    this.keyboard = keyboard;
    this.shortcutLeft = new KeyShortcutRE(/^(J|ARROWLEFT)$/);
    this.shortcutRight = new KeyShortcutRE(/^(L|ARROWRIGHT)$/);
    this.shortcutUp = new KeyShortcutRE(/^(I|ARROWUP)$/);
    this.shortcutDown = new KeyShortcutRE(/^(K|ARROWDOWN)$/);
  }
  
  isHardwareViewActive() {
    return firstOf(this.lib.hardwareView().iterate(ActiveComponent))
        .get(ActiveComponent)
        .active;
  }
  
  isPlayerTurn() {
    return this.manager.query()
        .filter(TurnComponent, component => component.turn == TurnEnum.PLAYER)
        .count() == 1;
  }
  
  playerVelocity() {
    return this.manager.query()
        .head(StealthComponent, VelocityComponent)
        .get(VelocityComponent);
  }
  
  frame(delta) {
    const deltaV = delta * SPEED;
    const playerVelocity = this.playerVelocity();
    
    if (!this.isHardwareViewActive() || !this.isPlayerTurn()) {
      playerVelocity.vx = 0;
      playerVelocity.vy = 0;
      return;
    }
    
    if (this.keyboard.downAny(this.shortcutLeft)) {
      playerVelocity.vx = -deltaV;
      playerVelocity.vy = 0;
    } else if (this.keyboard.downAny(this.shortcutRight)) {
      playerVelocity.vx = deltaV;
      playerVelocity.vy = 0;
    } else if (this.keyboard.downAny(this.shortcutUp)) {
      playerVelocity.vx = 0;
      playerVelocity.vy = -deltaV;
    } else if (this.keyboard.downAny(this.shortcutDown)) {
      playerVelocity.vx = 0;
      playerVelocity.vy = deltaV;
    } else {
      playerVelocity.vx = 0;
      playerVelocity.vy = 0;
    }
  }
}

export {PlayerVelocitySystem};