precision mediump float;

uniform sampler2D u_image;
uniform sampler2D u_other;

varying vec2 v_tex_coord;

void main() {
  vec4 otherColor = texture2D(u_other, vec2(0.0, 0.0));
  if (mod(ceil(gl_FragCoord.x), 8.0) == 0.0) {
    gl_FragColor = otherColor;
  } else {
    gl_FragColor = texture2D(u_image, v_tex_coord);
  }
}