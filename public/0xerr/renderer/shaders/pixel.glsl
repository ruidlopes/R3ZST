precision mediump float;

uniform vec2 u_canvas_size;

uniform vec2 u_screen_size;
uniform float u_char_size;

uniform sampler2D u_font;
uniform sampler2D u_background;
uniform sampler2D u_foreground;

varying vec2 v_tex_coord;


vec2 lookup() {
  vec2 pixel = vec2(gl_FragCoord.x, u_canvas_size.y - gl_FragCoord.y) / u_char_size;
  return pixel / u_screen_size;
}

bool fontPixelOn() {
  return texture2D(u_font, v_tex_coord).a > 0.0;
}

void main() {
  if (fontPixelOn()) {
    gl_FragColor = texture2D(u_foreground, lookup());
  } else {
    gl_FragColor = texture2D(u_background, lookup());
  }
}