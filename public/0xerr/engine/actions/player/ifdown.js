import {ChipScriptAction} from './lib/chipscript.js';
import {ChipType} from '../../components/chip.js';
import {CompositeComponent} from '../../components/composite.js';
import {ConnectionComponent} from '../../components/connection.js';
import {EventType} from '../../event/type.js';
import {firstOf} from '../../../stdlib/collections.js';

class IfDownAction extends ChipScriptAction {
  constructor() {
    super(ChipType.NIC);
    this.cycles = 2;
    
    this.man = [
      'USAGE: IFDOWN',
      'DISCONNECTS CURRENT NIC CHIP.',
    ];
  }

  connection() {
    const activeChipId = this.activeChip().id;
    return firstOf(this.entities.query()
        .filter(ConnectionComponent)
        .filter(CompositeComponent, composite => composite.ids.includes(activeChipId))
        .iterate(ConnectionComponent));
  }
  
  start() {
    this.connection().get(ConnectionComponent).connected = false;
    this.events.emit(EventType.LOG, 'NIC DISCONNECTED.');
  }
}

export {IfDownAction};