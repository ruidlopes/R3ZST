class ClassInstancer {
  constructor(clazz) {
    this.clazz = clazz;
  }
  
  instance() {
    return new this.clazz;
  }
}

class InstanceInstancer {
  constructor(instance) {
    this.inst = instance;
  }
  
  instance() {
    return this.inst;
  }
}

export {
  ClassInstancer,
  InstanceInstancer,
};