import {hline, vline, putCxel} from './drawing.js';

const BoxType = {
  OUTER: Symbol(),
  SINGLE: Symbol(),
  DOUBLE: Symbol(),
};

const BoxChars = {
  [BoxType.OUTER]: [0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87],
  [BoxType.SINGLE]: [0xda, 0xbf, 0xd9, 0xc0, 0xc4, 0xb3, 0xc4, 0xb3],
  [BoxType.DOUBLE]: [0xc9, 0xbb, 0xbc, 0xc8, 0xcd, 0xba, 0xcd, 0xba],
};

function box(buffer, x, y, width, height, type, foregroundColor, backgroundColor, clipping) {
  boxWithChars(buffer, x, y, width, height, BoxChars[type], foregroundColor, backgroundColor, clipping);
}

function boxPtr(ptr, width, height, type, foregroundColor, backgroundColor, clipping) {
  box(ptr.buffer, ptr.x, ptr.y, width, height, type, foregroundColor, backgroundColor, clipping);
}

function boxWithChars(buffer, x, y, width, height, chars, foregroundColor, backgroundColor, clipping) {
  // top
  putCxel(buffer, x, y, chars[0], foregroundColor, backgroundColor, clipping);
  hline(buffer, x + 1, y, width - 2, chars[4], foregroundColor, backgroundColor, clipping);
  putCxel(buffer, x + width - 1, y, chars[1], foregroundColor, backgroundColor, clipping);
  
  // left
  vline(buffer, x, y + 1, height - 2, chars[7], foregroundColor, backgroundColor, clipping);
  
  // right
  vline(buffer, x + width - 1, y + 1, height - 2, chars[5], foregroundColor, backgroundColor, clipping);
  
  // bottom
  putCxel(buffer, x, y + height - 1, chars[3], foregroundColor, backgroundColor, clipping);
  hline(buffer, x + 1, y + height - 1, width - 2, chars[6], foregroundColor, backgroundColor, clipping);
  putCxel(buffer, x + width - 1, y + height - 1, chars[2], foregroundColor, backgroundColor, clipping);
}

export {
  BoxType,
  box,
  boxPtr,
  boxWithChars,
};