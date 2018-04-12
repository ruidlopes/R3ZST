import {Color} from '../../renderer/graphics/color.js';

const BLACK = new Color().setHSV(195, 1, 0.125).lock()

const BLUE_BRIGHT = new Color().setHSV(195, 1, 1).lock();
const BLUE_FADED  = new Color().setHSV(195, 1, 0.75).lock();
const BLUE_FADED2  = new Color().setHSV(195, 1, 0.5).lock();

const HIGHLIGHT_BRIGHT = new Color().setHSV(145, 1, 1).lock();
const HIGHLIGHT_FADED = new Color().setHSV(145, 1, 0.75).lock();

const RED_BRIGHT = new Color().setHSV(15, 1, 0.75).lock();

export {
  BLACK,
  BLUE_BRIGHT,
  BLUE_FADED,
  BLUE_FADED2,
  HIGHLIGHT_BRIGHT,
  HIGHLIGHT_FADED,
  RED_BRIGHT,
};