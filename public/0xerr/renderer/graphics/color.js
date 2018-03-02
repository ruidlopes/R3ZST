const INV_255 = 1.0 / 255;

class RGB {
  constructor(r = 0, g = 0, b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  
  fromHSV(hsv) {
    const chroma = hsv.v * hsv.s;
    const huep = hsv.h / 60;
    const x = chroma * (1 - Math.abs(huep % 2 - 1));
    let r1, g1, b1;
    if (hsv.h == 0) {
      r1 = 0;
      g1 = 0;
      b1 = 0;
    } else if (huep <= 1) {
      r1 = chroma;
      g1 = x;
      b1 = 0;
    } else if (huep <= 2) {
      r1 = x;
      g1 = chroma;
      b1 = 0;
    } else if (huep <= 3) {
      r1 = 0;
      g1 = chroma;
      b1 = x;
    } else if (huep <= 4) {
      r1 = 0;
      g1 = x;
      b1 = chroma;
    } else if (huep <= 5) {
      r1 = x;
      g1 = 0;
      b1 = chroma;
    } else {
      r1 = chroma;
      g1 = 0;
      b1 = x;
    }
    
    const m = hsv.v - chroma;
    this.r = Math.floor(255 * (r1 + m));
    this.g = Math.floor(255 * (g1 + m));
    this.b = Math.floor(255 * (b1 + m));
    
    return this;
  }
  
  fromHSL(hsl) {
    const chroma = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
    const huep = hsl.h / 60;
    const x = chroma * (1 - Math.abs(huep % 2 - 1));
    let r1, g1, b1;
    if (hsl.h == 0) {
      r1 = 0;
      g1 = 0;
      b1 = 0;
    } else if (huep <= 1) {
      r1 = chroma;
      g1 = x;
      b1 = 0;
    } else if (huep <= 2) {
      r1 = x;
      g1 = chroma;
      b1 = 0;
    } else if (huep <= 3) {
      r1 = 0;
      g1 = chroma;
      b1 = x;
    } else if (huep <= 4) {
      r1 = 0;
      g1 = x;
      b1 = chroma;
    } else if (huep <= 5) {
      r1 = x;
      g1 = 0;
      b1 = chroma;
    } else {
      r1 = chroma;
      g1 = 0;
      b1 = x;
    }
    
    const m = hsl.l - 0.5 * chroma;
    this.r = Math.floor(255 * (r1 + m));
    this.g = Math.floor(255 * (g1 + m));
    this.b = Math.floor(255 * (b1 + m));
    
    return this;
  }
}

class HSV {
  constructor(h = 0, s = 0, v = 0) {
    this.h = h;
    this.s = s;
    this.v = v;
  }
  
  fromRGB(rgb) {
    const r = rgb.r * INV_255;
    const g = rgb.g * INV_255;
    const b = rgb.b * INV_255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;
    
    let huep;
    if (chroma == 0) {
      huep = 0;
    } else if (max == r) {
      huep = ((g - b) / chroma) % 6;
    } else if (max == g) {
      huep = ((b - r) / chroma) + 2;
    } else {
      huep = ((r - g) / chroma) + 4;
    }
    const hue = 60 * huep;
    const value = max;
    const saturation = value == 0 ? 0 : chroma / value;
    
    this.h = hue;
    this.s = saturation;
    this.v = value;
    
    return this;
  }
}

class HSL {
  constructor(h = 0, s = 0, l = 0) {
    this.h = h;
    this.s = s;
    this.l = l;
  }
  
  fromRGB(rgb) {
    const r = rgb.r * INV_255;
    const g = rgb.g * INV_255;
    const b = rgb.b * INV_255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;
    
    let huep;
    if (chroma == 0) {
      huep = 0;
    } else if (max == r) {
      huep = ((g - b) / chroma) % 6;
    } else if (max == g) {
      huep = ((b - r) / chroma) + 2;
    } else {
      huep = ((r - g) / chroma) + 4;
    }
    const hue = 60 * huep;
    const lightness = 0.5 * (min + max);
    const saturation = lightness == 1 ? 0 : chroma / (1 - Math.abs(2 * lightness - 1));
    
    this.h = hue;
    this.s = saturation;
    this.l = lightness;
    
    return this;
  }
}

class Color {
  constructor(alpha = 255) {
    this.rgb = new RGB();
    this.hsv = new HSV();
    this.hsl = new HSL();
    this.alpha = alpha;
    
    this.data = new Uint8Array(4);
    this.locked = false;
  }
  
  lock() {
    this.locked = true;
    return this;
  }
  
  unlock() {
    this.locked = false;
    return this;
  }
  
  ensureUnlocked() {
    if (this.locked) {
      throw new Error('Cannot mutate locked Color. Did you forget to .clone() it?');
    }
  }
  
  clone() {
    return new Color(this.alpha).setRGB(this.rgb.r, this.rgb.g, this.rgb.b);
  }
  
  setRGB(r, g, b) {
    this.ensureUnlocked();
    
    this.rgb.r = r;
    this.rgb.g = g;
    this.rgb.b = b;
    
    this.hsv.fromRGB(this.rgb);
    this.hsl.fromRGB(this.rgb);
    this.serialize();
    
    return this;
  }
  
  setHSV(h, s, v) {
    this.ensureUnlocked();
    
    this.hsv.h = h % 360;
    this.hsv.s = s;
    this.hsv.v = v;
    
    this.rgb.fromHSV(this.hsv);
    this.hsl.fromRGB(this.rgb);
    this.serialize();
    
    return this;
  }
  
  setHSL(h, s, l) {
    this.ensureUnlocked();
    
    this.hsl.h = h % 360;
    this.hsl.s = s;
    this.hsl.l = l;
    
    this.rgb.fromHSL(this.hsl);
    this.hsv.fromRGB(this.rgb);
    this.serialize();
    
    return this;
  }
  
  setAlpha(alpha) {
    this.ensureUnlocked();
    
    this.alpha = alpha;
    this.serialize();
    
    return this;
  }
  
  serialize() {
    this.data[0] = this.rgb.r;
    this.data[1] = this.rgb.g;
    this.data[2] = this.rgb.b;
    this.data[3] = this.alpha;
  }
}

export {Color};