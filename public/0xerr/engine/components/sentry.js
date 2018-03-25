import {enumOf} from '../../stdlib/collections.js';

const SentryCapabilities = enumOf(
  'CHIPID',
);

class SentryComponent {
  constructor(capabilities) {
    this.capabilities = new Set(capabilities);
  }
}

export {
  SentryComponent,
  SentryCapabilities,
};