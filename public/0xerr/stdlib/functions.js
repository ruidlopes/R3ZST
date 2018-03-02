function constant(value) {
  return () => value;
}

const ALWAYS_TRUE = constant(true);
const ALWAYS_FALSE = constant(false);

export {
  constant,
  ALWAYS_TRUE,
  ALWAYS_FALSE,
};