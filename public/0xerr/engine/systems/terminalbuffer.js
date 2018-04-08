import {CompositeComponent} from '../components/composite.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {System} from '../system.js';
import {TextBufferComponent} from '../components/textbuffer.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {firstOf, mapOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class TerminalBufferSystem extends System {
  constructor(
      manager = ij(EntityManager),
      events = ij(EventManager)) {
    super();
    this.manager = manager;
    this.events = events;
        
    this.events.subscribe(
        EventType.LOG,
        (message, attributes) => this.log(message, attributes));
  }
  
  terminalViewChildren() {
    return firstOf(this.manager.query()
        .filter(ViewComponent, view => view.type == ViewType.TERMINAL)
        .iterate(CompositeComponent))
        .get(CompositeComponent)
        .ids;
  }
  
  textBuffer() {
    return firstOf(this.manager.query(this.terminalViewChildren())
        .filter(TextBufferComponent)
        .iterate(TextBufferComponent))
        .get(TextBufferComponent);
  }
  
  log(message, attributes = new Map()) {
    this.textBuffer().buffer.push(mapOf(
        'message', message.toUpperCase(),
        'attributes', attributes,
    ));
    
  }
}

export {TerminalBufferSystem};