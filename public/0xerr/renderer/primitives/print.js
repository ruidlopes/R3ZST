import {stringBytes} from '../../stdlib/strings.js';

function sprintPtr(str, ptr, foregroundColor, backgroundColor, clipping) {
  sprint(str, ptr.buffer, ptr.x, ptr.y, foregroundColor, backgroundColor);
}

function sprint(str, buffer, x, y, foregroundColor, backgroundColor, clipping = undefined) {
  const bytes = stringBytes(str);
  
  const clipX = clipping ? clipping.x : 0;
  const clipY = clipping ? clipping.y : 0;
  const clipEndX = clipping ? clipping.x + clipping.width : buffer.width;
  const clipEndY = clipping ? clipping.y + clipping.height : buffer.height;
  
  const startX = Math.max(x, clipX);
  const endX = Math.min(clipEndX, x + bytes.length);
  
  if (y < clipY || y >= clipEndY) {
    return;
  }

  for (let dx = 0; dx < bytes.length; ++dx) {
    const xx = x + dx;
    if (xx < startX || xx >= endX) {
      continue;
    }
    buffer.chars.data[buffer.chars.offset(xx, y)] = bytes[dx];
    buffer.foreground.data.set(
        foregroundColor.data,
        buffer.foreground.offset(xx, y));
    buffer.background.data.set(
        backgroundColor.data,
        buffer.background.offset(xx, y));
  }
}

export {
  sprint,
  sprintPtr,
};