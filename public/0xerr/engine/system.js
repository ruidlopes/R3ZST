class System {
  entities() {}
  
  frameEntity(entity, delta) {}
  
  frame(delta) {
    for (const entity of this.entities()) {
      this.frameEntity(entity, delta);
    }
  }
}

export {System};