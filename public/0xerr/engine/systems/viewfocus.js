import {ActiveComponent} from '../components/active.js';
import {EntityManager} from '../entity/manager.js';
import {Keyboard} from '../../observers/keyboard.js';
import {KeyModifiers} from '../../observers/keyboard/modifiers.js';
import {KeyShortcut} from '../../observers/keyboard/shortcut.js';
import {System} from '../system.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {ij} from '../../injection/api.js';

const VIEW_ORDER = [ViewType.HARDWARE, ViewType.TERMINAL, ViewType.STATUS];

class ViewFocusSystem extends System {
  constructor(
      keyboard = ij(Keyboard),
      manager = ij(EntityManager)) {
    super();
    this.keyboard = keyboard;
    this.manager = manager;
    this.shortcutNext = new KeyShortcut('TAB');
    this.shortcutPrev = new KeyShortcut('TAB', KeyModifiers.SHIFT);
  }
  
  entities() {
    return this.manager.query()
        .filter(ViewComponent)
        .collect(ActiveComponent, ViewComponent);
  }
  
  frame(delta) {
    if (this.keyboard.releasedAny(this.shortcutNext)) {
      this.shiftView(1);
    } else if (this.keyboard.releasedAny(this.shortcutPrev)) {
      this.shiftView(-1);
    }
  }
  
  shiftView(cursor) {
    const entities = this.entities();
    const current = entities.find(
        entity => entity.get(ActiveComponent).active);
    const currentIndex = this.indexOf(current);
    const nextIndex = (currentIndex + cursor + 3) % 3;
    const next = entities.find(
        entity => entity.get(ViewComponent).type == VIEW_ORDER[nextIndex]);
    
    current.get(ActiveComponent).active = false;
    next.get(ActiveComponent).active = true;
  }
  
  indexOf(entityView) {
    return VIEW_ORDER.indexOf(entityView.get(ViewComponent).type);
  }
}

export {ViewFocusSystem};