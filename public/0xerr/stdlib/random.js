function randomDev(center, dev) {
  return randomRange(center - dev, center + dev);
}

function randomInt(max) {
  return randomRange(0, Math.ceil(max));
}

function randomRange(min, max) {
  return min + Math.round(Math.random() * (max - min));
}

function randomRangeDouble(min, max) {
  return min + (Math.random() * (max - min));
}

export {
  randomDev,
  randomInt,
  randomRange,
  randomRangeDouble,
};