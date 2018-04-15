import {DetectTurnAction} from './lib/detectturn.js';
import {SentryCapabilities} from '../../components/sentry.js';

class DetectChipIdAction extends DetectTurnAction {
  constructor() {
    super('CHIPID', SentryCapabilities.CHIPID);
  }
}

export {DetectChipIdAction};