import {EntityCache} from './cache.js';
import {EntityQuery} from './query.js';
import {ij} from '../../injection/api.js';

class EntityManager {
  constructor(cache = ij(EntityCache)) {
    this.components = new Map();
    this.ids = new Set();
    this.idCounter = 0;
    
    this.cache = cache;
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
  
  clear() {
    this.components = new Map();
    this.ids = new Set();
    this.idCounter = 0;
    this.cache.clear();
  }
  
  cached(scope, key, provider) {
    if (this.cache.has(scope, key)) {
      return this.cache.get(scope, key);
    } else {
      const query = provider();
      this.cache.set(scope, key, query);
      return query;
    }
  }
  
  query(ids) {
    return new EntityQuery(this.components, ids ? new Set(ids) : this.ids, !ids);
  }
}

export {EntityManager};