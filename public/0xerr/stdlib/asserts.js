function assertEquals(expected, observed, str = 'Expected equal values.') {
  if (expected != observed) {
    throw new Error(str);
  }
  return expected;
}

function assertNotNull(obj, str = 'Value cannot be null.') {
  if (obj == null) {
    throw new Error(str);
  }
  return obj;
}

function assertTrue(cond, str = 'Expected true condition.') {
  if (!cond) {
    throw new Error(str);
  }
  return cond;
}

function assertFalse(cond, str = 'Expected false condition.') {
  if (cond) {
    throw new Error(str);
  }
  return cond;
}

export {
  assertEquals,
  assertNotNull,
  assertTrue,
  assertFalse,
};