const STEALTH_MAX = 10;

class StealthComponent {
  constructor(stealth = 8) {
    this.stealth = stealth;
  }
}

export {
  StealthComponent,
  STEALTH_MAX,
};