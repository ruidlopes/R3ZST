import {DEFAULT_QUALIFIER} from './qualifiers.js';
import {ClassInstancer, InstanceInstancer} from './instancers.js';

class Injector {
  constructor() {
    this.keys = new Map();
    this.bindings = new Map();
    this.instances = new Map();
    
    this.provideInstance(Injector, this);
  }
  
  install(...modules) {
    for (const module of modules) {
      module.configureBindings(this);
    }
  }
  
  keyFor(type, qualifier) {
    if (!this.keys.has(type)) {
      this.keys.set(type, new Map());
    }
    if (!this.keys.get(type).has(qualifier)) {
      this.keys.get(type).set(qualifier, Symbol());
    }
    return this.keys.get(type).get(qualifier);
  }
  
  getInstance(type, qualifier = DEFAULT_QUALIFIER) {
    return this.getInstanceForKey(this.keyFor(type, qualifier));
  }
  
  getInstanceForKey(key) {
    if (!this.instances.has(key)) {
      this.instances.set(key, this.bindings.get(key).instance());
    }
    return this.instances.get(key);
  }
  
  provide(type, qualifier = DEFAULT_QUALIFIER) {
    this.provideForKey(
        this.keyFor(type, qualifier),
        new ClassInstancer(type));
  }
  
  provideInstance(type, ...params) {
    const qualifier = params.length == 2 ? params[0] : DEFAULT_QUALIFIER;
    const instance = params.length == 2 ? params[1] : params[0];
    this.provideForKey(
        this.keyFor(type, qualifier),
        new InstanceInstancer(instance));
  }
  
  provideForKey(key, instancer) {
    this.bindings.set(key, instancer);
  }
}

export {Injector};