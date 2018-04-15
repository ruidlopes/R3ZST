import {ENTITY_ACTIVE_NODE} from './keys.js';
import {ActiveComponent} from '../components/active.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {ij} from '../../injection/api.js';

class EntityLib {
  constructor(entities = ij(EntityManager)) {
    this.entities = entities;
  }
  
  activeNode() {
    return this.entities.cached(
        ENTITY_ACTIVE_NODE,
        () => this.entities.query()
            .filter(ActiveComponent, component => component.active)
            .filter(NodeComponent)
            .lock());
  }
}

export {EntityLib};