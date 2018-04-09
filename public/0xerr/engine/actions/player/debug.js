import {PLAYER} from '../qualifiers.js';
import {Action, ActionRefreshEnum} from '../../action.js';
import {ActiveComponent} from '../../components/active.js';
import {ChipComponent, ChipType} from '../../components/chip.js';
import {CompositeComponent} from '../../components/composite.js';
import {ConnectionComponent} from '../../components/connection.js';
import {DeckComponent} from '../../components/deck.js';
import {EntityManager} from '../../entity/manager.js';
import {EventManager} from '../../event/manager.js';
import {EventType} from '../../event/type.js';
import {IpComponent} from '../../components/ip.js';
import {NodeComponent, NodeType} from '../../components/node.js';
import {RetCamStatusComponent, RetCamStatus} from '../../components/retcamstatus.js';
import {SentryComponent, SentryCapabilities} from '../../components/sentry.js';
import {SpatialComponent} from '../../components/spatial.js';
import {StealthComponent} from '../../components/stealth.js';
import {VisitedComponent} from '../../components/visited.js';
import {enumHas, enumLabel, enumOf, enumValue, firstOf} from '../../../stdlib/collections.js';
import {ij, ijmap} from '../../../injection/api.js';

const DebugDirectives = enumOf(
    'CAMERAS',
    'CHIP',
    'CONNECTIONS',
    'DECK',
    'NODE',
    'PLAYER',
    'SENTRIES',
    'VISIT',
);

class DebugAction extends Action {
  constructor(
      entities = ij(EntityManager),
      events = ij(EventManager),
      actions = ijmap(Action, PLAYER)) {
    super();
    this.entities = entities;
    this.events = events;
    this.actions = actions;
    
    this.cycles = 0;
    this.hidden = true;
  }
  
  constraints(directive, ...params) {
    if (!directive) {
      this.events.emit(
          EventType.LOG, 'MISSING DEBUG DIRECTIVE.');
      return false;
    }
    if (!enumHas(DebugDirectives, directive)) {
      this.events.emit(
          EventType.LOG, 'DEBUG DIRECTIVE UNKNOWN.');
    }
    return true;
  }
  
  start(directive, ...params) {
    switch (enumValue(DebugDirectives, directive)) {
      case DebugDirectives.CAMERAS:
        this.debugCameras();
        break;
      case DebugDirectives.CHIP:
        this.debugChip();
        break;
      case DebugDirectives.CONNECTIONS:
        this.debugConnections();
        break;
      case DebugDirectives.DECK:
        this.debugDeck();
        break;
      case DebugDirectives.NODE:
        this.debugNode();
        break;
      case DebugDirectives.PLAYER:
        this.debugPlayer();
        break;
      case DebugDirectives.SENTRIES:
        this.debugSentries();
        break;
      case DebugDirectives.VISIT:
        this.debugVisit();
        break;
    }
  }
  
  debugCameras() {
    const query = this.entities.query()
        .filter(ChipComponent, chip => chip.type == ChipType.CAM);
    
    const total = query.count();
    this.events.emit(
        EventType.LOG, `TOTAL CAMERAS: ${total}`);
    
    for (const [key, value] of Object.entries(RetCamStatus)) {
      const totalStatus = this.entities.query(query.ids)
          .filter(RetCamStatusComponent, cam => cam.status == value)
          .count();
      this.events.emit(
          EventType.LOG, `TOTAL ${key} CAMERAS: ${totalStatus}`);
    }
  }
  
  debugChip() {
    const chip = firstOf(this.entities.query()
        .filter(ChipComponent)
        .filter(ActiveComponent, component => component.active)
        .iterate(ChipComponent, SpatialComponent));
    
    if (!chip) {
      this.events.emit(
          EventType.LOG, 'NO ACTIVE CHIP IN RANGE.');
      return;
    }
    
    const spatial = chip.get(SpatialComponent);
    const x = spatial.x.toFixed(2);
    const y = spatial.y.toFixed(2);
    this.events.emit(
        EventType.LOG, `@ ${x}, ${y} (${spatial.width}, ${spatial.height})`);
  }
  
  debugConnections() {
    const connections = this.entities.query()
        .filter(ConnectionComponent)
        .iterate(CompositeComponent);
    
    for (const connection of connections) {
      const [nic1, nic2] = connection.get(CompositeComponent).ids;
      const ip1 = firstOf(this.entities.query([nic1])
          .iterate(IpComponent))
          .get(IpComponent)
          .ip.join('.');
      const ip2 = firstOf(this.entities.query([nic2])
          .iterate(IpComponent))
          .get(IpComponent)
          .ip.join('.');
      this.events.emit(
          EventType.LOG, `${ip1} -> ${ip2}`);
    }
  }
  
  debugDeck() {
    const deck = firstOf(this.entities.query()
        .filter(DeckComponent)
        .iterate(DeckComponent))
        .get(DeckComponent);
    
    for (const [key, stats] of deck.items.entries()) {
      const action = this.actions.get(key);
      if (action.hidden) {
        continue;
      }
      
      const refresh = stats == Infinity ?
          'N/A' :
          enumLabel(ActionRefreshEnum, action.refresh);
      const count = stats == Infinity ? 'UNLIMITED' : String(stats);
      const cycles = String(action.cycles);
      
      this.events.emit(
          EventType.LOG,
          `${key} (REFRESH: ${refresh}, COUNT: ${count}, CYCLES: ${cycles})`);
    }
  }
  
  debugNode() {
    const activeNode = firstOf(this.entities.query()
        .filter(NodeComponent)
        .filter(ActiveComponent, component => component.active)
        .iterate(NodeComponent, SpatialComponent));
    
    const type = enumLabel(NodeType, activeNode.get(NodeComponent).type);
    this.events.emit(
        EventType.LOG, `TYPE: ${type}`);
    
    const spatial = activeNode.get(SpatialComponent);
    const x = spatial.x.toFixed(2);
    const y = spatial.y.toFixed(2);
    this.events.emit(
        EventType.LOG, `@ ${x}, ${y} (${spatial.width}, ${spatial.height})`);
  }
  
  debugPlayer() {
    const playerSpatial = firstOf(this.entities.query()
        .filter(StealthComponent)
        .iterate(SpatialComponent))
        .get(SpatialComponent);

    const x = playerSpatial.x.toFixed(2);
    const y = playerSpatial.y.toFixed(2);
    this.events.emit(EventType.LOG,`@ ${x}, ${y}`);
  }
  
  debugSentries() {
    const sentries = this.entities.query()
        .filter(SentryComponent)
        .iterate(SentryComponent);
    
    for (const sentry of sentries) {
      const id = sentry.id;
      const caps = sentry.get(SentryComponent).capabilities;
      let capsArray = [];
      for (const cap of caps) {
        capsArray.push(enumLabel(SentryCapabilities, cap));
      }
      const capsStr = capsArray.join(', ');
      this.events.emit(
          EventType.LOG,
          `SENTRY ${id}: ${capsStr}`);
    }
  }
  
  debugVisit() {
    const visited = firstOf(this.entities.query()
        .filter(NodeComponent)
        .filter(ActiveComponent, component => component.active)
        .iterate(VisitedComponent))
        .get(VisitedComponent);
    
    for (let y = 0; y < visited.cells.length; ++y) {
      visited.cells[y].fill(1.0);
    }
  }
}

export {DebugAction};