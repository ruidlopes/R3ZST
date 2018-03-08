import {Shader} from './shader.js';
import {ij} from '../../injection/api.js';

class Program {
  constructor(gl = ij(WebGLRenderingContext)) {
    this.gl = gl;
    this.instance = null;
    this.shaders = [];
  }
  
  async loadShader(location, type) {
    const shader = new Shader(this.gl, type, location);
    await shader.load();
    this.shaders.push(shader);
  }
  
  async loadVertexShader(location) {
    return await this.loadShader(location, this.gl.VERTEX_SHADER);
  }
  
  async loadFragmentShader(location) {
    return await this.loadShader(location, this.gl.FRAGMENT_SHADER);
  }
  
  init() {
    this.instance = this.gl.createProgram();
    this.shaders.forEach(shader => shader.attachTo(this.instance));
    this.gl.linkProgram(this.instance);
    
    if (!this.gl.getProgramParameter(this.instance, this.gl.LINK_STATUS)) {
      throw new Error('Error linking shaders:\n' + this.gl.getProgramInfoLog(this.instance));
    }
  }
}

export {Program};