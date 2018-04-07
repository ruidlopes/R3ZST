import {RED_BRIGHT} from '../common/palette.js';
import {ActiveComponent} from '../components/active.js';
import {BoxType} from '../../renderer/primitives/boxes.js';
import {ChipComponent, ChipType} from '../components/chip.js';
import {CompositeComponent} from '../components/composite.js';
import {Drawing} from '../common/drawing.js';
import {EntityManager} from '../entity/manager.js';
import {IdentifiedComponent} from '../components/identified.js';
import {NodeComponent} from '../components/node.js';
import {RetCamStatusComponent, RetCamStatus} from '../components/retcamstatus.js';
import {SpatialComponent} from '../components/spatial.js';
import {StyleComponent} from '../components/style.js';
import {System} from '../system.js';
import {ViewComponent, ViewType} from '../components/view.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

const CPU_SMALL_CHARS = [0x00, 0x00, 0x00, 0x00, 0x8c, 0x8e, 0x8d, 0x8f];

class ChipRendererSystem extends System {
  constructor(
      manager = ij(EntityManager),
      drawing = ij(Drawing)) {
    super();
    this.manager = manager;
    this.drawing = drawing;
        
    this.clipped = {x: 0, y: 0, width: 0, height: 0};
  }
  
  hardwareViewSpatial() {
    return firstOf(this.manager.query()
        .filter(ViewComponent, component => component.type == ViewType.HARDWARE)
        .iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  activeNode() {
    return firstOf(this.manager.query()
        .filter(NodeComponent)
        .filter(ActiveComponent, component => component.active)
        .first()
        .iterate(SpatialComponent, CompositeComponent));
  }
  
  activeNodeCompositeIds() {
    return this.activeNode().get(CompositeComponent).ids;
  }
  
  chips() {
    return this.manager.query(this.activeNodeCompositeIds())
        .filter(ChipComponent)
        .iterate(
            ChipComponent,
            SpatialComponent,
            StyleComponent,
            IdentifiedComponent,
            RetCamStatusComponent);
  }
  
  frame(delta) {
    for (const chip of this.chips()) {
      this.chipFrame(chip, delta);
    }
  }
  
  chipFrame(chip, delta) {
    const nodeSpatial = this.activeNode().get(SpatialComponent);
    const viewSpatial = this.hardwareViewSpatial();
    this.clipped.x = nodeSpatial.x;
    this.clipped.y = nodeSpatial.y;
    this.clipped.width = Math.min(
        nodeSpatial.width,
        viewSpatial.width - nodeSpatial.x);
    this.clipped.height = Math.min(
        nodeSpatial.height,
        viewSpatial.height - nodeSpatial.y);
    
    const type = chip.get(ChipComponent).type;
    const spatial = chip.get(SpatialComponent);
    const style = chip.get(StyleComponent);
    const identified = chip.get(IdentifiedComponent).identified;
    
    const dx = Math.floor(this.clipped.x + spatial.x);
    const dy = Math.floor(this.clipped.y + spatial.y);
    
    const draw = this.drawing.clipping(this.clipped);
    draw.rect(dx, dy, spatial.width, spatial.height,
              0x00, style.foregroundColor, style.backgroundColor);
    
    if (!identified) {
      draw.box(dx, dy, spatial.width, spatial.height,
               BoxType.OUTER, style.foregroundColor, style.backgroundColor);
      return;
    }
    
    switch (type) {
      case ChipType.BIOS:
        draw.boxWithChars(dx - 1, dy - 1, spatial.width + 2, spatial.height + 2,
                CPU_SMALL_CHARS, style.foregroundColor, style.backgroundColor)
            .box(dx, dy, spatial.width, spatial.height,
                BoxType.OUTER, style.foregroundColor, style.backgroundColor);
        break;
      
      case ChipType.CAM:
        const status = chip.get(RetCamStatusComponent).status;
        const foreground = status == RetCamStatus.DISCONNECTED ?
            RED_BRIGHT :
            style.foregroundColor;
        draw.box(dx, dy, spatial.width, spatial.height,
                 BoxType.DOUBLE, foreground, style.backgroundColor);
        break;
        
      case ChipType.CPU:
        draw.boxWithChars(dx - 1, dy - 1, spatial.width + 2, spatial.height + 2,
                CPU_SMALL_CHARS, style.foregroundColor, style.backgroundColor)
            .box(dx, dy, spatial.width, spatial.height,
                BoxType.OUTER, style.foregroundColor, style.backgroundColor);
        break;
              
      case ChipType.MEM:
        draw.box(dx, dy, spatial.width, spatial.height,
                 BoxType.OUTER, style.foregroundColor, style.backgroundColor);
        break;
        
      case ChipType.NIC:
        draw.box(dx, dy, spatial.width, spatial.height,
                 BoxType.OUTER, style.foregroundColor, style.backgroundColor);
        for (let y = 1; y < spatial.height - 1; ++y) {
          draw.hline(dx + 1, dy + y, spatial.width - 2,
                     0xc4, style.foregroundColor, style.backgroundColor);
        } 
        break;
    }
  }
}

export {ChipRendererSystem};