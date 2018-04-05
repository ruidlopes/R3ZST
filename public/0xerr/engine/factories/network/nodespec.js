import {
    ChipType,
    ChipBiosVersion,
    ChipCamVersion,
    ChipCpuVersion,
    ChipNicVersion,
} from '../../components/chip.js';
import {NodeType} from '../../components/node.js';
import {enumValues, mapOf} from '../../../stdlib/collections.js';

const NodeSpec = mapOf(
  NodeType.WORKSTATION, mapOf(
    ChipType.CPU, mapOf(
      'min', 1,
      'max', 2,
      'versions', enumValues(ChipCpuVersion, 'RET.ARM R32', 'RET.ARM R64'),
    ),
    ChipType.NIC, mapOf(
      'min', 1,
      'max', 1,
      'versions', enumValues(ChipNicVersion, 'RET.NET GIGA1'),
    ),
    ChipType.BIOS, mapOf(
      'min', 1,
      'max', 1,
      'versions', enumValues(ChipBiosVersion, 'RET.BIOS EMBED', 'RET.UEFI EMBED'),
    ),
  ),
  
  NodeType.RETSAFE_CAM, mapOf(
    ChipType.CPU, mapOf(
      'min', 1,
      'max', 1,
      'versions', enumValues(ChipCpuVersion, 'RET.ARM R8'),
    ),
    ChipType.NIC, mapOf(
      'min', 1,
      'max', 1,
      'versions', enumValues(ChipNicVersion, 'RET.NET GIGA1'),
    ),
    ChipType.BIOS, mapOf(
      'min', 1,
      'max', 1,
      'versions', enumValues(ChipBiosVersion, 'RET.BIOS EMBED', 'RET.UEFI EMBED'),
    ),
    ChipType.CAM, mapOf(
      'min', 1,
      'max', 4,
      'versions', enumValues(ChipCamVersion, 'RETINA CAM1', 'RETINA CAM2', 'RETINA PANOPTIC1'),
    ),
  ),
  
  NodeType.ROUTER, mapOf(
    ChipType.CPU, mapOf(
      'min', 1,
      'max', 1,
      'versions', enumValues(ChipCpuVersion, 'RET.ARM R32', 'RET.ARM R64'),
    ),
    ChipType.NIC, mapOf(
      'min', 1,
      'max', 1,
      'versions', enumValues(ChipNicVersion, 'RET.NET GIGA1'),
    ),
    ChipType.BIOS, mapOf(
      'min', 1,
      'max', 1,
      'versions', enumValues(ChipBiosVersion, 'RET.BIOS EMBED', 'RET.UEFI EMBED'),
    ),
  ),
);

export {NodeSpec};