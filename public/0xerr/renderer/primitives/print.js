const encoder = new TextEncoder();

function sprintPtr(str, ptr, foregroundColor, backgroundColor) {
  sprint(str, ptr.buffer, ptr.x, ptr.y, foregroundColor, backgroundColor);
}

function sprint(str, buffer, x, y, foregroundColor, backgroundColor) {
  const bytes = encoder.encode(str);
  buffer.chars.data.set(bytes, buffer.chars.offset(x, y));
  
  for (let dx = 0; dx < bytes.length; ++dx) {
    buffer.foreground.data.set(
        foregroundColor.data,
        buffer.foreground.offset(x + dx, y));
    buffer.background.data.set(
        backgroundColor.data,
        buffer.background.offset(x + dx, y));
  }
}

export {
  sprint,
  sprintPtr,
};