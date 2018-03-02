function memblt(dst, src, width, height) {
  if (dst.sameBuffer(src)) {
    __fast_memblt(dst, src, width, height);
  } else {
    __slow_memblt(dst, src, width, height);
  }
}

function __fast_memblt(dst, src, width, height) {
  for (let y = 0; y < height; ++y) {
    dst.buffer.chars.data.copyWithin(
        dst.charAddr + dst.buffer.chars.offset(0, y),
        src.charAddr + src.buffer.chars.offset(0, y),
        src.charAddr + src.buffer.chars.offset(width, y));
    dst.buffer.background.data.copyWithin(
        dst.backgroundAddr + dst.buffer.background.offset(0, y),
        src.backgroundAddr + src.buffer.background.offset(0, y),
        src.backgroundAddr + src.buffer.background.offset(width, y));
    dst.buffer.foreground.data.copyWithin(
        dst.foregroundAddr + dst.buffer.foreground.offset(0, y),
        src.foregroundAddr + src.buffer.foreground.offset(0, y),
        src.foregroundAddr + src.buffer.foreground.offset(width, y));
  }
}

function __slow_memblt(dst, src, width, height) {
  for (let y = 0; y < height; ++y) {
    dst.buffer.chars.data.set(
        src.charSeg(width, 0, y),
        dst.charAddr + dst.buffer.chars.offset(0, y));
    dst.buffer.background.data.set(
        src.backgroundSeg(width, 0, y),
        dst.backgroundAddr + dst.buffer.background.offset(0, y));
    dst.buffer.foreground.data.set(
        src.foregroundSeg(width, 0, y),
        dst.foregroundAddr + dst.buffer.foreground.offset(0, y));
  }
}

function memcmp(b1, b2, size) {
  const charSeg1 = b1.charSeg(size);
  const charSeg2 = b2.charSeg(size);
  const backgroundSeg1 = b1.backgroundSeg(size);
  const backgroundSeg2 = b2.backgroundSeg(size);
  const foregroundSeg1 = b1.foregroundSeg(size);
  const foregroundSeg2 = b2.foregroundSeg(size);
  return charSeg1.every((item, i) => item == charSeg2[i]) &&
      backgroundSeg1.every((item, i) => item == backgroundSeg2[i]) &&
      foregroundSeg1.every((item, i) => item == foregroundSeg2[i]);
}

function memcpy(dst, src, size) {
  if (dst.sameBuffer(src)) {
    __fast_memcpy(dst, src, size);
  } else {
    __slow_memcpy(dst, src, size);
  }
}

function __fast_memcpy(dst, src, size) {
  dst.buffer.chars.data.copyWithin(
      dst.charAddr, src.charAddr, src.charAddr + size);
  dst.buffer.background.data.copyWithin(
      dst.backgroundAddr, src.backgroundAddr, src.backgroundAddr + size);
  dst.buffer.foreground.data.copyWithin(
      dst.foregroundAddr, src.foregroundAddr, src.foregroundAddr + size);
}

function __slow_memcpy(dst, src, size) {
  dst.buffer.chars.data.set(src.charSeg(size), dst.charAddr);
  dst.buffer.background.data.set(src.backgroundSeg(size), dst.backgroundAddr);
  dst.buffer.foreground.data.set(src.foregroundSeg(size), dst.foregroundAddr);
}

export {
  memblt,
  memcmp,
  memcpy,
};