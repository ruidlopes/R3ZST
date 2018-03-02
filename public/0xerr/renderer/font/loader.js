import {Buffer} from '../graphics/buffer.js';
import {CHAR_SIZE} from './constants.js';

const FONT_ROWS = 16;
const FONT_COLS = 16;

const BYTES_PER_PIXEL = 4;
const CHAR_BYTES_PER_ROW = CHAR_SIZE * BYTES_PER_PIXEL;

const EMPTY = [0x00, 0x00, 0x00, 0x00];
const WHITE = [0xff, 0xff, 0xff, 0xff];

async function loadFontRaw(url) {
  const font = await fetch(url).then(response => response.json());
  const buffer = new Buffer(FONT_COLS * CHAR_SIZE, FONT_COLS * CHAR_SIZE, BYTES_PER_PIXEL);
  const charLineBuffer = new Uint8Array(CHAR_SIZE * BYTES_PER_PIXEL);
  
  font.forEach((bytes, i) => {
    const sx = (i & 0x0f) * CHAR_SIZE;
    const sy = (i >> 4) * CHAR_SIZE;
    
    for (let row = 0; row < CHAR_SIZE; ++row) {
      const idx = (sy + row) * (FONT_COLS * CHAR_BYTES_PER_ROW) + (sx * BYTES_PER_PIXEL);
      for (let col = 0; col < CHAR_SIZE; ++col) {
        const bit = bytes[row] >> col & 0x1;
        charLineBuffer.set(bit ? WHITE : EMPTY, (CHAR_SIZE - col - 1) * BYTES_PER_PIXEL);
      }
      buffer.data.set(charLineBuffer, idx);
    }
  });
  
  return buffer;
} 

export {loadFontRaw};