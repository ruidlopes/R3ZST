import {ALWAYS_TRUE} from '../../../stdlib/functions.js';
import {Color} from '../../../renderer/graphics/color.js';
import {Scene} from '../../scene.js';
import {sprint} from '../../../renderer/primitives/print.js';

const States = {
  LOOP: Symbol(),
};

class HelloWorldScene extends Scene {
  constructor(scr) {
    super(scr);
    
    this.colors = [
      new Color().setHSV(210, 1, 1),
      new Color().setHSV(30, 1, 1),
    ];
    
    this.sm.add(States.LOOP, () => this.render());
    this.sm.cond(ALWAYS_TRUE, States.LOOP);
  }
  
  render() {
    for (let y = 0; y < 40; ++y) {
      const timePhase = Math.floor(this.delta / 500) % 2;
      const swap = y % 2 == 1;
      const phase = swap ? 1 - timePhase : timePhase;
      sprint('Hello World', this.screen, 0, y, this.colors[phase], this.colors[1 - phase]);
    }
  }
}

export {HelloWorldScene};