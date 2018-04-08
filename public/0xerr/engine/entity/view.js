class EntityView {
  static mapEntries(...components) {
    return components.map(component => [component.constructor, component]);
  }
  
  constructor(id, ...components) {
    this.id = id;
    this.components = new Map(EntityView.mapEntries(...components));
  }
  
  get(type) {
    return this.components.get(type);
  }
  
  mutate(id, components) {
    this.id = id;
    this.components.clear();
    for (const component of components) {
      this.components.set(component.constructor, component);
    }
    return this;
  }
}

export {EntityView};