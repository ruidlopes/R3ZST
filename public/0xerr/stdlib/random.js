const UINT32_MASK = 0xffffffff;

const DEFAULT_SEED = Uint32Array.from([
    0x12345678,
    0x56789abc,
    0x9abcdef0,
    0xdef01234,
    0x12345678,
]);

class RandomXorWow {
  constructor(seed = DEFAULT_SEED) {
    this.state = Uint32Array.from(seed);
  }
  
  next() {
    let s;
    let t = this.state[0] & UINT32_MASK;
    t ^= (t >> 2) & UINT32_MASK;
    t ^= (t << 1) & UINT32_MASK;
    this.state[3] = this.state[2] & UINT32_MASK;
    this.state[2] = this.state[1] & UINT32_MASK;
    this.state[1] = s = this.state[0] & UINT32_MASK;
    t ^= (s) & UINT32_MASK;
    t ^= (s << 4) & UINT32_MASK;
    this.state[0] = t & UINT32_MASK;
    this.state[4] = (this.state[4] + 0x587c5) & UINT32_MASK;
    return (t + this.state[4]) & UINT32_MASK;
  }
  
  random() {
    return this.next() / UINT32_MASK;
  }
  
  randomRange(min, max) {
    const delta = max - min;
    return Math.round(min + (this.random() * delta));
  }
  
  randomBoolean() {
    return this.random() > 0.5;
  }
}


class Random {
  constructor(seed) {
    this.generator = new RandomXorWow(seed);
    this.channels = new Map();
  }
  
  get(channel) {
    if (!this.channels.has(channel)) {
      this.channels.set(channel,
          new RandomXorWow([
              this.generator.next(),
              this.generator.next(),
              this.generator.next(),
              this.generator.next(),
              this.generator.next()]));
    }
    return this.channels.get(channel);
  }
}

export {Random};