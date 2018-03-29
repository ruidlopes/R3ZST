import {enumOf} from '../../stdlib/collections.js';

const RetCamStatus = enumOf(
  'CONNECTED',
  'DISCONNECTED',
);

class RetCamStatusComponent {
  constructor(status = RetCamStatus.CONNECTED) {
    this.status = status;
  }
}

export {
  RetCamStatusComponent,
  RetCamStatus,
};