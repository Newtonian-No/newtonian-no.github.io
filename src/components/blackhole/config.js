// ─── 黑洞物理参数与视觉配置 ───
// 所有长度单位为 Rs（事件视界半径 = 8 局部空间单位）

export const PHYSICS = {
  EVENT_HORIZON_R: 8,       // 事件视界局部空间半径
  PHOTON_SPHERE: 1.5,       // 光子球半径 × Rs
  ISCO: 3.0,                // 最内稳定轨道 × Rs

  // 吸积盘范围
  DISK_R_INNER: 2.0,        // × Rs（内缘）
  DISK_R_OUTER: 16.0,       // × Rs（外缘）
  DISK_THICKNESS_INNER: 0.02,
  DISK_THICKNESS_OUTER: 0.20,

  // 开普勒差速
  OMEGA_0: 2.5,
  KEPLER_EXP: -1.5,

  // 多普勒集束
  BETA_MAX: 0.3,            // v/c 内缘最大速度比
  DOPPLER_EXP: 3.0,         // I ∝ D³

  // 引力坍缩
  INFALL_K: 0.005,
  INFALL_INNER: 1.08,       // 销毁阈值 × Rs
  INFALL_OUTER: 3.5,        // 重生外边界 × Rs

  // 引力透镜（屏幕空间）
  EINSTEIN_R: 0.28,         // 爱因斯坦半径（归一化 0-1）
  EVENT_HORIZON_SCREEN: 0.08, // 视界屏幕空间尺寸（归一化）

  // 鼠标跟随
  MOUSE_Y: 0.4,
  MOUSE_X: 0.25,
  LERP: 0.04,
};

export const COUNTS = {
  DISK: 25000,
  PHOTON_RING: 3000,
  INFALL: 8000,
  STARFIELD: 4000,
};

// 吸积盘径向颜色梯度（由内向外，线性插值）
export const DISK_COLORS = [
  { r: 2.0,  hex: "#FFFFFF" },
  { r: 3.0,  hex: "#FFF3D1" },
  { r: 5.0,  hex: "#E5B873" },
  { r: 8.0,  hex: "#6E3916" },
  { r: 12.0, hex: "#231107" },
];

// 光子环颜色
export const PHOTON_RING_COLORS = [
  { hex: "#FFFFFF",   weight: 40 },
  { hex: "#D4EBFF",   weight: 35 },
  { hex: "#A0C8F0",   weight: 25 },
];

// 坍缩粒子颜色（内缘白热 → 外缘暖色）
export const INFALL_COLORS = [
  { r: 1.08, hex: "#FFFFFF" },
  { r: 2.0,  hex: "#FFF3D1" },
  { r: 3.0,  hex: "#FFB347" },
];

// 星场颜色
export const STARFIELD_COLORS = [
  "#FFFFFF", "#C8D6FF", "#FFE8C8", "#A0B0FF",
];
