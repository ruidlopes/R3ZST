import {enumOf} from '../../stdlib/collections.js';

const EventType = enumOf(
  'ACTION_START',
  'ACTION_DONE',
  'BOOT',
  'CONNECTED',
  'DISCONNECTED',
  'END_TURN',
  'LOG',
  'NODE',
  'PLAYER_INSIDE_CHIP',
  'PLAYER_OUTSIDE_CHIPS',
  'STEALTH_UPDATE',
  'TEXT_INPUT',
  'VICTORY',
  'VIEW_FOCUS',
);

export {EventType};