// ─── 引力坍缩粒子生成器 ───
// 在 ISCO 附近生成，螺旋坠入视界，重生到外缘
// physics.js 的 updateInfalling 负责每帧位置更新

import * as THREE from "three";
import { PHYSICS, COUNTS } from "../config";

const { EVENT_HORIZON_R, INFALL_INNER, INFALL_OUTER } = PHYSICS;
const R = EVENT_HORIZON_R;

export function createInfallingStream() {
  const count = COUNTS.INFALL;
  const bufs = allocBufs(count);

  // 坍缩粒子颜色：白热为主
  const baseColor = new THREE.Color("#FFFFFF");
  const warmColor = new THREE.Color("#FFE0B0");

  for (let i = 0; i < count; i++) {
    const ix = i * 3;

    // 均匀分布在 [INFALL_INNER, INFALL_OUTER]
    const r = (INFALL_INNER + Math.random() * (INFALL_OUTER - INFALL_INNER)) * R;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * R * 0.02;  // 极薄盘面

    bufs.pos[ix]     = r * Math.cos(theta);
    bufs.pos[ix + 1] = y;
    bufs.pos[ix + 2] = r * Math.sin(theta);

    // 颜色向暖色偏一点
    const t = (r / R - INFALL_INNER) / (INFALL_OUTER - INFALL_INNER);
    const col = new THREE.Color().copy(baseColor).lerp(warmColor, t * 0.3);
    bufs.col[ix]     = col.r;
    bufs.col[ix + 1] = col.g;
    bufs.col[ix + 2] = col.b;

    bufs.sizes[i]    = 0.3 + Math.random() * 0.4;
    bufs.thetas[i]   = theta;
    bufs.radii[i]    = (r / R - INFALL_INNER) / (INFALL_OUTER - INFALL_INNER);
    bufs.types[i]    = 2;  // 坍缩
  }

  return { ...bufs, count };
}

export function createLifetimes(count) {
  const lifetimes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    lifetimes[i] = 1;
  }
  return lifetimes;
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
