// ─── 吸积盘粒子生成器 ───
// 半径范围 2.0–16.0 Rs，厚度从内向外递增
// 径向颜色梯度：白→奶油→琥珀→焦赭→深红木

import * as THREE from "three";
import { PHYSICS, DISK_COLORS, COUNTS } from "../config";

const { EVENT_HORIZON_R, DISK_R_INNER, DISK_R_OUTER, DISK_THICKNESS_INNER, DISK_THICKNESS_OUTER } = PHYSICS;
const R = EVENT_HORIZON_R;

export function createAccretionDisk() {
  const count = COUNTS.DISK;
  const bufs = allocBufs(count);

  const colorStops = DISK_COLORS.map(c => ({
    r: c.r,
    color: new THREE.Color(c.hex),
  }));

  const rMin = DISK_R_INNER * R;
  const rMax = DISK_R_OUTER * R;
  const thRange = DISK_THICKNESS_OUTER - DISK_THICKNESS_INNER;

  for (let i = 0; i < count; i++) {
    const ix = i * 3;

    // 径向分布：用 sqrt 使外圈密度略高（补偿面积增大）
    const t = Math.sqrt(Math.random());
    const rr = rMin + (rMax - rMin) * t;
    const theta = Math.random() * Math.PI * 2;

    // Y 厚度：线性从薄到厚
    const thickT = (rr - rMin) / (rMax - rMin);
    const y = (Math.random() - 0.5) * (DISK_THICKNESS_INNER + thickT * thRange) * R;

    bufs.pos[ix]     = rr * Math.cos(theta);
    bufs.pos[ix + 1] = y;
    bufs.pos[ix + 2] = rr * Math.sin(theta);

    // 颜色：径向插值
    const col = interpolateColor(rr / R, colorStops);
    bufs.col[ix]     = col.r;
    bufs.col[ix + 1] = col.g;
    bufs.col[ix + 2] = col.b;

    bufs.sizes[i]    = 0.4 + Math.random() * 0.5;
    bufs.thetas[i]   = theta;
    bufs.radii[i]    = t;  // 归一化半径（0=内缘, 1=外缘）
    bufs.types[i]    = 0;  // 吸积盘
  }

  return { ...bufs, count };
}

// ─── 工具 ───

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

function interpolateColor(r, stops) {
  // r 单位：Rs
  let i = stops.length - 1;
  for (let k = 0; k < stops.length; k++) {
    if (r <= stops[k].r) { i = k; break; }
  }
  if (i <= 0) return stops[0].color;

  const a = stops[i - 1], b = stops[i];
  const f = Math.min(1, Math.max(0, (r - a.r) / (b.r - a.r)));
  return new THREE.Color().copy(a.color).lerp(b.color, f);
}
