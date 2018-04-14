import {EventHandler} from './handler.js';

class EventManager {
  constructor() {
    this.handlers = new Map();
  }
  
  subscribe(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event).add(handler);
    return new EventHandler(event, handler, this);
  }
  
  unsubscribe(event, handler) {
    if (this.handlers.has(event)) {
      this.handlers.get(event).delete(handler);
    }
  }
  
  once(event, handler) {
    const onceHandler = (...params) => {
      const ret = handler(...params);
      this.unsubscribe(event, onceHandler);
      return ret;
    };
    this.subscribe(event, onceHandler);
  }
  
  emit(event, ...params) {
    if (!this.handlers.has(event)) {
      return;
    }
    for (const handler of this.handlers.get(event)) {
      handler(...params);
    }
  }
  
  *emitAndEval(event, ...params) {
    if (!this.handlers.has(event)) {
      return;
    }
    for (const handler of this.handlers.get(event)) {
      yield handler(...params);
    }
  }
}

export {EventManager};