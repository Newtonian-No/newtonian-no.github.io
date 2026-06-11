// ─── 光子环生成器 ───
// 扁平赤道面环（非 torus！）
// 半径 1.5Rs（光子球），极薄 Y 偏移

import * as THREE from "three";
import { PHYSICS, PHOTON_RING_COLORS, COUNTS } from "../config";

const { EVENT_HORIZON_R, PHOTON_SPHERE } = PHYSICS;
const R = EVENT_HORIZON_R;

export function createPhotonRing() {
  const count = COUNTS.PHOTON_RING;
  const bufs = allocBufs(count);

  const majorR = PHOTON_SPHERE * R;
  const halfThick = R * 0.03;  // 极薄：±0.03Rs

  // 构建加权颜色数组
  const colors = [];
  for (const c of PHOTON_RING_COLORS) {
    for (let k = 0; k < c.weight; k++) colors.push(new THREE.Color(c.hex));
  }

  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    const theta = Math.random() * Math.PI * 2;

    // 径向微扰
    const r = majorR + (Math.random() - 0.5) * R * 0.05;

    bufs.pos[ix]     = r * Math.cos(theta);
    bufs.pos[ix + 1] = (Math.random() - 0.5) * halfThick * 2;
    bufs.pos[ix + 2] = r * Math.sin(theta);

    const col = colors[Math.floor(Math.random() * colors.length)];
    bufs.col[ix]     = col.r;
    bufs.col[ix + 1] = col.g;
    bufs.col[ix + 2] = col.b;

    bufs.sizes[i]    = 1.2 + Math.random() * 0.6;
    bufs.thetas[i]   = theta;
    bufs.radii[i]    = 0;
    bufs.types[i]    = 1;  // 光子环
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
