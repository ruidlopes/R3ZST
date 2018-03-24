import {Action} from '../../action.js';
import {EventManager} from '../../event/manager.js';
import {EventType} from '../../event/type.js';
import {ij} from '../../../injection/api.js';

class EndTurnAction extends Action {
  constructor(events = ij(EventManager)) {
    super();
    this.events = events;
    
    this.command = 'ENDTURN';
    this.cycles = 0;
  }
  
  start() {
    this.events.emit(EventType.END_TURN); 
  }
}

export {EndTurnAction};