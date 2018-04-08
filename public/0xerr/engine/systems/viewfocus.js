import {ActiveComponent} from '../components/active.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {Keyboard} from '../../observers/keyboard.js';
import {KeyShortcut} from '../../observers/keyboard/shortcut.js';
import {System} from '../system.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class ViewFocusSystem extends System {
  constructor(
      keyboard = ij(Keyboard),
      entities = ij(EntityManager),
      events = ij(EventManager)) {
    super();
    this.keyboard = keyboard;
    this.entities = entities;
    this.events = events;
    this.shortcutNext = new KeyShortcut('TAB');
  }
  
  view(type) {
    return firstOf(this.entities.query()
        .filter(ViewComponent, view => view.type == type)
        .iterate(ViewComponent, ActiveComponent));
  }
  
  isHardwareViewActive() {
    return this.entities.query()
        .filter(ViewComponent, view => view.type == ViewType.HARDWARE)
        .filter(ActiveComponent, component => component.active)
        .count() == 1;
  }
  
  frame(delta) {
    if (this.keyboard.releasedAny(this.shortcutNext)) {
      this.next(delta);
    }
  }
  
  next(delta) {
    const hardwareActive = this.isHardwareViewActive();
    this.view(ViewType.HARDWARE).get(ActiveComponent).active = !hardwareActive;
    this.view(ViewType.TERMINAL).get(ActiveComponent).active = hardwareActive;
    this.events.emit(
        EventType.VIEW_FOCUS,
        hardwareActive ? ViewType.TERMINAL : ViewType.HARDWARE);
  }
}

export {ViewFocusSystem};