import {enumOf} from '../../stdlib/collections.js';

const NodeType = enumOf(
  'WORKSTATION',
  'ROUTER',
  'RETSAFE_CAM',
  'RETSAFE_CAMROUTER_L1',
  'RETSAFE_CAMROUTER_L2',
  'DATACENTER_UNIT',
  'CORE',
);

class NodeComponent {
  constructor(type) {
    this.type = type;
  }
}

export {
  NodeComponent,
  NodeType,
};