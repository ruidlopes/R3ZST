import {Injector} from './injector.js';

const injector = new Injector();
const ij = injector.getInstance.bind(injector);

export {
  injector,
  ij,
};