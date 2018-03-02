const WIDTH = 256;
const HEIGHT = 256;
const CELL_SIZE = 16;

function mat3(...values) {
  const mat = new Float32Array(9);
  mat.set(values);
  return mat;
}

function mat3_projection(width, height) {
  return mat3(
    2 / width,           0, 0,
            0, -2 / height, 0,
           -1,  1,          1);
}

function mat3_translation(tx, ty) {
  return mat3(
     1,  0, 0,
     0,  1, 0,
    tx, ty, 1);
}

function mat3_mult(a, b) {
  const a00 = a[0 * 3 + 0];
  const a01 = a[0 * 3 + 1];
  const a02 = a[0 * 3 + 2];
  const a10 = a[1 * 3 + 0];
  const a11 = a[1 * 3 + 1];
  const a12 = a[1 * 3 + 2];
  const a20 = a[2 * 3 + 0];
  const a21 = a[2 * 3 + 1];
  const a22 = a[2 * 3 + 2];
  const b00 = b[0 * 3 + 0];
  const b01 = b[0 * 3 + 1];
  const b02 = b[0 * 3 + 2];
  const b10 = b[1 * 3 + 0];
  const b11 = b[1 * 3 + 1];
  const b12 = b[1 * 3 + 2];
  const b20 = b[2 * 3 + 0];
  const b21 = b[2 * 3 + 1];
  const b22 = b[2 * 3 + 2];
  return mat3(
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22);
}


function initGl() {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  document.body.appendChild(canvas);
  document.body.appendChild(document.createElement('hr'));

  return canvas.getContext('webgl');
}

async function loadShader(gl, url, type) {
  const source = await fetch(url).then(response => response.text());
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error('Error compiling shader:\n' + gl.getShaderInfoLog(shader));
  }
  
  return shader;
}

async function initShaders(gl) {
  const vshader = await loadShader(gl, '/proto/webgl/vertex.glsl', gl.VERTEX_SHADER);
  const pshader = await loadShader(gl, '/proto/webgl/pixel.glsl', gl.FRAGMENT_SHADER);
  
  const program = gl.createProgram();
  gl.attachShader(program, vshader);
  gl.attachShader(program, pshader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('Error linking shaders:\n' + gl.getProgramInfoLog(program));
  }
  
  return program;
}

function makeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  
  const ctx = canvas.getContext('2d');
  ctx.width = 256;
  ctx.height = 256;
  for (let y = 0; y < CELL_SIZE; ++y) {
    for (let x = 0; x < CELL_SIZE; ++x) {
      const h = Math.floor(x * 360 / CELL_SIZE);
      const s = Math.floor(25 + 75 * y / CELL_SIZE);
      const hsl = `hsl(${h}, ${s}%, 50%)`;
      ctx.fillStyle = hsl;
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
  
  document.body.appendChild(canvas);
  return ctx;
}

function makeTexture2() {
  const canvas = document.createElement('canvas');
  canvas.width = 20;
  canvas.height = 20;
  
  const ctx = canvas.getContext('2d');
  ctx.width = 20;
  ctx.height = 20;
  
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.fillRect(0, 0, 20, 20);
  
  document.body.appendChild(document.createElement('hr'));
  document.body.appendChild(canvas);
  return ctx;
}

function makeMesh() {
  const rows = WIDTH / CELL_SIZE;
  const cols = HEIGHT / CELL_SIZE;
  
  const triCount = rows * cols * 2;
  const pointCount = triCount * 3;
  const coordCount = pointCount * 2;
  const tris = new Float32Array(coordCount);
  
  let i = 0;
  for (let row = 0; row < rows; ++row) {
    for (let col = 0; col < cols; ++col) {
      const p1x = col * CELL_SIZE;
      const p1y = row * CELL_SIZE;
      
      const p2x = p1x + CELL_SIZE;
      const p2y = p1y;
      
      const p3x = p1x;
      const p3y = p1y + CELL_SIZE;
      
      const p4x = p2x;
      const p4y = p3y;
      
      // tri 1 = p1 -> p2 -> p3
      tris[i++] = p1x;
      tris[i++] = p1y;
      tris[i++] = p2x;
      tris[i++] = p2y;
      tris[i++] = p3x;
      tris[i++] = p3y;
      
      // tri 2 = p2 -> p3 -> p4
      tris[i++] = p2x;
      tris[i++] = p2y;
      tris[i++] = p3x;
      tris[i++] = p3y;
      tris[i++] = p4x;
      tris[i++] = p4y;
    }
  }
  
  const trisForTex = tris.map((coord, idx) => {
    return idx % 2 == 0 ?
        coord / (WIDTH - 1) :
        coord / (HEIGHT - 1);
  });
  
  return {
    rows,
    cols,
    tris,
    trisForTex,
    triCount,
    pointCount,
  };
}

async function main() {
  const gl = initGl();
  const program = await initShaders(gl);
  
  const {rows, cols, tris, trisForTex, triCount, pointCount} = makeMesh();
  
  const texCoordLocation = gl.getAttribLocation(program, "a_tex_coord");
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, trisForTex, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
  
  const texImage = makeTexture().getImageData(0, 0, WIDTH, HEIGHT);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texImage);
  
  const texOther = makeTexture2().getImageData(0, 0, 20, 20);
  const tex2 = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex2);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texOther);
  
  gl.viewport(0, 0, WIDTH, HEIGHT);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  gl.useProgram(program);
  
  const texLocation = gl.getUniformLocation(program, "u_image");
  const tex2Location = gl.getUniformLocation(program, "u_other");
  gl.uniform1i(texLocation, 0);
  gl.uniform1i(tex2Location, 1);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, tex2);
  
  
  const positionLocation = gl.getAttribLocation(program, "a_position");
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, tris, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  
  const matrixLocation = gl.getUniformLocation(program, "u_matrix");
  const translation = [0, 0];
  const projectionMatrix = mat3_projection(WIDTH, HEIGHT);
  const translationMatrix = mat3_translation(...translation);
  const matrix = mat3_mult(projectionMatrix, translationMatrix);
  gl.uniformMatrix3fv(matrixLocation, false, matrix);
  
  gl.drawArrays(gl.TRIANGLES, 0, pointCount);
}

main();