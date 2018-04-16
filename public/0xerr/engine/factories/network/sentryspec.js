import {ChipType} from '../../components/chip.js';
import {NodeType} from '../../components/node.js';
import {SentryCapabilities} from '../../components/sentry.js';
import {enumValues, mapOf} from '../../../stdlib/collections.js';

const SentrySpec = mapOf(
  NodeType.WORKSTATION, mapOf(
    ChipType.BIOS, mapOf(
      'ratio', 0.2,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID', 'OVERCLOCK'),
    ),
    ChipType.CAM, mapOf(
      'ratio', 0.2,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.2,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.MEM, mapOf(
      'ratio', 0.2,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.NIC, mapOf(
      'ratio', 0.2,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.2,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
  ),
  
  NodeType.RETSAFE_CAM, mapOf(
    ChipType.BIOS, mapOf(
      'ratio', 0.2,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID', 'OVERCLOCK'),
    ),
    ChipType.CAM, mapOf(
      'ratio', 0.2,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.2,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.MEM, mapOf(
      'ratio', 0.2,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.NIC, mapOf(
      'ratio', 0.2,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.2,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
  ),
  
  NodeType.ROUTER, mapOf(
    ChipType.BIOS, mapOf(
      'ratio', 0.4,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID', 'OVERCLOCK'),
    ),
    ChipType.CAM, mapOf(
      'ratio', 0.4,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.4,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.MEM, mapOf(
      'ratio', 0.4,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.NIC, mapOf(
      'ratio', 0.4,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.4,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
  ),
  
  NodeType.RETSAFE_CAMROUTER_L1, mapOf(
    ChipType.BIOS, mapOf(
      'ratio', 0.6,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID', 'OVERCLOCK'),
    ),
    ChipType.CAM, mapOf(
      'ratio', 0.6,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.6,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.MEM, mapOf(
      'ratio', 0.6,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.NIC, mapOf(
      'ratio', 0.6,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.6,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
  ),
  
  NodeType.DATACENTER_UNIT, mapOf(
    ChipType.BIOS, mapOf(
      'ratio', 0.8,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID', 'OVERCLOCK'),
    ),
    ChipType.CAM, mapOf(
      'ratio', 0.8,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.8,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.MEM, mapOf(
      'ratio', 0.8,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.NIC, mapOf(
      'ratio', 0.8,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.CPU, mapOf(
      'ratio', 0.8,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
  ),
  
  NodeType.CORE, mapOf(
    ChipType.BIOS, mapOf(
      'ratio', 1.0,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID', 'OVERCLOCK'),
    ),
    ChipType.CAM, mapOf(
      'ratio', 1.0,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.CPU, mapOf(
      'ratio', 1.0,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.MEM, mapOf(
      'ratio', 1.0,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.NIC, mapOf(
      'ratio', 1.0,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
    ChipType.CPU, mapOf(
      'ratio', 1.0,
      'capabilities', enumValues(SentryCapabilities, 'CHIPID'),
    ),
  ),
);

export {SentrySpec};