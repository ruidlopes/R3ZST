const PI_OVER_2 = Math.PI / 2;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(value, min, max) {
  return min + value * (max - min);
}

function trigerp(value, min, max) {
  return lerp(Math.sin(lerp(value, 0, PI_OVER_2)), min, max);
}

function nextPow2(f) {
  return Math.pow(2.0, Math.ceil(Math.log2(f)));
}

function unsigned(int32) {
  return int32 >>> 0;
}

function xnor(value1, value2) {
  return !(value1 ^ value2);
}

export {
  clamp,
  lerp,
  trigerp,
  nextPow2,
  unsigned,
  xnor,
};