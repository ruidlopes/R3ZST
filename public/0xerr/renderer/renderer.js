import {BLACK} from '../engine/common/palette.js';
import {CHAR_SIZE} from './font/constants.js';
import {Canvas3D} from './graphics/canvas3d.js';
import {Mesh} from './graphics/mesh.js';
import {Program} from './graphics/program.js';
import {Texture} from './graphics/texture.js';
import {loadFontRaw} from './font/loader.js';
import {ij} from '../injection/api.js';
import {mat3} from './graphics/mat3.js';

class Renderer {
  constructor(
      canvas = ij(Canvas3D),
      gl = ij(WebGLRenderingContext),
      program = ij(Program)) {
    this.dom = canvas;
    this.gl = gl;
    this.program = program;
    
    this.mesh = new Mesh();
    
    this.fontTexture = new Texture(this.gl);
    this.fontBuffer = undefined;
    this.backgroundTexture = new Texture(this.gl);
    this.foregroundTexture = new Texture(this.gl);
    
    this.fontTexCoordLoc = undefined;
    this.fontTexCoords = undefined;
    this.fontMeshBuffer = undefined;
    
    this.canvasSizeLoc = undefined;
    this.screenSizeLoc = undefined;
    this.charSizeLoc = undefined;
    this.fontLoc = undefined;
    this.backgroundLoc = undefined;
    this.foregroundLoc = undefined;
    
    this.positionLoc = undefined;
    this.positionBuffer = undefined;
    
    this.matrixLoc = undefined;
    this.matrix = undefined;
        
    this.clearColor = [
        BLACK.rgb.r / 255,
        BLACK.rgb.g / 255,
        BLACK.rgb.b / 255,
    ];
  }
  
  attach() {
    this.dom.attach();
  }
  
  async init() {
    const [fontBuffer, vs, ps] = await Promise.all([
      loadFontRaw('/0xerr/assets/fonts/12x12-2.json'),
      this.program.loadVertexShader('/0xerr/renderer/shaders/vertex.glsl'),
      this.program.loadFragmentShader('/0xerr/renderer/shaders/pixel.glsl'),
    ]);
    this.fontBuffer = fontBuffer;
    this.fontTexture.init();
    this.backgroundTexture.init();
    this.foregroundTexture.init();
    this.program.init();
    
    this.fontTexCoordLoc = this.gl.getAttribLocation(this.program.instance, "a_tex_coord");
    this.fontMeshBuffer = this.gl.createBuffer();
    
    this.canvasSizeLoc = this.gl.getUniformLocation(this.program.instance, "u_canvas_size");
    this.screenSizeLoc = this.gl.getUniformLocation(this.program.instance, "u_screen_size");
    this.charSizeLoc = this.gl.getUniformLocation(this.program.instance, "u_char_size");
    this.fontLoc = this.gl.getUniformLocation(this.program.instance, "u_font");
    this.backgroundLoc = this.gl.getUniformLocation(this.program.instance, "u_background");
    this.foregroundLoc = this.gl.getUniformLocation(this.program.instance, "u_foreground");
    
    this.positionLoc = this.gl.getAttribLocation(this.program.instance, "a_position");
    this.positionBuffer = this.gl.createBuffer();
    
    this.matrixLoc = this.gl.getUniformLocation(this.program.instance, "u_matrix");
    this.matrix = mat3.projection(this.dom.width, this.dom.height);
  }
  
  clear() {
    this.dom.clear();
  }
  
  resize(width, height) {
    const dprWidth = width * (window.devicePixelRatio || 1);
    const dprHeight = height * (window.devicePixelRatio || 1)
    const cw = this.gl.canvas.width;
    const ch = this.gl.canvas.height;
    const willResize = cw != width || ch != height;
    
    if (willResize) {
      this.gl.canvas.style.width = width + 'px';
      this.gl.canvas.style.height = height + 'px';
      this.gl.canvas.width = dprWidth;
      this.gl.canvas.height = dprHeight;
      
      this.dom.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
      this.matrix = mat3.projection(this.dom.width, this.dom.height);
    }
    
    if (willResize || !this.fontTexCoords) {
      const cols = Math.floor(cw / CHAR_SIZE);
      const rows = Math.floor(ch / CHAR_SIZE);
      this.mesh.resize(cols, rows, CHAR_SIZE);
      this.fontTexCoords = new Float32Array(this.mesh.coordCount());
    }
  }
  
  renderScreen(scr) {
    this.gl.clearColor(...this.clearColor, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    
    this.gl.useProgram(this.program.instance);
    this.prepareCharacterTexture(scr);
    this.prepareBackgroundTexture(scr);
    this.prepareForegroundTexture(scr);
    this.renderMesh(scr);
  }
  
  prepareCharacterTexture(scr) {
    const widthFactor = CHAR_SIZE / this.fontBuffer.computedWidth();
    const heightFactor = CHAR_SIZE / this.fontBuffer.computedHeight();
    
    const charCount = scr.width * scr.height;
    for (let offset = 0, i = 0; offset < charCount; ++offset) {
      const char = scr.charByOffset(offset);
      const col = char & 0x0f;
      const row = char >> 4;

      const p1x = col * widthFactor;
      const p1y = row * heightFactor;

      const p2x = p1x + widthFactor;
      const p2y = p1y;

      const p3x = p1x;
      const p3y = p1y + heightFactor;

      const p4x = p2x;
      const p4y = p3y;

      // tri 1 = p1 -> p2 -> p3
      this.fontTexCoords[i++] = p1x;
      this.fontTexCoords[i++] = p1y;
      this.fontTexCoords[i++] = p2x;
      this.fontTexCoords[i++] = p2y;
      this.fontTexCoords[i++] = p3x;
      this.fontTexCoords[i++] = p3y;

      // tri 2 = p2 -> p3 -> p4
      this.fontTexCoords[i++] = p2x;
      this.fontTexCoords[i++] = p2y;
      this.fontTexCoords[i++] = p3x;
      this.fontTexCoords[i++] = p3y;
      this.fontTexCoords[i++] = p4x;
      this.fontTexCoords[i++] = p4y;
    }
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.fontMeshBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.fontTexCoords, this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(this.fontTexCoordLoc);
    this.gl.vertexAttribPointer(this.fontTexCoordLoc, 2, this.gl.FLOAT, false, 0, 0);
    this.fontTexture.texImage2D(this.fontBuffer);
  }
  
  prepareBackgroundTexture(scr) {
    this.backgroundTexture.texImage2D(scr.background);
  }
  
  prepareForegroundTexture(scr) {
    this.foregroundTexture.texImage2D(scr.foreground);
  }
  
  renderMesh(s) {
    this.gl.uniform2f(this.canvasSizeLoc, this.gl.width, this.gl.height);
    this.gl.uniform2f(this.screenSizeLoc, s.background.textureWidth, s.background.textureHeight);
    this.gl.uniform1f(this.charSizeLoc, CHAR_SIZE);
    
    this.gl.uniform1i(this.fontLoc, 0);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.fontTexture.instance);
    
    this.gl.uniform1i(this.backgroundLoc, 1);
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.backgroundTexture.instance);
    
    this.gl.uniform1i(this.foregroundLoc, 2);
    this.gl.activeTexture(this.gl.TEXTURE2);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.foregroundTexture.instance);
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.mesh.points, this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(this.positionLoc);
    this.gl.vertexAttribPointer(this.positionLoc, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.uniformMatrix3fv(this.matrixLoc, false, this.matrix);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.mesh.pointCount());
  }
}

export {Renderer};