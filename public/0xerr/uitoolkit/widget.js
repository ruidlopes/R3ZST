class Widget {
  constructor(scr, rect, foregroundColor, backgroundColor) {
    this.screen = scr;
    this.rect = rect;
    this.foregroundColor = foregroundColor;
    this.backgroundColor = backgroundColor;
  }
  
  measure() {}
  
  layout(rect) {
    this.rect = rect;
  }
  
  render() {}
}

export {Widget};