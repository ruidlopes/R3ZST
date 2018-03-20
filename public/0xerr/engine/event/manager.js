class EventManager {
  constructor() {
    this.handlers = new Map();
  }
  
  subscribe(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event).add(handler);
  }
  
  unsubscribe(event, handler) {
    if (this.handlers.has(event)) {
      this.handlers.get(event).delete(handler);
    }
  }
  
  emit(event, ...params) {
    if (!this.handlers.has(event)) {
      return;
    }
    for (const handler of this.handlers.get(event)) {
      handler(...params);
    }
  }
}

export {EventManager};