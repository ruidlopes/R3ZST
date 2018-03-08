function enumOf(...labels) {
  const entries = {};
  for (const label of labels) {
    entries[label] = Symbol(label);
  }
  return entries;
}

function firstOf(iterable) {
  return iterable[Symbol.iterator]().next().value;
}

function mapOf(...params) {
  const pairs = [];
  for (let i = 0; i < params.length - 1; i += 2) {
    pairs.push([params[i], params[i + 1]]);
  }
  return new Map(pairs);
}

export {
  enumOf,
  firstOf,
  mapOf,
};