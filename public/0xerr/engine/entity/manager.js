import {EntityQuery} from './query.js';

class EntityManager {
  constructor() {
    this.components = new Map();
    this.ids = new Set();
    this.idCounter = 0;
  }
  
  nextId() {
    return this.idCounter++;
  }
  
  add(id, ...components) {
    for (const component of components) {
      if (!this.components.has(component.constructor)) {
        this.components.set(component.constructor, new Map());
      }
      this.components.get(component.constructor).set(id, component);
    }
    
    if (!this.ids.has(id)) {
      this.ids.add(id);
    }
  }
  
  delete(id, component) {
    if (this.components.has(component.constructor)) {
      this.components.get(component.constructor).delete(id);
    }
  }
  
  deleteAll(id) {
    if (this.ids.has(id)) {
      for (const type of this.components.keys()) {
        if (this.components.get(type).has(id)) {
          this.components.get(type).delete(id);
        }
      }
      this.ids.delete(id);
    }
  }
  
  query(ids) {
    return new EntityQuery(this.components, new Set(ids || this.ids));
  }
}

export {EntityManager};