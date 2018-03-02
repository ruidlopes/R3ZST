class CxelPtr {
  constructor(buffer, x, y) {
    this.buffer = buffer;
    this.charAddr = buffer.chars.offset(x, y);
    this.backgroundAddr = buffer.background.offset(x, y);
    this.foregroundAddr = buffer.foreground.offset(x, y);
    this.x = x;
    this.y = y;
  }
  
  moveTo(x, y) {
    this.charAddr = this.buffer.chars.offset(x, y);
    this.backgroundAddr = this.buffer.background.offset(x, y);
    this.foregroundAddr = this.buffer.foreground.offset(x, y);
    this.x = x;
    this.y = y;
    return this;
  }
  
  moveToOffset(offset) {
    this.charAddr = this.buffer.chars.sizeof(offset);
    this.backgroundAddr = this.buffer.background.sizeof(offset);
    this.foregroundAddr = this.buffer.foreground.sizeof(offset);
    this.x = this.buffer.chars.xFromOffset(this.charAddr);
    this.y = this.buffer.chars.yFromOffset(this.charAddr);
    return this;
  }
  
  moveDelta(dx, dy) {
    this.charAddr += this.buffer.chars.offset(dx, dy);
    this.backgroundAddr += this.buffer.background.offset(dx, dy);
    this.foregroundAddr += this.buffer.foreground.offset(dx, dy);
    this.x += dx;
    this.y += dy;
    return this;
  }
  
  moveDeltaOffset(offset) {
    this.charAddr += this.buffer.chars.sizeof(offset);
    this.backgroundAddr += this.buffer.background.sizeof(offset);
    this.foregroundAddr += this.buffer.foreground.sizeof(offset);
    this.x = this.buffer.chars.xFromOffset(this.charAddr);
    this.y = this.buffer.chars.yFromOffset(this.charAddr);
    return this;
  }
  
  segment(backingBuffer, address, size) {
    return backingBuffer.data.subarray(address, address + backingBuffer.sizeof(size));
  }
  
  charSeg(size, addX = 0, addY = 0) {
    return this.segment(
        this.buffer.chars,
        this.charAddr + this.buffer.chars.offset(addX, addY),
        size);
  }
  
  backgroundSeg(size, addX = 0, addY = 0) {
    return this.segment(
        this.buffer.background,
        this.backgroundAddr + this.buffer.background.offset(addX, addY),
        size);
  }
  
  foregroundSeg(size, addX = 0, addY = 0) {
    return this.segment(
        this.buffer.foreground,
        this.foregroundAddr + this.buffer.foreground.offset(addX, addY),
        size);
  }
  
  sameBuffer(other) {
    return other !== null &&
        other !== undefined &&
        (this === other || this.buffer === other.buffer);
  }
}

export {CxelPtr};