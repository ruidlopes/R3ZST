import {ActiveComponent} from '../components/active.js';
import {EntityLib} from '../entity/lib.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {Keyboard} from '../../observers/keyboard.js';
import {KeyShortcut} from '../../observers/keyboard/shortcut.js';
import {System} from '../system.js';
import {ViewType} from '../components/view.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class ViewFocusSystem extends System {
  constructor(
      keyboard = ij(Keyboard),
      lib = ij(EntityLib),
      events = ij(EventManager)) {
    super();
    this.keyboard = keyboard;
    this.lib = lib;
    this.events = events;
    this.shortcutNext = new KeyShortcut('TAB');
  }
  
  hardwareViewActive() {
    return firstOf(this.lib.hardwareView().iterate(ActiveComponent))
        .get(ActiveComponent);
  }
  
  terminalViewActive() {
    return firstOf(this.lib.terminalView().iterate(ActiveComponent))
        .get(ActiveComponent);
  }
  
  frame(delta) {
    if (this.keyboard.releasedAny(this.shortcutNext)) {
      this.next(delta);
    }
  }
  
  next(delta) {
    const hardwareActive = this.hardwareViewActive();
    const status = hardwareActive.active;
    
    hardwareActive.active = !status;
    this.terminalViewActive().active = status;
    
    this.events.emit(
        EventType.VIEW_FOCUS,
        status ? ViewType.TERMINAL : ViewType.HARDWARE);
  }
}

export {ViewFocusSystem};