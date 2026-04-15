// ═══ RENDERER MODULE ═══
// Pixel art engine — 24×32 canvas

function hexToRgb(hex) {
  const m = hex.match(/^#(..)(..)(..)/);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
}

// Draw pixel grid onto canvas context
export function D(ctx, w, h, grid, pal) {
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    const row = grid[y] || '';
    for (let x = 0; x < w; x++) {
      const c = row[x];
      if (!c || c === '.') continue;
      const hex = pal[c];
      if (!hex) continue;
      const [R, G, B] = hexToRgb(hex);
      const i = (y * w + x) * 4;
      img.data[i] = R;
      img.data[i + 1] = G;
      img.data[i + 2] = B;
      img.data[i + 3] = 255;
    }
  }
  ctx.clearRect(0, 0, w, h);
  ctx.putImageData(img, 0, 0);
}

// Draw with horizontal flip
export function H(ctx, w, h, grid, pal) {
  ctx.save();
  ctx.scale(-1, 1);
  ctx.translate(-w, 0);
  D(ctx, w, h, grid, pal);
  ctx.restore();
}
