import {ALWAYS_TRUE} from '../../stdlib/functions.js';
import {EntityView} from './view.js';
import {assertEquals} from '../../stdlib/asserts.js';
import {firstOf} from '../../stdlib/collections.js';

const EntityViewTemplate = new EntityView();

class EntityQuery {
  constructor(components, ids, fastFiltering) {
    this.components = components;
    this.ids = ids;
    this.fastFiltering = fastFiltering;
  }
  
  filter(type, cond = ALWAYS_TRUE) {
    if (this.fastFiltering && cond == ALWAYS_TRUE) {
      this.fastFiltering = false;
      this.ids = new Set(this.components.get(type).keys());
      return this;
    }
    this.fastFiltering = false;
    
    const ids = new Set();
    for (const id of this.ids) {
      const idHasType = this.components.has(type) &&
          this.components.get(type).has(id);
      if (idHasType &&
          (cond == ALWAYS_TRUE || cond(this.components.get(type).get(id)))) {
        ids.add(id);
      }
    }
    this.ids = ids;
    return this;
  }
  
  count() {
    return this.ids.size;
  }
  
  head(...types) {
    const uniqueType = types[0];
    const uniqueComponents = this.components.get(uniqueType);
    assertEquals(1, uniqueComponents.size);
    
    const id = firstOf(uniqueComponents)[0];
    return EntityViewTemplate.mutate(id, this.entityView(id, types));
  }
  
  *iterate(...types) {
    for (const id of this.ids) {
      yield EntityViewTemplate.mutate(id, this.entityView(id, types));
    }
  }
  
  *entityView(id, types) {
    for (const type of types) {
      if (this.components.has(type) && this.components.get(type).has(id)) {
        yield this.components.get(type).get(id);
      }
    }
  }
}

export {EntityQuery};