import {enumOf} from '../../stdlib/collections.js';

const SentryCapabilities = enumOf(
  'CHIPID',
  'OVERCLOCK',
);

const SentryState = enumOf(
  'ACTIVE',
  'DEACTIVATED',
);

class SentryComponent {
  constructor(capabilities, state = SentryState.ACTIVE) {
    this.capabilities = new Set(capabilities);
    this.state = state;
  }
}

export {
  SentryComponent,
  SentryCapabilities,
  SentryState,
};