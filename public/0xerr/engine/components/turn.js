import {enumOf} from '../../stdlib/collections.js';

const TurnEnum = enumOf(
    'PLAYER',
    'RETSAFE',
);

class TurnComponent {
  constructor(turn = TurnEnum.PLAYER) {
    this.turn = turn;
  }
}

export {
  TurnComponent,
  TurnEnum,
};