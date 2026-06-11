// ─── 噪声纹理生成器（JS 端）───
// 避免在 TSL 中写复杂噪声函数，预生成纹理传给 shader

import * as THREE from "three/webgpu";

export function createNoiseTexture(size = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(size, size);

  // Simple value noise with multiple octaves
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      let v = 0, amp = 1, freq = 4, total = 0;
      for (let o = 0; o < 4; o++) {
        const sx = (x / size) * freq;
        const sy = (y / size) * freq;
        const ix = Math.floor(sx);
        const iy = Math.floor(sy);
        const fx = sx - ix;
        const fy = sy - iy;
        const a = hash(ix, iy);
        const b = hash(ix + 1, iy);
        const c = hash(ix, iy + 1);
        const d = hash(ix + 1, iy + 1);
        const u = fx * fx * (3 - 2 * fx);
        const n = a + (b - a) * u + (c - a) * fy * (1 - u) + (d - c) * u * fy;
        v += n * amp;
        total += amp;
        amp *= 0.5;
        freq *= 2;
      }
      const val = Math.floor(((v / total) * 0.5 + 0.5) * 255);
      imageData.data[i] = val;
      imageData.data[i + 1] = val;
      imageData.data[i + 2] = val;
      imageData.data[i + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return new THREE.CanvasTexture(canvas);
}

function hash(x, y) {
  let h = x * 374761393 + y * 668265263 + 1274126177;
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return (h & 0x7fffffff) / 0x7fffffff;
}
