import {RNG_FX} from '../common/randomchannels.js';
import {CxelBuffer} from '../../renderer/cxel/buffer.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {EventManager} from '../event/manager.js';
import {EventType} from '../event/type.js';
import {Random} from '../../stdlib/random.js';
import {SpatialComponent} from '../components/spatial.js';
import {System} from '../system.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {firstOf, shuffle} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';
import {memblt} from '../../renderer/cxel/mem.js';

const SPEED = 2.5 / 1000;

class NodeTransitionSystem extends System {
  constructor(
      entities = ij(EntityManager),
      events = ij(EventManager),
      drawing = ij(Drawing),
      random = ij(Random)) {
    super();
    this.entities = entities;
    this.events = events;
    this.drawing = drawing;
    this.random = random;
        
    this.events.subscribe(
        EventType.NODE, () => this.startTransition());
    
    this.snapshot = undefined;
    this.positions = undefined;
    this.index = undefined;
    this.speed = undefined;
  }
  
  hardwareViewSpatial() {
    return firstOf(this.entities.query()
        .filter(ViewComponent, view => view.type == ViewType.HARDWARE)
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  startTransition() {
    const spatial = this.hardwareViewSpatial();
    this.snapshot = new CxelBuffer(spatial.width, spatial.height);
    memblt(
        this.snapshot.ptr(0, 0),
        this.drawing.buffer().ptr(spatial.x, spatial.y),
        spatial.width,
        spatial.height);
    
    this.positions = new Array(spatial.width * spatial.height);
    for (let i = 0; i < this.positions.length; ++i) {
      this.positions[i] = i;
    }
    shuffle(this.positions, this.random.channel(RNG_FX));
    
    this.index = 0;
    this.speed = this.positions.length * SPEED;
  }
  
  endTransition() {
    this.snapshot = undefined;
    this.positions = undefined;
    this.index = undefined;
    this.speed = undefined;
  }
  
  frame(delta) {
    if (!this.snapshot) {
      return;
    }
    
    if (this.index >= this.positions.length) {
      this.endTransition();
      return;
    }
    
    const spatial = this.hardwareViewSpatial();
    for (let i = this.index; i < this.positions.length; ++i) {
      const position = this.positions[i];
      const px = position % this.snapshot.width;
      const py = Math.floor(position / this.snapshot.width);
      const dpx = spatial.x + px;
      const dpy = spatial.y + py;
      
      this.drawing.buffer().chars.data[this.drawing.buffer().chars.offset(dpx, dpy)] =
          this.snapshot.chars.data[this.snapshot.chars.offset(px, py)];
        
      const srcColorOffset = this.snapshot.foreground.offset(px, py);
      const dstColorOffset = this.drawing.buffer().foreground.offset(dpx, dpy);
      
      this.drawing.buffer().foreground.data[dstColorOffset] =
          this.snapshot.foreground.data[srcColorOffset];
      this.drawing.buffer().foreground.data[dstColorOffset + 1] =
          this.snapshot.foreground.data[srcColorOffset + 1];
      this.drawing.buffer().foreground.data[dstColorOffset + 2] =
          this.snapshot.foreground.data[srcColorOffset + 2];
      this.drawing.buffer().background.data[dstColorOffset] =
          this.snapshot.background.data[srcColorOffset];
      this.drawing.buffer().background.data[dstColorOffset + 1] = 
          this.snapshot.background.data[srcColorOffset + 1];
      this.drawing.buffer().background.data[dstColorOffset + 2] =
          this.snapshot.background.data[srcColorOffset + 2];
    }
    
    this.index += Math.ceil(this.speed * delta);
  }
}

export {NodeTransitionSystem};