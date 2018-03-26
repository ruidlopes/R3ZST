import {enumOf} from '../../stdlib/collections.js';

const ChipType = enumOf(
  'BIOS',
  'CPU',
  'RAM',
  'NIC',
);

class ChipComponent {
  constructor(type, version) {
    this.type = type;
    this.version = version;
  }
}

export {
  ChipComponent,
  ChipType,
};