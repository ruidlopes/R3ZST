import {enumOf} from '../../stdlib/collections.js';

const CacheScope = enumOf(
  'FRAME',
  'SCENE',
);

class EntityCache {
  constructor() {
    this.scoped = new Map();
  }
  
  reset(scope) {
    if (!this.scoped.has(scope)) {
      this.scoped.set(scope, new Map());
    } else {
      this.scoped.get(scope).clear();
    }
  }
  
  clear() {
    for (const scope of this.scoped.keys()) {
      this.reset(scope);
    }
  }
  
  has(scope, key) {
    return this.scoped.has(scope) &&
        this.scoped.get(scope).has(key);
  }
  
  set(scope, key, value) {
    this.scoped.get(scope).set(key, value);
  }
  
  get(scope, key) {
    return this.scoped.get(scope).get(key);
  }
  
  delete(scope, key) {
    if (this.scoped.has(scope) && this.scoped.get(scope).has(key)) {
      this.scoped.get(scope).delete(key);
    }
  }
}

export {
  EntityCache,
  CacheScope,
};