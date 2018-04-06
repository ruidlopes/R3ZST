import {NodeType} from '../../components/node.js';
import {mapOf} from '../../../stdlib/collections.js';

const NetSpec = mapOf(
  NodeType.WORKSTATION, mapOf(
    'min', 5,
    'max', 10,
  ),
  
  NodeType.ROUTER, mapOf(
    'min', 3,
    'max', 5,
  ),
  
  NodeType.RETSAFE_CAM, mapOf(
    'min', 5,
    'max', 10,
  ),
  
  NodeType.RETSAFE_CAMROUTER_L1, mapOf(
    'min', 3,
    'max', 5,
  ),
  
  NodeType.DATACENTER_UNIT, mapOf(
    'min', 6,
    'max', 8,
  ),
  
  NodeType.CORE, mapOf(
    'min', 1,
    'max', 1,
  ),
);

export {NetSpec};