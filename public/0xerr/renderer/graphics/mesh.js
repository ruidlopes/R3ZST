class Mesh {
  constructor(rows = 0, cols = 0, cellSize = 0) {
    this.rows = rows;
    this.cols = cols;
    this.cellSize = cellSize;
    this.points = new Float32Array(this.coordCount())
  }
  
  triangleCount() {
    return this.rows * this.cols * 2;
  }
  
  pointCount() {
    return this.triangleCount() * 3;
  }
  
  coordCount() {
    return this.pointCount() * 2;
  }
  
  resize(cols, rows, cellSize) {
    if (this.rows != rows || this.cols != cols || this.cellSize != cellSize) {
      this.rows = rows;
      this.cols = cols;
      this.cellSize = cellSize;
      this.points = new Float32Array(this.coordCount());
      this.make();
    }
  }
  
  make() {
    let i = 0;
    for (let row = 0; row < this.rows; ++row) {
      for (let col = 0; col < this.cols; ++col) {
        const p1x = col * this.cellSize;
        const p1y = row * this.cellSize;

        const p2x = p1x + this.cellSize;
        const p2y = p1y;

        const p3x = p1x;
        const p3y = p1y + this.cellSize;

        const p4x = p2x;
        const p4y = p3y;

        // tri 1 = p1 -> p2 -> p3
        this.points[i++] = p1x;
        this.points[i++] = p1y;
        this.points[i++] = p2x;
        this.points[i++] = p2y;
        this.points[i++] = p3x;
        this.points[i++] = p3y;

        // tri 2 = p2 -> p3 -> p4
        this.points[i++] = p2x;
        this.points[i++] = p2y;
        this.points[i++] = p3x;
        this.points[i++] = p3y;
        this.points[i++] = p4x;
        this.points[i++] = p4y;
      }
    }
  }
}

export {Mesh};