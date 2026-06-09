import React, { useRef, useEffect } from "react";
import * as THREE from "three";

// ═══════════════════════════════════════════
// 样式选择：'saturn' → 土星 | 'gargantua' → 卡冈图亚黑洞
// ═══════════════════════════════════════════
const STYLE = "gargantua";

const VERTEX_SHADER = `
attribute float size;
attribute vec3 customColor;
attribute float opacityAttr;
attribute float orbitSpeed;
attribute float aRandomId;
varying vec3 vColor;
varying float vOpacity;
uniform float uTime;

mat2 rotate2d(float _angle) {
  return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}

void main() {
  vec3 pos = position;
  if (orbitSpeed > 0.0) {
    float angle = uTime * orbitSpeed * 0.3;
    vec2 rotated = rotate2d(angle) * pos.xz;
    pos.x = rotated.x; pos.z = rotated.y;
  } else {
    float bodyAngle = uTime * 0.05;
    vec2 rotated = rotate2d(bodyAngle) * pos.xz;
    pos.x = rotated.x; pos.z = rotated.y;
  }
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * (200.0 / -mvPosition.z);
  gl_PointSize = clamp(gl_PointSize, 0.5, 80.0);
  vColor = customColor;
  vOpacity = opacityAttr;
}
`;

const makeFragmentShader = (gp) => `
varying vec3 vColor;
varying float vOpacity;
void main() {
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  float r = dot(cxy, cxy);
  if (r > 1.0) discard;
  float glow = pow(1.0 - r, ${gp.toFixed(1)});
  gl_FragColor = vec4(vColor, glow * vOpacity);
}
`;

const STYLES = {
  saturn: {
    scale: 1.8, glowPower: 1.5, initRotX: 0.2, initRotY: 0.15,
    showEventHorizon: false,
    totalBody: 3000,
    bodyColors: [
      new THREE.Color("#E3DAC5"), new THREE.Color("#C9A070"),
      new THREE.Color("#D4C4A8"), new THREE.Color("#B08D55"),
    ],
    bodyOpacity: 0.7,
    totalDisk: 12000,
    diskZones: [
      { inner: 1.24, outer: 1.52, color: "#3A3530", size: 0.5, opacity: 0.2, weight: 10 },
      { inner: 1.52, outer: 1.95, color: "#CDBFA0", size: 0.9, opacity: 0.7, weight: 50 },
      { inner: 1.95, outer: 2.02, color: "#0A0A0A", size: 0.2, opacity: 0.05, weight: 2 },
      { inner: 2.02, outer: 2.27, color: "#989085", size: 0.7, opacity: 0.5, weight: 30 },
      { inner: 2.32, outer: 2.34, color: "#AFAFA0", size: 1.0, opacity: 0.5, weight: 8 },
    ],
    diskThicknessInner: 0.15, diskThicknessOuter: 0.4,
    dopplerBoost: false,
    totalHalo: 0, haloMajor: 0, haloMinor: 0,
    haloColors: [], haloWeights: [],
  },

  gargantua: {
    scale: 1.8, glowPower: 2.8, initRotX: 0.2, initRotY: 0.15,
    showEventHorizon: true,
    totalBody: 0, bodyColors: [], bodyOpacity: 0,
    // 吸积盘（水平扁平）
    totalDisk: 18000,
    diskZones: [
      { inner: 2.00, outer: 2.50, color: "#FFFFFF", size: 0.6, opacity: 1.0, weight: 18 },
      { inner: 2.50, outer: 4.50, color: "#FFF3D1", size: 0.6, opacity: 0.90, weight: 25 },
      { inner: 4.50, outer: 7.00, color: "#E5B873", size: 0.5, opacity: 0.60, weight: 25 },
      { inner: 7.00, outer: 12.0, color: "#6E3916", size: 0.3, opacity: 0.30, weight: 17 },
      { inner: 12.0, outer: 16.0, color: "#231107", size: 0.15, opacity: 0.08, weight: 15 },
    ],
    diskThicknessInner: 0.02, diskThicknessOuter: 0.20,
    dopplerBoost: true,
    // 光子环：赤道面扁平环 @ 1.5Rs（光子球半径）
    totalHalo: 3000,
    haloRadius: 1.5,     // 光子环半径（Rs 倍数）= 1.5Rs
    haloColors: [
      { color: "#FFFFFF", weight: 50 },
      { color: "#D4EBFF", weight: 35 },
      { color: "#A0C8F0", weight: 15 },
    ],
    haloWeights: [50, 35, 15],
  },
};

const cfg = STYLES[STYLE];
const FRAGMENT_SHADER = makeFragmentShader(cfg.glowPower);

const {
  scale: S, glowPower, initRotX: RX, initRotY: RY,
  showEventHorizon,
  totalBody: N_BODY, bodyColors: BODY_C, bodyOpacity: BODY_A,
  totalDisk: N_DISK, diskZones: DISK_Z,
  diskThicknessInner: TH_IN, diskThicknessOuter: TH_OUT,
  dopplerBoost: DOPPLER,
  totalHalo: N_HALO, haloRadius: HR,
  haloColors: HALO_C, haloWeights: HALO_W,
} = cfg;

const R = 8;               // 事件视界半径（局部空间）
const TOTAL = N_BODY + N_DISK + N_HALO;
const MOUSE_Y = 0.4, MOUSE_X = 0.25, LERP = 0.04;

// ─── 辅助：扁平环（赤道面 Y≈0） ───
function ringPos(radius, ringThickness) {
  const theta = Math.random() * Math.PI * 2;
  const r = radius + (Math.random() - 0.5) * ringThickness;
  return {
    x: r * Math.cos(theta),
    y: (Math.random() - 0.5) * 0.06,  // 极其微小的 Y 偏移（扁平环）
    z: r * Math.sin(theta),
    theta,
  };
}

function StarRing() {
  const containerRef = useRef(null);
  const frameIdRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rotRef = useRef({ x: RX, y: RY });

  useEffect(() => {
    const ctr = containerRef.current;
    if (!ctr) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, ctr.clientWidth / ctr.clientHeight, 1, 1000);
    camera.position.z = 55; camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(ctr.clientWidth, ctr.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    ctr.appendChild(renderer.domElement);

    // ─── Group：统一缩放球体 + 粒子 ───
    const group = new THREE.Group();
    group.scale.set(S, S, S);
    group.rotation.z = 26.73 * (Math.PI / 180);
    scene.add(group);

    // 事件视界球体
    if (showEventHorizon) {
      const hGeo = new THREE.SphereGeometry(R, 64, 64);
      const hMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      group.add(new THREE.Mesh(hGeo, hMat));
    }

    // ─── 粒子几何体 ───
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(TOTAL * 3);
    const col = new Float32Array(TOTAL * 3);
    const siz = new Float32Array(TOTAL);
    const opa = new Float32Array(TOTAL);
    const spd = new Float32Array(TOTAL);
    const rid = new Float32Array(TOTAL);

    let i = 0;

    // 1. 球体粒子
    for (; i < N_BODY; i++) {
      rid[i] = Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const rawY = R * Math.cos(phi);
      pos[i * 3] = R * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = rawY * 0.9;
      pos[i * 3 + 2] = R * Math.sin(phi) * Math.sin(theta);

      const lat = (rawY / R + 1) * 0.5;
      const bn = Math.cos(lat * 40) * 0.6 + Math.cos(lat * 15) * 0.4;
      let ci = Math.floor(lat * 4 + bn) % BODY_C.length;
      if (ci < 0) ci = 0;
      const bc = BODY_C[ci];
      col[i * 3] = bc.r; col[i * 3 + 1] = bc.g; col[i * 3 + 2] = bc.b;
      siz[i] = 0.8 + Math.random() * 0.6;
      opa[i] = BODY_A;
      spd[i] = 0;
    }

    // 2. 吸积盘
    const dTw = DISK_Z.reduce((s, z) => s + z.weight, 0);
    const tr = TH_OUT - TH_IN;
    const rMin = R * 2, rMax = R * 16;
    const startDisk = i;

    for (; i < N_BODY + N_DISK; i++) {
      rid[i] = Math.random();
      let pick = Math.random() * dTw, zone = DISK_Z[0], acc = 0;
      for (const z of DISK_Z) { acc += z.weight; if (pick <= acc) { zone = z; break; } }
      const rr = R * (zone.inner + Math.random() * (zone.outer - zone.inner));
      const theta = Math.random() * Math.PI * 2;
      pos[i * 3] = rr * Math.cos(theta);
      pos[i * 3 + 2] = rr * Math.sin(theta);

      const t = (rr - rMin) / (rMax - rMin);
      pos[i * 3 + 1] = (Math.random() - 0.5) * (TH_IN + Math.max(0, Math.min(1, t)) * tr);

      let dop = 1.0;
      if (DOPPLER) dop = 0.4 + 1.6 * (1.0 - Math.max(0, Math.cos(theta)));

      const cc = new THREE.Color(zone.color);
      col[i * 3] = cc.r; col[i * 3 + 1] = cc.g; col[i * 3 + 2] = cc.b;
      siz[i] = zone.size + (Math.random() - 0.5) * 0.3;
      opa[i] = zone.opacity * dop;
      spd[i] = 6.0 / Math.sqrt(rr);
    }

    // 3. 光子环：赤道面扁平环 @ 1.5Rs
    const hTw = HALO_W.reduce((s, w) => s + w, 0);
    const ringR = R * HR;
    const ringThick = 0.4;  // 环面径向宽度（小 → 细环）

    for (; i < TOTAL; i++) {
      rid[i] = Math.random();
      const rp = ringPos(ringR, ringThick);
      pos[i * 3] = rp.x;
      pos[i * 3 + 1] = rp.y;
      pos[i * 3 + 2] = rp.z;

      let pick = Math.random() * hTw, acc = 0, ci = 0;
      for (let k = 0; k < HALO_W.length; k++) {
        acc += HALO_W[k]; if (pick <= acc) { ci = k; break; }
      }
      const hc = new THREE.Color(HALO_C[ci].color);
      col[i * 3] = hc.r; col[i * 3 + 1] = hc.g; col[i * 3 + 2] = hc.b;
      siz[i] = 1.0 + Math.random() * 0.8;  // 大粒子，确保可见
      opa[i] = 0.95;
      spd[i] = 0;  // 光子环不旋转（这是弯曲光的投影，不是轨道物质）
    }

    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("customColor", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(siz, 1));
    geo.setAttribute("opacityAttr", new THREE.BufferAttribute(opa, 1));
    geo.setAttribute("orbitSpeed", new THREE.BufferAttribute(spd, 1));
    geo.setAttribute("aRandomId", new THREE.BufferAttribute(rid, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER, fragmentShader: FRAGMENT_SHADER,
      uniforms: { uTime: { value: 0 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });

    group.add(new THREE.Points(geo, mat));

    const onMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouse);

    const clock = new THREE.Clock();
    function animate() {
      frameIdRef.current = requestAnimationFrame(animate);
      mat.uniforms.uTime.value = clock.getElapsedTime();
      const ty = mouseRef.current.x * MOUSE_Y;
      const tx = RX + mouseRef.current.y * MOUSE_X;
      rotRef.current.y += (ty - rotRef.current.y) * LERP;
      rotRef.current.x += (tx - rotRef.current.x) * LERP;
      group.rotation.y = rotRef.current.y;
      group.rotation.x = rotRef.current.x;
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      camera.aspect = ctr.clientWidth / ctr.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(ctr.clientWidth, ctr.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      renderer.dispose(); geo.dispose(); mat.dispose();
      if (ctr.contains(renderer.domElement)) ctr.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0" style={{ pointerEvents: "none" }} />;
}

export default StarRing;
