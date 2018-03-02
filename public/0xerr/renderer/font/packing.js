import {CHAR_SIZE} from './constants.js';

function unpackChar(ch) {
  return ch.map(row => {
    const collector = [];
    for (let col = 0; col < CHAR_SIZE; ++col) {
      collector.unshift(row >> col & 0x1);
    }
    return collector;
  });
}

export {unpackChar};