// ─── 黑洞粒子物理引擎（纯函数）───
// 每帧调用，直接操作 Float32Array buffers

import { PHYSICS } from "./config";

const { OMEGA_0, KEPLER_EXP, BETA_MAX, DOPPLER_EXP, INFALL_K, INFALL_INNER, INFALL_OUTER, EVENT_HORIZON_R } = PHYSICS;

/**
 * 更新吸积盘粒子位置（开普勒差速旋转）
 * 内圈快外圈慢 → 自然拉伸成螺旋细带
 *
 * @param {Float32Array} positions - [x,z,x,z,...] 每粒子 3 分量
 * @param {number} count - 粒子数
 * @param {number} dt - 时间步长（秒）
 */
export function updateAccretionDisk(positions, count, dt) {
  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    const x = positions[ix];
    const z = positions[ix + 2];
    const r = Math.sqrt(x * x + z * z);
    if (r < 0.001) continue;

    const omega = OMEGA_0 * Math.pow(r, KEPLER_EXP);
    const dTheta = omega * dt;

    const cosA = Math.cos(dTheta);
    const sinA = Math.sin(dTheta);
    positions[ix]     = x * cosA - z * sinA;
    positions[ix + 2] = x * sinA + z * cosA;
  }
}

/**
 * 更新引力坍缩粒子位置
 * 径向坍缩 + 叠加开普勒旋转
 * 到达 INFALL_INNER 时重置到外缘
 *
 * @param {Float32Array} positions - 全部粒子位置
 * @param {Float32Array} lifetimes - 每个粒子的生命周期（0-1 或倒计时）
 * @param {number} offset - 坍缩粒子在 positions 中的起始索引
 * @param {number} count - 坍缩粒子数
 * @param {number} dt - 时间步长
 */
export function updateInfalling(positions, lifetimes, offset, count, dt) {
  for (let i = 0; i < count; i++) {
    const idx = offset + i;
    const ix = idx * 3;
    const x = positions[ix];
    const z = positions[ix + 2];
    const r = Math.sqrt(x * x + z * z);

    // 销毁 → 重生
    if (r < INFALL_INNER * EVENT_HORIZON_R) {
      respawnInfall(positions, lifetimes, idx);
      continue;
    }

    // 反立方引力坍缩：dr = -k / r²
    const dr = -INFALL_K / (r * r);
    const newR = r + dr * dt;

    // 开普勒旋转：dθ = ω₀ * r^(-1.5) * dt
    const dTheta = OMEGA_0 * Math.pow(r, KEPLER_EXP) * dt;

    const theta = Math.atan2(z, x) + dTheta;
    positions[ix]     = newR * Math.cos(theta);
    positions[ix + 2] = newR * Math.sin(theta);

    // 生命周期：用于 shader 中的亮度衰减
    lifetimes[idx] = Math.max(0, 1 - (r - INFALL_INNER * EVENT_HORIZON_R) / ((INFALL_OUTER - INFALL_INNER) * EVENT_HORIZON_R));
  }
}

function respawnInfall(positions, lifetimes, idx) {
  const ix = idx * 3;
  const r = (INFALL_INNER + Math.random() * (INFALL_OUTER - INFALL_INNER)) * EVENT_HORIZON_R;
  const theta = Math.random() * Math.PI * 2;
  const y = (Math.random() - 0.5) * EVENT_HORIZON_R * 0.04;

  positions[ix]     = r * Math.cos(theta);
  positions[ix + 1] = y;
  positions[ix + 2] = r * Math.sin(theta);
  lifetimes[idx]    = 1;
}

/**
 * 计算多普勒集束因子 D³
 * 粒子朝向观测者 → 蓝移增亮；远离 → 红移变暗
 *
 * @param {number} theta - 粒子在吸积盘上的方位角（相对 X 轴）
 * @param {number} viewerAngle - 观测者绕 Y 轴的旋转角（默认 0 = +Z 方向）
 * @returns {number} D³ 因子（~0.4 ~ 1.6 范围）
 */
export function dopplerD3(theta, viewerAngle = 0) {
  // 速度方向：吸积盘上沿轨道切向。在方位角 theta 处，
  // 切向方向角 = theta + π/2（逆时针旋转）
  const velAngle = theta + Math.PI / 2;

  // 观测者视线方向（在 XZ 平面上）
  // viewerAngle = 0 时，观测者在 +Z 方向
  const viewDirX = -Math.sin(viewerAngle);
  const viewDirZ = -Math.cos(viewerAngle);

  // cos(速度方向与视线夹角) = dot(vel_dir, view_dir)
  const cosTheta = Math.cos(velAngle) * viewDirX + Math.sin(velAngle) * viewDirZ;
  const beta = BETA_MAX;

  const D = Math.sqrt(1 - beta * beta) / (1 - beta * cosTheta);
  return Math.pow(D, DOPPLER_EXP);
}

/**
 * 温度 → RGB 近似（简化的 Planckian locus）
 * T 单位：归一化温度 0-1（0 = 3000K 暗红，1 = 30000K 蓝白）
 */
export function blackbodyRGB(t) {
  // 分段线性近似：暗红 → 橙 → 黄 → 白 → 蓝白
  const stops = [
    { t: 0.0, r: 0.3, g: 0.06, b: 0.02 },
    { t: 0.2, r: 0.8, g: 0.2, b: 0.05 },
    { t: 0.4, r: 1.0, g: 0.6, b: 0.2 },
    { t: 0.6, r: 1.0, g: 0.9, b: 0.6 },
    { t: 0.8, r: 0.9, g: 0.95, b: 1.0 },
    { t: 1.0, r: 0.7, g: 0.85, b: 1.0 },
  ];

  const i = stops.findIndex(s => s.t >= t);
  if (i <= 0) return stops[0];
  const a = stops[i - 1], b = stops[i];
  const f = (t - a.t) / (b.t - a.t);
  return {
    r: a.r + (b.r - a.r) * f,
    g: a.g + (b.g - a.g) * f,
    b: a.b + (b.b - a.b) * f,
  };
}
