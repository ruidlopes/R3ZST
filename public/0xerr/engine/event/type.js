import {enumOf} from '../../stdlib/collections.js';

const EventType = enumOf(
  'LOG',
  'PLAYER_INSIDE_CHIP',
  'PLAYER_OUTSIDE_CHIPS',
  'TEXT_INPUT',
);

export {EventType};