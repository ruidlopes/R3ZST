import {
    ENTITY_ACTIVE_NODE,
    ENTITY_ACTIVE_NODE_CHIPS,
    ENTITY_ALL_CHIPS,
    ENTITY_TERMINAL_VIEW,
    ENTITY_HARDWARE_VIEW,
} from './keys.js';
import {ActiveComponent} from '../components/active.js';
import {ChipComponent} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {EntityCache, CacheScope} from './cache.js';
import {EntityManager} from '../entity/manager.js';
import {NodeComponent} from '../components/node.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

class EntityLib {
  constructor(
      entities = ij(EntityManager),
      cache = ij(EntityCache)) {
    this.entities = entities;
    this.cache = cache;
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
  
  activeNodeChips() {
    const ids = firstOf(this.activeNode().iterate(CompositeComponent))
        .get(CompositeComponent).ids;
    return this.entities.cached(
        CacheScope.FRAME,
        ENTITY_ACTIVE_NODE_CHIPS,
        () => this.entities.query(ids).filter(ChipComponent).lock());
  }
  
  allChips() {
    return this.entities.cached(
        CacheScope.SCENE,
        ENTITY_ALL_CHIPS,
        () => this.entities.query().filter(ChipComponent).lock());
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
  
  clearActiveNodeCache() {
    this.cache.delete(CacheScope.FRAME, ENTITY_ACTIVE_NODE);
    this.cache.delete(CacheScope.FRAME, ENTITY_ACTIVE_NODE_CHIPS);
  }
}

export {EntityLib};