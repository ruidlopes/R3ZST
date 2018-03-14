class StateMachine {
  constructor() {
    this.states = new Map();
    this.conditions = new Map();
    this.condKeys = undefined;
    
    this.listeners = [];
    this.current = undefined;
  }
  
  add(label, fn) {
    this.states.set(label, fn);
  }
  
  cond(cond, label) {
    this.conditions.set(cond, label);
    this.condKeys = Array.from(this.conditions.keys());
  }
  
  nocond(label) {
    this.cond(() => this.current == label, label);
  }
  
  fixed(label, fn) {
    this.add(label, fn);
    this.nocond(label);
  }
  
  onStateChange(callback) {
    this.listeners.push(callback);
  }
  
  onStateStart(label, callback) {
    this.onStateChange((oldState, newState) => {
      if (newState == label) {
        callback();
      }
    });
  }
  
  onStateEnd(label, callback) {
    this.onStateChange((oldState, newState) => {
      if (oldState == label) {
        callback();
      }
    });
  }
  
  jump(label) {
    this.current = label;
  }
  
  state(...params) {
    const cond = this.condKeys.find(cond => cond());
    if (!cond) {
      throw new Error('Invalid state');
    }
    const label = this.conditions.get(cond);
    if (this.current != label) {
      this.listeners.forEach(listener => listener(this.current, label));
      this.current = label;
    }
    return this.states.get(label)(...params);
  }
}

export {StateMachine};