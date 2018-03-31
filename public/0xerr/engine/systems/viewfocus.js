import {ActiveComponent} from '../components/active.js';
import {EntityManager} from '../entity/manager.js';
import {Keyboard} from '../../observers/keyboard.js';
import {KeyShortcut} from '../../observers/keyboard/shortcut.js';
import {System} from '../system.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {ij} from '../../injection/api.js';

const VIEW_ORDER = [ViewType.HARDWARE, ViewType.TERMINAL];

class ViewFocusSystem extends System {
  constructor(
      keyboard = ij(Keyboard),
      manager = ij(EntityManager)) {
    super();
    this.keyboard = keyboard;
    this.manager = manager;
    this.shortcutNext = new KeyShortcut('TAB');
  }
  
  views() {
    return this.manager.query()
        .filter(ViewComponent)
        .collect(ActiveComponent, ViewComponent);
  }
  
  frame(delta) {
    if (this.keyboard.releasedAny(this.shortcutNext)) {
      this.next(delta);
    }
  }
  
  next(delta) {
    const views = this.views();
    const current = views.find(
        view => view.get(ActiveComponent).active);
    const currentIndex = this.indexOf(current);
    const nextIndex = (currentIndex + 1) % 2;
    const next = views.find(
        view => view.get(ViewComponent).type == VIEW_ORDER[nextIndex]);

    current.get(ActiveComponent).active = false;
    next.get(ActiveComponent).active = true;
  }
  
  indexOf(entityView) {
    return VIEW_ORDER.indexOf(entityView.get(ViewComponent).type);
  }
}

export {ViewFocusSystem};