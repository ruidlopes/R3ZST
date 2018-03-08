import {DEFAULT_QUALIFIER} from './qualifiers.js';
import {ClassInstancer, InstanceInstancer} from './instancers.js';

class Injector {
  constructor() {
    this.keys = new Map();
    
    this.bindings = new Map();
    this.instances = new Map();
    
    this.setBindings = new Map();
    this.setInstances = new Map();
    
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
  
  getSetInstance(type, qualifier = DEFAULT_QUALIFIER) {
    return this.getSetInstanceForKey(this.keyFor(type, qualifier));
  }
  
  getSetInstanceForKey(key) {
    if (!this.setInstances.has(key)) {
      this.setInstances.set(key, new Set());
      for (const entry of this.setBindings.get(key)) {
        this.setInstances.get(key).add(entry.instance());
      }
    }
    return this.setInstances.get(key);
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
  
  provideIntoSet(type, ...params) {
    const qualifier = params.length == 2 ? params[0] : DEFAULT_QUALIFIER;
    const clazz = params.length == 2 ? params[1] : params[0];
    this.provideIntoSetForKey(this.keyFor(type, qualifier), new ClassInstancer(clazz));
  }
  
  provideInstanceIntoSet(type, ...params) {
    const qualifier = params.length == 2 ? params[0] : DEFAULT_QUALIFIER;
    const clazz = params.length == 2 ? params[1] : params[0];
    this.provideIntoSetForKey(this.keyFor(type, qualifier), new InstanceInstancer(clazz));
  }
  
  provideIntoSetForKey(key, instancer) {
    if (!this.setBindings.has(key)) {
      this.setBindings.set(key, new Set());
    }
    this.setBindings.get(key).add(instancer);
  }
}

export {Injector};