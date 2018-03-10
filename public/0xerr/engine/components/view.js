import {enumOf} from '../../stdlib/collections.js';

const ViewType = enumOf(
  'HARDWARE',
  'TERMINAL',
  'STATUS',
);

class ViewComponent {
  constructor(type) {
    this.type = type;
  }
}

export {
  ViewType,
  ViewComponent,
};