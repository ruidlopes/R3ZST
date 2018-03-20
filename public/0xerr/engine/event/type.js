import {enumOf} from '../../stdlib/collections.js';

const EventType = enumOf(
  'TEXT_INPUT',
  'PLAYER_INSIDE_CHIP',
  'PLAYER_OUTSIDE_CHIPS',
);

export {EventType};