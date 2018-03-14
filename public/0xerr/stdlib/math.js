function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// value -> [0,1]
function lerp(value, min, max) {
  return min + value * (max - min);
}

function nextPow2(f) {
  return Math.pow(2.0, Math.ceil(Math.log2(f)));
}

function xnor(value1, value2) {
  return !(value1 ^ value2);
}

export {
  clamp,
  lerp,
  nextPow2,
  xnor,
};