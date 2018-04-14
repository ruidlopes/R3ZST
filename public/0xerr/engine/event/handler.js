class EventHandler {
  constructor(event, handler, events) {
    this.event = event;
    this.handler = handler;
    this.events = events;
  }
  
  unsubscribe() {
    this.events.unsubscribe(this.event, this.handler);
  }
}

export {EventHandler};