import {Engine} from './engine/engine.js';
import {EngineModule} from './engine/module.js';
import {ObserversModule} from './observers/module.js';
import {injector} from './injection/api.js';

function main() {
  injector.install(
      new EngineModule(),
      new ObserversModule(),
  );
  injector.getInstance(Engine).start();
}

document.addEventListener('DOMContentLoaded', main);
