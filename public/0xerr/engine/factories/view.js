import {ActiveComponent} from '../components/active.js';
import {CompositeComponent} from '../components/composite.js';
import {EntityManager} from '../entity/manager.js';
import {SpatialComponent} from '../components/spatial.js';
import {TextBufferComponent} from '../components/textbuffer.js';
import {TextInputComponent} from '../components/textinput.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {ij} from '../../injection/api.js';

class ViewFactory {
  constructor(manager = ij(EntityManager)) {
    this.manager = manager;
  }
  
  make() {
    this.manager.add(
        this.manager.nextId(),
        new ActiveComponent(false),
        new SpatialComponent(0, 0, 0, 0),
        new ViewComponent(ViewType.HARDWARE));
    
    const terminalId = this.manager.nextId();
    this.manager.add(
        terminalId,
        new ActiveComponent(true),
        new SpatialComponent(0, 0, 0, 0),
        new ViewComponent(ViewType.TERMINAL));
    
    
    const terminalBufferId = this.manager.nextId();
    this.manager.add(
        terminalBufferId,
        new TextBufferComponent([]),
        new SpatialComponent(0, 0, 0, 0));
    
    const terminalInputId = this.manager.nextId();
    this.manager.add(
        terminalInputId,
        new ActiveComponent(false),
        new TextInputComponent('>', '', 0),
        new SpatialComponent(0, 0, 0, 0));
    
    this.manager.add(
        terminalId,
        new CompositeComponent([terminalBufferId, terminalInputId]));
    
    this.manager.add(
        this.manager.nextId(),
        new ActiveComponent(false),
        new SpatialComponent(0, 0, 0, 0),
        new ViewComponent(ViewType.STATUS));
  }
}

export {ViewFactory};