class Shader {
  constructor(gl, type, location) {
    this.gl = gl;
    this.type = type;
    this.location = location;
    this.shader = null;
  }
  
  async load() {
    const source = await fetch(this.location).then(response => response.text());
    this.shader = this.gl.createShader(this.type);
    this.gl.shaderSource(this.shader, source);
    this.gl.compileShader(this.shader);

    if (!this.gl.getShaderParameter(this.shader, this.gl.COMPILE_STATUS)) {
      throw new Error('Error compiling shader:\n' + this.gl.getShaderInfoLog(this.shader));
    }
  }
  
  attachTo(program) {
    this.gl.attachShader(program, this.shader);
  }
}

export {Shader};