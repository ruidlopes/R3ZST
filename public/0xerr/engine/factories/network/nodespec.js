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
  
  NodeType.RETSAFE_CAMROUTER_L1, mapOf(
    ChipType.CPU, mapOf(
      'min', 1,
      'max', 4,
      'versions', enumValues(ChipCpuVersion, 'RET.ARM R64'),
    ),
    ChipType.NIC, mapOf(
      'min', 1,
      'max', 1,
      'versions', enumValues(ChipNicVersion, 'RET.NET GIGA1'),
    ),
    ChipType.BIOS, mapOf(
      'min', 1,
      'max', 1,
      'versions', enumValues(ChipBiosVersion, 'RET.UEFI SECURE1', 'RET.UEFI SECURE2'),
    ),
    ChipType.CAM, mapOf(
      'min', 10,
      'max', 20,
      'versions', enumValues(ChipCamVersion, 'RETINA PANOPTIC1', 'RETINA PANOPTIC2'),
    ),
  ),
  
  NodeType.DATACENTER_UNIT, mapOf(
    ChipType.CPU, mapOf(
      'min', 10,
      'max', 10,
      'versions', enumValues(ChipCpuVersion, 'RET.ARM 1K'),
    ),
    ChipType.NIC, mapOf(
      'min', 1,
      'max', 1,
      'versions', enumValues(ChipNicVersion, 'RET.NET FIBER1'),
    ),
    ChipType.BIOS, mapOf(
      'min', 1,
      'max', 1,
      'versions', enumValues(ChipBiosVersion, 'RET.UEFI HYPER1'),
    ),
  ),
  
  NodeType.CORE, mapOf(
    ChipType.CPU, mapOf(
      'min', 30,
      'max', 30,
      'versions', enumValues(ChipCpuVersion, 'RET.ARM 10K'),
    ),
    ChipType.NIC, mapOf(
      'min', 1,
      'max', 1,
      'versions', enumValues(ChipNicVersion, 'RET.NET FIBER1'),
    ),
    ChipType.BIOS, mapOf(
      'min', 1,
      'max', 1,
      'versions', enumValues(ChipBiosVersion, 'RET.UEFI HYPER2'),
    ),
  ),
);

export {NodeSpec};