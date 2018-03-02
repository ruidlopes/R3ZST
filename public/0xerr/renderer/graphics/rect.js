class Rect {
  static size(width = 0, height = 0) {
    return new Rect(0, 0, width, height);
  }
  
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  
  moveTo(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  
  resize(width, height) {
    this.width = width;
    this.height = height;
    return this;
  }
  
  clone() {
    return new Rect(this.x, this.y, this.width, this.height);
  }
  
  encloses(x, y) {
    return x >= this.x &&
        y >= this.y &&
        x < this.x + this.width &&
        y < this.y + this.height;
  }
}

export {Rect};