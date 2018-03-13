function rect(buffer, x, y, width, height, charByte, foregroundColor, backgroundColor, clipping = undefined) {
  const clipX = clipping ? clipping.x : 0;
  const clipY = clipping ? clipping.y : 0;
  const clipEndX = clipping ? clipping.x + clipping.width : buffer.width;
  const clipEndY = clipping ? clipping.y + clipping.height : buffer.height;
  
  const startX = Math.max(x, clipX);
  const startY = Math.max(y, clipY);
  const endX = Math.min(clipEndX, x + width);
  const endY = Math.min(clipEndY, y + height);
  
  for (let yy = startY; yy < endY; ++yy) {
    buffer.chars.data.fill(
        charByte,
        buffer.chars.offset(startX, yy),
        buffer.chars.offset(endX, yy));
    
    for (let xx = startX; xx < endX; ++xx) {
      buffer.foreground.data.set(
          foregroundColor.data,
          buffer.foreground.offset(xx, yy));
      buffer.background.data.set(
          backgroundColor.data,
          buffer.background.offset(xx, yy));
    }
  }
}

function rectPtr(ptr, width, height, charByte, foregroundColor, backgroundColor, clipping) {
  rect(ptr.buffer, ptr.x, ptr.y, width, height, charByte, foregroundColor, backgroundColor, clipping);
}

function vline(buffer, x, y, height, charByte, foregroundColor, backgroundColor, clipping = undefined) {
  const clipX = clipping ? clipping.x : 0;
  const clipY = clipping ? clipping.y : 0;
  const clipEndX = clipping ? clipping.x + clipping.width : buffer.width;
  const clipEndY = clipping ? clipping.y + clipping.height : buffer.height;
  
  if (x < clipX || x >= clipEndX) {
    return;
  }
  
  const startY = Math.max(y, clipY);
  const endY = Math.min(clipEndY, y + height);
  
  for (let yy = startY; yy < endY; ++yy) {
    buffer.chars.data[buffer.chars.offset(x, yy)] = charByte;
    buffer.foreground.data.set(
        foregroundColor.data,
        buffer.foreground.offset(x, yy));
    buffer.background.data.set(
        backgroundColor.data,
        buffer.background.offset(x, yy));
  }
}

function vlinePtr(ptr, height, charByte, foregroundColor, backgroundColor, clipping) {
  vline(ptr.buffer, ptr.x, ptr.y, height, charByte, foregroundColor, backgroundColor, clipping);
}

function hline(buffer, x, y, width, charByte, foregroundColor, backgroundColor, clipping = undefined) {
  const clipX = clipping ? clipping.x : 0;
  const clipY = clipping ? clipping.y : 0;
  const clipEndX = clipping ? clipping.x + clipping.width : buffer.width;
  const clipEndY = clipping ? clipping.y + clipping.height : buffer.height;
  
  if (y < clipY || y >= clipEndY) {
    return;
  }
  
  const startX = Math.max(x, clipX);
  const endX = Math.min(clipEndX, x + width);
  
  buffer.chars.data.fill(
      charByte,
      buffer.chars.offset(startX, y),
      buffer.chars.offset(endX, y));
  
  for (let xx = startX; xx < endX; ++xx) {
    buffer.foreground.data.set(
        foregroundColor.data,
        buffer.foreground.offset(xx, y));
    buffer.background.data.set(
        backgroundColor.data,
        buffer.background.offset(xx, y));
  }
}

function hlinePtr(ptr, width, charByte, foregroundColor, backgroundColor, clipping = undefined) {
  hline(ptr.buffer, ptr.x, ptr.y, width, charByte, foregroundColor, backgroundColor, clipping);
}

function putCxel(buffer, x, y, charByte, foregroundColor, backgroundColor, clipping = undefined) {
  const clipX = clipping ? clipping.x : 0;
  const clipY = clipping ? clipping.y : 0;
  const clipEndX = clipping ? clipping.x + clipping.width : buffer.width;
  const clipEndY = clipping ? clipping.y + clipping.height : buffer.height;
  
  const startX = Math.max(x, clipX);
  const startY = Math.max(y, clipY);
  const endX = Math.min(clipEndX, x + 1);
  const endY = Math.min(clipEndY, y + 1);
  
  if (x >= startX && x < endX && y >= startY && y < endY) {
    buffer.chars.data[buffer.chars.offset(x, y)] = charByte;
    buffer.foreground.data.set(foregroundColor.data, buffer.foreground.offset(x, y));
    buffer.background.data.set(backgroundColor.data, buffer.background.offset(x, y));
  }
}

function putCxelPtr(ptr, charByte, foregroundColor, backgroundColor, clipping) {
  putCxel(ptr.buffer, ptr.x, ptr.y, charByte, foregroundColor, backgroundColor, clipping);
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