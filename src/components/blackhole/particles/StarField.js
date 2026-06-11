// ─── 背景星场生成器 ───
// 远场星点，均匀分布在球壳上，固定不旋转

import * as THREE from "three";
import { STARFIELD_COLORS, COUNTS } from "../config";

export function createStarField() {
  const count = COUNTS.STARFIELD;
  const bufs = allocBufs(count);
  const colors = STARFIELD_COLORS.map(c => new THREE.Color(c));

  const radius = 60;  // 远场半径

  for (let i = 0; i < count; i++) {
    const ix = i * 3;

    // 球面均匀分布
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    bufs.pos[ix]     = radius * Math.sin(phi) * Math.cos(theta);
    bufs.pos[ix + 1] = radius * Math.sin(phi) * Math.sin(theta);
    bufs.pos[ix + 2] = radius * Math.cos(phi);

    const col = colors[Math.floor(Math.random() * colors.length)];
    const brightness = 0.3 + Math.random() * 0.7;
    bufs.col[ix]     = col.r * brightness;
    bufs.col[ix + 1] = col.g * brightness;
    bufs.col[ix + 2] = col.b * brightness;

    bufs.sizes[i]    = 0.3 + Math.random() * 0.7;
    bufs.thetas[i]   = 0;
    bufs.radii[i]    = 0;
    bufs.types[i]    = 3;  // 星场
  }

  return { ...bufs, count };
}

function allocBufs(n) {
  return {
    pos:   new Float32Array(n * 3),
    col:   new Float32Array(n * 3),
    sizes: new Float32Array(n),
    thetas:new Float32Array(n),
    radii: new Float32Array(n),
    types: new Float32Array(n),
  };
}
