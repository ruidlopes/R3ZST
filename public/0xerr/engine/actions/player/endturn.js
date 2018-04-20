import {Action, ActionType} from '../../action.js';
import {EventManager} from '../../event/manager.js';
import {EventType} from '../../event/type.js';
import {TurnEnum} from '../../components/turn.js';
import {ij} from '../../../injection/api.js';
import {setOf} from '../../../stdlib/collections.js';

class EndTurnAction extends Action {
  constructor(events = ij(EventManager)) {
    super();
    this.events = events;
    
    this.types = setOf(ActionType.GLOBAL);
    this.man = [
      'USAGE: ENDTURN',
      'ENDS THE CURRENT TURN.',
    ];
  }
  
  start() {
    this.events.emit(EventType.END_TURN, TurnEnum.PLAYER); 
  }
}

export {EndTurnAction};