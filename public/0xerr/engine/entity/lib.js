import {
    ENTITY_ACTIVE_NODE,
    ENTITY_TERMINAL_VIEW,
    ENTITY_HARDWARE_VIEW,
} from './keys.js';
import {ActiveComponent} from '../components/active.js';
import {CacheScope} from './cache.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {ij} from '../../injection/api.js';

class EntityLib {
  constructor(entities = ij(EntityManager)) {
    this.entities = entities;
  }
  
  activeNode() {
    return this.entities.cached(
        CacheScope.FRAME,
        ENTITY_ACTIVE_NODE,
        () => this.entities.query()
            .filter(ActiveComponent, component => component.active)
            .filter(NodeComponent)
            .lock());
  }
  
  terminalView() {
    return this.entities.cached(
        CacheScope.SCENE,
        ENTITY_TERMINAL_VIEW,
        () => this.entities.query()
            .filter(ViewComponent, component => component.type == ViewType.TERMINAL)
            .lock());
  }
  
  hardwareView() {
    return this.entities.cached(
        CacheScope.SCENE,
        ENTITY_HARDWARE_VIEW,
        () => this.entities.query()
            .filter(ViewComponent, component => component.type == ViewType.HARDWARE)
            .lock());
  }
}

export {EntityLib};