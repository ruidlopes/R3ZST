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

function enumValue(enumType, label) {
  return enumType[label];
}

function enumHas(enumType, label) {
  return label in enumType;
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

function sameElements(arr1, arr2) {
  if (arr1.length != arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] != arr2[i]) {
      return false;
    }
  }
  return true;
}

export {
  enumOf,
  enumLabel,
  enumValue,
  enumHas,
  firstOf,
  isEmpty,
  mapOf,
  sameElements,
};