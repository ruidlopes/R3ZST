import {Engine} from './engine/engine.js';

function main() {
  const engine = new Engine();
  engine.start();
}

document.addEventListener('DOMContentLoaded', main);
