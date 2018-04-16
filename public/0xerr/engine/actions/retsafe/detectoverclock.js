import {DetectTurnAction} from './lib/detectturn.js';
import {SentryCapabilities} from '../../components/sentry.js';

class DetectOverclockAction extends DetectTurnAction {
  constructor() {
    super('OVERCLOCK', SentryCapabilities.OVERCLOCK);
  }
}

export {DetectOverclockAction};