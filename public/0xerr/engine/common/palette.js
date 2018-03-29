import {Color} from '../../renderer/graphics/color.js';

const BLACK = new Color().setHSV(195, 1, 0.125).lock()

const BLUE_BRIGHT = new Color().setHSV(195, 1, 1).lock();
const BLUE_FADED  = new Color().setHSV(195, 1, 0.75).lock();
const BLUE_FADED2  = new Color().setHSV(195, 1, 0.5).lock();

const ORANGE_BRIGHT = new Color().setHSV(45, 1, 1).lock();

const RED_BRIGHT = new Color().setHSV(15, 1, 0.75).lock();

export {
  BLACK,
  BLUE_BRIGHT,
  BLUE_FADED,
  BLUE_FADED2,
  ORANGE_BRIGHT,
  RED_BRIGHT,
};