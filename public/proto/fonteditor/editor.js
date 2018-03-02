const FontCell = {
  BLANK: 0,
  FILLED: 1,
};

function renderFontChar(fontChar, xPos, yPos, ctx, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.translate(xPos, yPos);
  
  for (let y = 0; y < fontChar.size; ++y) {
    const offsetY = y * fontChar.size;
    for (let x = 0; x < fontChar.size; ++x) {
      if (fontChar.cellOffset(offsetY + x) == FontCell.FILLED) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  
  ctx.restore();
}

function print(str, x, y, model, ctx, color) {
  str.split('').forEach((ch, i) => {
    const fontChar = model.at(ch.charCodeAt(0));
    renderFontChar(fontChar, x + i * model.size, y, ctx, color);
  });
}

class FontChar {
  constructor(size) {
    this.size = size;
    this.cells = new Uint8Array(size * size);
    this.clear();
  }
  
  clear() {
    this.cells.fill(FontCell.BLANK);
  }
  
  cell(x, y) {
    return this.cellOffset(y * this.size + x);
  }
  
  cellOffset(offset) {
    return this.cells[offset];
  }
  
  setCell(x, y, bit) {
    this.cells[y * this.size + x] = bit;
  }
  
  toggle(x, y) {
    const toggled = this.cell(x, y) == FontCell.BLANK ?
        FontCell.FILLED :
        FontCell.BLANK;
    this.setCell(x, y, toggled);
  }
  
  pack() {
    const collector = [];
    for (let i = 0; i < this.size; ++i) {
      collector.push(this.cells.subarray(i * this.size, (i + 1) * this.size));
    }
    return collector.map(row => parseInt(row.join(''), 2));
  }
  
  static unpack(values) {
    const size = values.length;
    const instance = new FontChar(size);
    values.forEach((row, i) => instance.cells.set(
        row.toString(2).padStart(size, '0').split(''), i * size));
    return instance;
  }
}

class FontModel {
  static get CHAR_COUNT() {
    return 256;
  }
  
  constructor(size) {
    this.size = size;
    this.chars = new Array(FontModel.CHAR_COUNT);
    this.index = 0;
    this.init();
  }
  
  init() {
    for (let i = 0; i < FontModel.CHAR_COUNT; ++i) {
      this.chars[i] = new FontChar(this.size);
    }
  }
  
  at(index) {
    return this.chars[index];
  }
  
  selected(index) {
    return this.index == index;
  }
  
  selectedIndex() {
    return this.index;
  }
  
  select(index) {
    this.index = index & (FontModel.CHAR_COUNT - 1);
  }
  
  current() {
    return this.at(this.index);
  }
  
  pack() {
    return this.chars.map(char => char.pack());
  }
  
  static unpack(chars) {
    const size = chars[0].length;
    const model = new FontModel(size);
    model.chars = chars.map(FontChar.unpack);
    return model;
  }
}

class Rect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  
  encloses(x, y) {
    return x >= this.x &&
        y >= this.y &&
        x < this.x + this.width &&
        y < this.y + this.height;
  }
}

class Widget {
  constructor(rect, model) {
    this.rect = rect;
    this.model = model;
  }
  
  willAccept(x, y) {
    return this.rect.encloses(x, y);
  }
  
  onMouseDown(x, y, e) {}
  
  onMouseMove(x, y, e) {}
  
  onMouseUp(x, y, e) {}
  
  onClick(x, y, e) {}
  
  onMouseEnter(e) {}
  
  onMouseLeave(e) {}
  
  onKeyPress(e) {}
  
  onKeyDown(e) {}
  
  onKeyUp(e) {}
  
  render(ctx) {}
}

class CharEditor extends Widget {
  static get CELL_RENDER_SIZE() {
    return 30;
  }

  constructor(model) {
    super(
        new Rect(
            300,
            250,
            model.size * CharEditor.CELL_RENDER_SIZE,
            model.size * CharEditor.CELL_RENDER_SIZE),
        model);
    
    this.highlightCell = null;
  }
  
  onMouseMove(x, y, e) {
    const scaledX = Math.floor(x / CharEditor.CELL_RENDER_SIZE);
    const scaledY = Math.floor(y / CharEditor.CELL_RENDER_SIZE);
    this.highlightCell = {x: scaledX, y: scaledY};
  }
  
  onMouseLeave(e) {
    this.highlightCell = null;
  }
  
  onClick(x, y, e) {
    const scaledX = Math.floor(x / CharEditor.CELL_RENDER_SIZE);
    const scaledY = Math.floor(y / CharEditor.CELL_RENDER_SIZE);
    this.model.current().toggle(scaledX, scaledY);
  }
  
  render(ctx) {
    for (let y = 0; y < this.model.size; ++y) {
      for (let x = 0; x < this.model.size; ++x) {
        const cell = this.model.current().cell(x, y);
        const highlighted = this.highlightCell &&
            this.highlightCell.x == x &&
            this.highlightCell.y == y;
        const shaded = (x % 2 == 0 & y % 2 == 1) || (x % 2 == 1 && y % 2 == 0); 
        const color = highlighted ? '#0f0' : (cell ? '#000' : (shaded ? '#eee' : '#fff'));
        ctx.fillStyle = color;
        ctx.fillRect(
            x * CharEditor.CELL_RENDER_SIZE,
            y * CharEditor.CELL_RENDER_SIZE,
            CharEditor.CELL_RENDER_SIZE,
            CharEditor.CELL_RENDER_SIZE);
      }
    }
    
    const strokeLength = CharEditor.CELL_RENDER_SIZE * this.model.size + 4;
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(-2, -2, strokeLength, strokeLength);
  }
}

class CharSelector extends Widget {
  static get GRID_SIZE() {
    return 16;
  }
  
  constructor(model) {
    super(new Rect(0, 0, 250, 250), model);
  }
  
  onKeyUp(e) {
    switch (e.keyCode) {
      case 37:  // arrow left
        this.model.select(this.model.selectedIndex() - 1);
        break;
      case 38:  // arrow up
        this.model.select(this.model.selectedIndex() - CharSelector.GRID_SIZE);
        break;
      case 39:  // arrow right
        this.model.select(this.model.selectedIndex() + 1);
        break;
      case 40:  // arrow down
        this.model.select(this.model.selectedIndex() + CharSelector.GRID_SIZE);
        break;
      default:  // noop
        break;
    }
  }
  
  render(ctx) {
    let selected = {};
    for (let y = 0; y < CharSelector.GRID_SIZE; ++y) {
      for (let x = 0; x < CharSelector.GRID_SIZE; ++x) {
        const offset = y * CharSelector.GRID_SIZE + x;
        const char = this.model.at(offset);
        renderFontChar(
            char,
            x * (this.model.size + 1) + 1,
            y * (this.model.size + 1) + 1,
            ctx,
            '#0f0');
        
        if (this.model.selected(offset)) {
          selected = {x, y};
        }
        
        ctx.strokeStyle = '#222';
        ctx.strokeRect(
          x * (this.model.size + 1),
          y * (this.model.size + 1),
          this.model.size + 2,
          this.model.size + 2);
      }
    }
    
    ctx.strokeStyle = '#0f0';
    ctx.strokeRect(
      selected.x * (this.model.size + 1),
      selected.y * (this.model.size + 1),
      this.model.size + 2,
      this.model.size + 2);
    
    const hex = this.model
        .selectedIndex()
        .toString(16)
        .padStart(2, '0')
        .toUpperCase();
    const repr = String.fromCharCode(this.model.selectedIndex());
    ctx.fillStyle = '#0f0';
    ctx.font = '8px monospace';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(`0x${hex} (${repr})`, 10, 230); 
  }
}

class CharSampler extends Widget {
  constructor(model) {
    super(new Rect(300, 0, 400, 250), model);
    this.texts = [
      'The quick brown fox jumps over the lazy dog',
      'the quick brown fox jumps over the lazy dog',
      'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG',
    ];
    
    exportApi('text', this.text.bind(this));
  }
  
  text(str) {
    this.texts = str.split('\n');
  }
  
  render(ctx) {
    this.texts.forEach((text, i) =>
        print(text, 0, i * this.model.size, this.model, ctx, '#0f0'));
  }
}

class FontEditor {
  static get FONT_SIZE() {
    return 12;
  }
  
  constructor() {
    this.dom = document.querySelector('#editor');
    this.ctx = this.dom.getContext('2d');
    
    this.model = new FontModel(FontEditor.FONT_SIZE);
    this.widgets = [
      new CharSelector(this.model),
      new CharSampler(this.model),
      new CharEditor(this.model),
    ];
    
    this.overWidget = null;
  }
  
  async load(url) {
    const json = await fetch(url).then(response => response.json());
    this.model = FontModel.unpack(json);
    this.widgets.forEach(widget => widget.model = this.model);
  }
  
  attach(parent) {
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    const ratio = window.devicePixelRatio;
    this.ctx.width = this.dom.width = width * ratio;
    this.ctx.height = this.dom.height = height * ratio;
    this.ctx.scale(ratio, ratio);
    this.dom.style.width = `${width}px`;
    this.dom.style.height = `${height}px`;
    parent.appendChild(this.dom);
    
    document.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
    document.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
    document.addEventListener('mouseup', (e) => this.onMouseUp(e), false);
    document.addEventListener('click', (e) => this.onClick(e), false);
    
    document.addEventListener('keypress', (e) => this.onKeyPress(e), false);
    document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    
    document.addEventListener('copy', (e) => this.onCopy(e), false);
    
    this.render();
  }
  
  delegateToWidgets(delegate, e) {
    this.widgets.forEach(widget => {
      if (widget.willAccept(e.clientX, e.clientY)) {
        widget[delegate](e.clientX - widget.rect.x, e.clientY - widget.rect.y, e);
      }
    });
  }
  
  onMouseDown(e) {
    this.delegateToWidgets('onMouseDown', e);
  }
  
  onMouseMove(e) {
    let nextOverWidget = null;
    
    this.widgets.forEach(widget => {
      if (widget.willAccept(e.clientX, e.clientY)) {
        if (this.overWidget != widget) {
          nextOverWidget = widget;
          widget.onMouseEnter(e);
        }
        widget.onMouseMove(e.clientX - widget.rect.x, e.clientY - widget.rect.y, e);
      } else {
        if (this.overWidget == widget) {
          widget.onMouseLeave(e);
        }
      }
    });
    
    this.overWidget = nextOverWidget;
  }
  
  onMouseUp(e) {
    this.delegateToWidgets('onMouseUp', e);
  }
  
  onClick(e) {
    this.delegateToWidgets('onClick', e);
  }
  
  onKeyPress(e) {
    this.widgets.forEach(widget => widget.onKeyPress(e));
  }
  
  onKeyDown(e) {
    this.widgets.forEach(widget => widget.onKeyDown(e));
  }
  
  onKeyUp(e) {
    this.widgets.forEach(widget => widget.onKeyUp(e));
  }
  
  onCopy(e) {
    e.clipboardData.setData(
        'text/plain',
        JSON.stringify(this.model.pack(), null, 2));
    e.preventDefault();
  }
  
  render() {
    this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
    
    this.widgets.forEach(widget => {
      this.ctx.save();
      this.ctx.translate(widget.rect.x, widget.rect.y);
      widget.render(this.ctx);
      this.ctx.restore();
    });
    
    requestAnimationFrame(() => this.render());
  }
}

function exportApi(name, ref) {
  if (window[name]) {
    throw new Error(`Cannot export ${name}`);
  }
  window[name] = ref;
}

(function main() {
  const editor = new FontEditor();
  editor.attach(document.body);
  
  exportApi('load', (url) => editor.load(url));
  exportApi('save', () => editor.model.pack());
  
  window.load('/0xerr/assets/fonts/12x12.json');
})();