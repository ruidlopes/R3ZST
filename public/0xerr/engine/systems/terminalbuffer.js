import {CompositeComponent} from '../components/composite.js';
import {EntityLib} from '../entity/lib.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {System} from '../system.js';
import {TextBufferComponent} from '../components/textbuffer.js';
import {firstOf, mapOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class TerminalBufferSystem extends System {
  constructor(
      entities = ij(EntityManager),
      lib = ij(EntityLib),
      events = ij(EventManager)) {
    super();
    this.entities = entities;
    this.lib = lib;
    this.events = events;
        
    this.events.subscribe(
        EventType.LOG,
        (message, attributes) => this.log(message, attributes));
  }
  
  terminalViewChildren() {
    return firstOf(this.lib.terminalView().iterate(CompositeComponent))
        .get(CompositeComponent)
        .ids;
  }
  
  textBuffer() {
    return firstOf(this.entities.query(this.terminalViewChildren())
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