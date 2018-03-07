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
}

export {EntityView};