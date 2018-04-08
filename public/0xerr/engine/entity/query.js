import {EntityView} from './view.js';
import {ALWAYS_TRUE} from '../../stdlib/functions.js';
import {firstOf} from '../../stdlib/collections.js';

class EntityQuery {
  constructor(components, ids) {
    this.components = components;
    this.ids = ids;
  }
  
  filter(type, cond = ALWAYS_TRUE) {
    const ids = new Set();
    for (const id of this.ids) {
      const idHasType = this.components.has(type) &&
          this.components.get(type).has(id);
      if (idHasType && cond(this.components.get(type).get(id))) {
        ids.add(id);
      }
    }
    this.ids = ids;
    return this;
  }
  
  first() {
    this.ids = new Set([firstOf(this.ids)]);
    return this;
  }
  
  none() {
    this.ids = new Set();
    return this;
  }
  
  count() {
    return this.ids.size;
  }
  
  *iterate(...types) {
    for (const id of this.ids.values()) {
      yield new EntityView(id, ...this.entityView(id, ...types));
    }
  }
  
  *entityView(id, ...types) {
    for (const type of types) {
      if (this.components.has(type) && this.components.get(type).has(id)) {
        yield this.components.get(type).get(id);
      }
    }
  }
}

export {EntityQuery};