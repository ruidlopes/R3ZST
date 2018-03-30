import {Injector} from './injector.js';

const injector = new Injector();
const ij = injector.getInstance.bind(injector);
const ijset = injector.getSetInstance.bind(injector);
const ijmap = injector.getMapInstance.bind(injector);

export {
  injector,
  ij,
  ijset,
  ijmap,
};