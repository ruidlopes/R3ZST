import {enumOf} from '../../stdlib/collections.js';

const EventType = enumOf(
  'ACTION_START',
  'ACTION_DONE',
  'DISCONNECTED',
  'END_TURN',
  'LOG',
  'PLAYER_INSIDE_CHIP',
  'PLAYER_OUTSIDE_CHIPS',
  'STEALTH_UPDATE',
  'TEXT_INPUT',
);

export {EventType};