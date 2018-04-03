import {stringBytes} from './strings.js';

const UINT32_MASK = 0xffffffff;

function unsigned(int32) {
  return int32 >>> 0;
}

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
    let t = unsigned(this.state[0]);
    t = unsigned(t ^ unsigned(t >>> 2));
    t = unsigned(t ^ unsigned(t << 1));
    this.state[3] = unsigned(this.state[2]);
    this.state[2] = unsigned(this.state[1]);
    this.state[1] = s = unsigned(this.state[0]);
    t = unsigned(t ^ s);
    t = unsigned(t ^ unsigned(s << 4));
    this.state[0] = unsigned(t);
    this.state[4] = unsigned(this.state[4] + 0x587c5);
    return unsigned(t + this.state[4]);
  }
  
  random() {
    return this.next() / UINT32_MASK;
  }
  
  randomRange(min, max) {
    const delta = max - min;
    return Math.floor(min + (this.random() * delta));
  }
  
  randomRangeInclusive(min, max) {
    return this.randomRange(min, max + 1);
  }
  
  randomBoolean() {
    return this.random() >= 0.5;
  }
}


class Random {
  constructor(seed) {
    this.generator = new RandomXorWow(seed);
    this.channels = new Map();
  }
  
  setSeed(seed) {
    this.generator = new RandomXorWow(seed);
    this.channels = new Map();
  }
  
  setRawSeed(rawSeed) {
    const seedNumber = Number(rawSeed);
    if (isNaN(seedNumber) || String(seedNumber) != rawSeed) {
      const buffer = new ArrayBuffer(20);
      const seedBase = new Uint8Array(buffer);
      seedBase.set(stringBytes(rawSeed));
      this.setSeed(new Uint32Array(buffer));
    } else {
      const seedBase = unsigned(seedNumber);
      const seed0 = unsigned(seedBase ^ DEFAULT_SEED[0]);
      const seed1 = unsigned(seedBase ^ DEFAULT_SEED[1]);
      const seed2 = unsigned(seedBase ^ DEFAULT_SEED[2]);
      const seed3 = unsigned(seedBase ^ DEFAULT_SEED[3]);
      const seed4 = unsigned(seedBase ^ DEFAULT_SEED[4]);
      this.setSeed(new Uint32Array([seed0, seed1, seed2, seed3, seed4]));
    }
  }
  
  channel(channel) {
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