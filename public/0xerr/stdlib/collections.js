function enumOf(...labels) {
  const entries = {};
  for (const label of labels) {
    entries[label] = Symbol(label);
  }
  return entries;
}

function enumLabel(enumType, value) {
  for (const label of Object.getOwnPropertyNames(enumType)) {
    if (enumType[label] == value) {
      return label;
    }
  }
  return undefined;
}

function firstOf(iterable) {
  return iterable[Symbol.iterator]().next().value;
}

function isEmpty(iterable) {
  return iterable[Symbol.iterator]().next().done;
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
  enumLabel,
  firstOf,
  isEmpty,
  mapOf,
};