import {ChipType} from '../../components/chip.js';
import {NodeType} from '../../components/node.js';
import {enumValues, mapOf} from '../../../stdlib/collections.js';

const SentrySpec = mapOf(
  NodeType.WORKSTATION, mapOf(
    ChipType.BIOS, mapOf(
      'ratio', 0.2,
    ),
    ChipType.CAM, mapOf(
      'ratio', 0.2,
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.2,
    ),
    ChipType.MEM, mapOf(
      'ratio', 0.2,
    ),
    ChipType.NIC, mapOf(
      'ratio', 0.2,
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.2,
    ),
  ),
  
  NodeType.RETSAFE_CAM, mapOf(
    ChipType.BIOS, mapOf(
      'ratio', 0.2,
    ),
    ChipType.CAM, mapOf(
      'ratio', 0.2,
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.2,
    ),
    ChipType.MEM, mapOf(
      'ratio', 0.2,
    ),
    ChipType.NIC, mapOf(
      'ratio', 0.2,
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.2,
    ),
  ),
  
  NodeType.ROUTER, mapOf(
    ChipType.BIOS, mapOf(
      'ratio', 0.4,
    ),
    ChipType.CAM, mapOf(
      'ratio', 0.4,
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.4,
    ),
    ChipType.MEM, mapOf(
      'ratio', 0.4,
    ),
    ChipType.NIC, mapOf(
      'ratio', 0.4,
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.4,
    ),
  ),
  
  NodeType.RETSAFE_CAMROUTER_L1, mapOf(
    ChipType.BIOS, mapOf(
      'ratio', 0.6,
    ),
    ChipType.CAM, mapOf(
      'ratio', 0.6,
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.6,
    ),
    ChipType.MEM, mapOf(
      'ratio', 0.6,
    ),
    ChipType.NIC, mapOf(
      'ratio', 0.6,
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.6,
    ),
  ),
  
  NodeType.DATACENTER_UNIT, mapOf(
    ChipType.BIOS, mapOf(
      'ratio', 0.8,
    ),
    ChipType.CAM, mapOf(
      'ratio', 0.8,
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.8,
    ),
    ChipType.MEM, mapOf(
      'ratio', 0.8,
    ),
    ChipType.NIC, mapOf(
      'ratio', 0.8,
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.8,
    ),
  ),
  
  NodeType.CORE, mapOf(
    ChipType.BIOS, mapOf(
      'ratio', 1.0,
    ),
    ChipType.CAM, mapOf(
      'ratio', 1.0,
    ),
    ChipType.CPU, mapOf(
      'ratio', 1.0,
    ),
    ChipType.MEM, mapOf(
      'ratio', 1.0,
    ),
    ChipType.NIC, mapOf(
      'ratio', 1.0,
    ),
    ChipType.CPU, mapOf(
      'ratio', 1.0,
    ),
  ),
);

export {SentrySpec};