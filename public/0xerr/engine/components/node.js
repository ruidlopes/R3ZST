import {enumOf} from '../../stdlib/collections.js';

const NodeType = enumOf(
  'POWER_SUPPLY',
  'WORKSTATION',
  'ROUTER',
  'FIREWALL',
  'RETSAFE_CAM',
  'RETSAFE_CITYWIDE',
  'RETSAFE_COUNTRYWIDE',
  'DATACENTER_UNIT',
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