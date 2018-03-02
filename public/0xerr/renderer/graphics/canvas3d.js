function createCanvas(width, height) {
  const dom = document.createElement('canvas');
  dom.width = width;
  dom.height = height;
  return dom;
}

function createGl(canvas) {
  const gl = canvas.getContext('webgl', {
      antialias: false,
      premultipliedAlpha: false,
  });
  gl.width = canvas.width;
  gl.height = canvas.height;
  return gl;
}

class Canvas3D {
  static fromContainer(container = document.body) {
    const props = getComputedStyle(container);
    const width = parseInt(props.width, 10);
    const height = parseInt(props.height, 10);
    return new Canvas3D(width, height, container);
  }
  
  constructor(width, height, container) {
    this.width = width;
    this.height = height;
    this.container = container;
    
    this.canvas = createCanvas(width, height);
    this.gl = createGl(this.canvas);
    
    this.attached = false;
  }
  
  attach() {
    if (!this.attached && this.container) {
      this.container.appendChild(this.canvas);
      this.attached = true;
    }
  }
  
  detach() {
    if (this.attached && this.container) {
      this.container.removeChild(this.canvas);
      this.attached = false;
    }
  }
  
  clear() {
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}

export {Canvas3D};