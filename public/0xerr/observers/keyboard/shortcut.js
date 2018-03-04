import {KeyModifiers} from './modifiers.js';
import {xnor} from '../../stdlib/math.js';

class KeyShortcutBase {
  constructor(...modifiers) {
    this.modifiers = new Set(modifiers);
  }
  
  codes(keys) {
    const codes = [];
    for (const code of keys.codes()) {
      if (this.match(code)) {
        codes.push(code);
      }
    }
    return codes;
  }
  
  down(keys) {
    const matchModifiers =
        xnor(this.modifiers.has(KeyModifiers.ALT), keys.down('ALT')) &&
        xnor(this.modifiers.has(KeyModifiers.SHIFT), keys.down('SHIFT')) &&
        xnor(this.modifiers.has(KeyModifiers.CTRL), keys.down('CONTROL'));
    
    return this.codes(keys).filter(key => matchModifiers && keys.down(key));
  }
  
  released(keys) {
    const matchModifiers =
        xnor(this.modifiers.has(KeyModifiers.ALT), !keys.missing('ALT')) &&
        xnor(this.modifiers.has(KeyModifiers.SHIFT), !keys.missing('SHIFT')) &&
        xnor(this.modifiers.has(KeyModifiers.CTRL), !keys.missing('CONTROL'));
    
    return this.codes(keys).filter(key => matchModifiers && keys.released(key));
  }
  
  match(code) {
    throw new Error('Unimplemented');
  }
}

class KeyShortcut extends KeyShortcutBase {
  constructor(code, ...modifiers) {
    super(...modifiers);
    this.code = code.toUpperCase();
  }
  
  match(code) {
    return this.code == code;
  }
}

class KeyShortcutRE extends KeyShortcutBase {
  constructor(re, ...modifiers) {
    super(...modifiers);
    this.re = re;
  }
  
  match(code) {
    return this.re.test(code);
  }
}

export {
  KeyShortcut,
  KeyShortcutRE,
};