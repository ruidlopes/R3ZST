class Texture {
  constructor(gl) {
    this.gl = gl;
    this.instance = null;
  }
  
  init() {
    this.instance = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.instance);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
  }
  
  texImage2D(buffer) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.instance);
    this.gl.texImage2D(
        this.gl.TEXTURE_2D, 0, this.gl.RGBA,
        buffer.computedWidth(),
        buffer.computedHeight(),
        0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
        buffer.data);
  }
}

export {Texture};