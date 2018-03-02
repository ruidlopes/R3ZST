function rect(buffer, x, y, width, height, charByte, foregroundColor, backgroundColor) {
  for (let dy = 0; dy < height; ++dy) {
    buffer.chars.data.fill(
        charByte,
        buffer.chars.offset(x, y + dy),
        buffer.chars.offset(x + width, y + dy));
    
    for (let dx = 0; dx < width; ++dx) {
      buffer.foreground.data.set(
          foregroundColor.data,
          buffer.foreground.offset(x + dx, y + dy));
      buffer.background.data.set(
          backgroundColor.data,
          buffer.background.offset(x + dx, y + dy));
    }
  }
}

function rectPtr(ptr, width, height, charByte, foregroundColor, backgroundColor) {
  rect(ptr.buffer, ptr.x, ptr.y, width, height, charByte, foregroundColor, backgroundColor);
}

function vline(buffer, x, y, height, charByte, foregroundColor, backgroundColor) {
  for (let dy = 0; dy < height; ++dy) {
    buffer.chars.data[buffer.chars.offset(x, y + dy)] = charByte;
    buffer.foreground.data.set(
        foregroundColor.data,
        buffer.foreground.offset(x, y + dy));
    buffer.background.data.set(
        backgroundColor.data,
        buffer.background.offset(x, y + dy));
  }
}

function vlinePtr(ptr, height, charByte, foregroundColor, backgroundColor) {
  vline(ptr.buffer, ptr.x, ptr.y, height, charByte, foregroundColor, backgroundColor);
}

function hline(buffer, x, y, width, charByte, foregroundColor, backgroundColor) {
  buffer.chars.data.fill(
      charByte,
      buffer.chars.offset(x, y),
      buffer.chars.offset(x + width, y));
  
  for (let dx = 0; dx < width; ++dx) {
    buffer.foreground.data.set(
        foregroundColor.data,
        buffer.foreground.offset(x + dx, y));
    buffer.background.data.set(
          backgroundColor.data,
          buffer.background.offset(x + dx, y));
  }
}

function hlinePtr(ptr, width, charByte, foregroundColor, backgroundColor) {
  hline(ptr.buffer, ptr.x, ptr.y, width, charByte, foregroundColor, backgroundColor);
}

function putCxel(buffer, x, y, charByte, foregroundColor, backgroundColor) {
  buffer.chars.data[buffer.chars.offset(x, y)] = charByte;
  buffer.foreground.data.set(foregroundColor.data, buffer.foreground.offset(x, y));
  buffer.background.data.set(backgroundColor.data, buffer.background.offset(x, y));
}

function putCxelPtr(ptr, charByte, foregroundColor, backgroundColor) {
  ptr.buffer.chars.data[ptr.charAddr] = charByte;
  ptr.buffer.foreground.data.set(foregroundColor.data, ptr.foregroundAddr);
  ptr.buffer.background.data.set(backgroundColor.data, ptr.backgroundAddr);
}

export {
  rect,
  rectPtr,
  vline,
  vlinePtr,
  hline,
  hlinePtr,
  putCxel,
  putCxelPtr,
};