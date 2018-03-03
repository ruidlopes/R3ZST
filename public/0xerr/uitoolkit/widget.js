class Widget {
  constructor(scr, rect, foregroundColor, backgroundColor) {
    this.screen = scr;
    this.rect = rect;
    this.foregroundColor = foregroundColor;
    this.backgroundColor = backgroundColor;
    this.focused = false;
  }
  
  measure() {}
  
  layout(rect) {
    this.rect = rect;
  }
  
  render() {}
  
  focus() {
    this.focused = true;
  }
  
  blur() {
    this.focused = false;
  }
}

export {Widget};