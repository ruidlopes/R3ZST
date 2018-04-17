import {Color} from '../../renderer/graphics/color.js';

const BLACK = new Color().setHSV(195, 1, 0.125).lock()

const BLUE_BRIGHT = new Color().setHSV(195, 1, 1).lock();
const BLUE_FADED  = new Color().setHSV(195, 1, 0.75).lock();
const BLUE_FADED2 = new Color().setHSV(195, 1, 0.5).lock();
const BLUE_FADED3 = new Color().setHSV(195, 1, 0.25).lock();

const HIGHLIGHT_BRIGHT = new Color().setHSV(145, 1, 1).lock();
const HIGHLIGHT_FADED = new Color().setHSV(145, 1, 0.75).lock();

const RED_BRIGHT = new Color().setHSV(15, 1, 0.75).lock();
const RED_MAGENTA_BRIGHT = new Color().setHSV(330, 1, 1).lock();

const WHITE = new Color().setHSV(45, 0.125, 1).lock();

export {
  BLACK,
  BLUE_BRIGHT,
  BLUE_FADED,
  BLUE_FADED2,
  BLUE_FADED3,
  HIGHLIGHT_BRIGHT,
  HIGHLIGHT_FADED,
  RED_BRIGHT,
  RED_MAGENTA_BRIGHT,
  WHITE,
};