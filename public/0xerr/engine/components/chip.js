import {enumOf} from '../../stdlib/collections.js';

const ChipType = enumOf(
  'BIOS',
  'CAM',
  'CPU',
  'NIC',
  'RAM',
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