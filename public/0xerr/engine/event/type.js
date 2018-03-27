import {enumOf} from '../../stdlib/collections.js';

const EventType = enumOf(
  'ACTION_START',
  'ACTION_DONE',
  'CONNECTED',
  'DISCONNECTED',
  'END_TURN',
  'LOG',
  'PLAYER_INSIDE_CHIP',
  'PLAYER_OUTSIDE_CHIPS',
  'BOOT',
  'STEALTH_UPDATE',
  'TEXT_INPUT',
);

export {EventType};