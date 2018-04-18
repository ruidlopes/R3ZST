import {RED_MAGENTA_BRIGHT} from '../common/palette.js';
import {BoxType} from '../../renderer/primitives/boxes.js';
import {ChipComponent, ChipType} from '../components/chip.js';
import {Drawing} from '../common/drawing.js';
import {EntityLib} from '../entity/lib.js';
import {IdentifiedComponent} from '../components/identified.js';
import {RetCamStatusComponent, RetCamStatus} from '../components/retcamstatus.js';
import {SpatialComponent} from '../components/spatial.js';
import {StyleComponent} from '../components/style.js';
import {System} from '../system.js';
import {firstOf} from '../../stdlib/collections.js';
import {ij} from '../../injection/api.js';

const CPU_SMALL_CHARS = [0x00, 0x00, 0x00, 0x00, 0x8c, 0x8e, 0x8d, 0x8f];

class ChipRendererSystem extends System {
  constructor(
      lib = ij(EntityLib),
      drawing = ij(Drawing)) {
    super();
    this.lib = lib;
    this.drawing = drawing;
        
    this.clipped = {x: 0, y: 0, width: 0, height: 0};
  }
  
  hardwareViewSpatial() {
    return firstOf(this.lib.hardwareView().iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  activeNodeSpatial() {
    return firstOf(this.lib.activeNode().iterate(SpatialComponent))
        .get(SpatialComponent);
  }
  
  chips() {
    return this.lib.activeNodeChips()
        .iterate(
            ChipComponent,
            SpatialComponent,
            StyleComponent,
            IdentifiedComponent,
            RetCamStatusComponent);
  }
  
  frame(delta) {
    const nodeSpatial = this.activeNodeSpatial();
    const viewSpatial = this.hardwareViewSpatial();
    this.clipped.x = Math.floor(nodeSpatial.x);
    this.clipped.y = Math.floor(nodeSpatial.y);
    this.clipped.width = Math.min(
        nodeSpatial.width,
        viewSpatial.width - Math.floor(nodeSpatial.x));
    this.clipped.height = Math.min(
        nodeSpatial.height,
        viewSpatial.height - Math.floor(nodeSpatial.y));
    
    for (const chip of this.chips()) {
      this.chipFrame(chip, delta);
    }
  }
  
  chipFrame(chip, delta) {
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
            RED_MAGENTA_BRIGHT :
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
        draw.rect(dx, dy, spatial.width, spatial.height,
                  0xfe, style.foregroundColor, style.backgroundColor)
            .box(dx, dy, spatial.width, spatial.height,
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