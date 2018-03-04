class KeyShortcut {
  constructor(value, ...modifiers) {
    this.key = value.toUpperCase();
    this.modifiers = new Set(modifiers);
  }
}

export {KeyShortcut};