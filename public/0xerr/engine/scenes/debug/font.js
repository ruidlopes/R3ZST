import {ALWAYS_TRUE} from '../../../stdlib/functions.js';
import {Color} from '../../../renderer/graphics/color.js';
import {Scene} from '../../scene.js';

const States = {
  LOOP: Symbol(),
};

class FontScene extends Scene {
  constructor(scr) {
    super(scr);
    
    this.colorMixer = new Color();
    
    this.sm.add(States.LOOP, () => this.render());
    this.sm.cond(ALWAYS_TRUE, States.LOOP);
  }
  
  render() {
    this.colorMixer.setHSL((this.delta / 10) % 360, 1, 5/8);
    for (let y = 0; y < 16; ++y) {
      for (let x = 0; x < 16; ++x) {
        this.screen.chars.data[this.screen.chars.offset(x, y)] = y << 4 | x;
        this.screen.foreground.data.set(
            this.colorMixer.data,
            this.screen.foreground.offset(x, y));
      }
    }
  }
}

export {FontScene};