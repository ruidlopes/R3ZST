class Module {
  constructor() {
    this.injector = undefined;
    this.classes = new Set();
    this.instances = new Set();
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
    
    injector.install(...this.modules);
  }
  
  bindClass(...params) {
    this.classes.add(params);
  }
  
  bindInstance(...params) {
    this.instances.add(params);
  }
  
  install(...modules) {
    for (const module of modules) {
      this.modules.add(module);
    }
  }
}

export {Module};