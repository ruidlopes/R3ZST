import {enumOf} from '../../stdlib/collections.js';

const ChipType = enumOf(
  'BIOS',
  'CPU',
  'RAM',
);

class ChipComponent {
  constructor(type) {
    this.type = type;
  }
}

export {
  ChipComponent,
  ChipType,
};