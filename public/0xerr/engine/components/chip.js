import {enumOf} from '../../stdlib/collections.js';

const ChipType = enumOf(
  'BIOS',
  'CAM',
  'CPU',
  'MEM',
  'NIC',
);

const ChipBiosVersion = enumOf(
  'RET.BIOS EMBED',
  'RET.UEFI EMBED',
  'RET.UEFI SECURE1',
  'RET.UEFI HYPER1',
);

const ChipCamVersion = enumOf(
  'RETINA CAM1',
  'RETINA CAM2',
  'RETINA PANOPTIC1',
);

const ChipCpuVersion = enumOf(
  'RET.ARM R8',
  'RET.ARM R32',
  'RET.ARM R64',
  'RET.ARM 1K',
);

const ChipMemVersion = enumOf(
  'RET.MEM 1M',
  'RET.MEM 1G',
  'RET.MEM 1T',
);

const ChipNicVersion = enumOf(
  'RET.NET GIGA1',
  'RET.NET FIBER1',
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
  ChipBiosVersion,
  ChipCamVersion,
  ChipCpuVersion,
  ChipMemVersion,
  ChipNicVersion
};