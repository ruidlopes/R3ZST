class Module {
  constructor() {
    this.classes = new Set();
    this.instances = new Set();
    
    this.classesSets = new Set();
    this.instancesSets = new Set();
    
    this.modules = new Set();
  }
  
  configure() {}
  
  configureBindings(injector) {
    this.configure();
    
    for (const params of this.classes) {
      injector.provide(...params);
    }
    for (const params of this.instances) {
      injector.provideInstance(...params);
    }
    for (const params of this.classesSets) {
      injector.provideIntoSet(...params);
    }
    for (const params of this.instancesSets) {
      injector.provideInstanceIntoSet(...params);
    }
    
    injector.install(...this.modules);
  }
  
  bindClass(...params) {
    this.classes.add(params);
  }
  
  bindClassIntoSet(...params) {
    this.classesSets.add(params);
  }
  
  bindInstance(...params) {
    this.instances.add(params);
  }
  
  bindInstanceIntoSet(...params) {
    this.instancesSets.add(params);
  }
  
  install(...modules) {
    for (const module of modules) {
      this.modules.add(module);
    }
  }
}

export {Module};