const CYCLES_MAX = 10;

class CyclesComponent {
  constructor(cycles = CYCLES_MAX) {
    this.cycles = cycles;
  }
}

export {
  CyclesComponent,
  CYCLES_MAX,
};