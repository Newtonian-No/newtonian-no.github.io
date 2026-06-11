// ─── 黑洞渲染核心 Hook ───
// 管理 Three.js 生命周期、粒子更新、后处理、鼠标跟随

import { useRef, useEffect } from "react";
import * as THREE from "three";

// ─── 粒子着色器（内联）───
const VERTEX = /* glsl */ `
attribute float size;
attribute float aTheta;
attribute float aRadius;
attribute float aType;
attribute vec3 aBaseColor;

varying float vTheta;
varying float vRadius;
varying float vType;
varying vec3 vBaseColor;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  float baseSize = size * (180.0 / -mvPosition.z);
  gl_PointSize = clamp(baseSize, 0.3, 60.0);
  vTheta = aTheta;
  vRadius = aRadius;
  vType  = aType;
  vBaseColor = aBaseColor;
}
`;

const FRAGMENT = /* glsl */ `
varying float vTheta;
varying float vRadius;
varying float vType;
varying vec3 vBaseColor;

float dopplerD3(float theta) {
  float beta = 0.3;
  float velAngle = theta + 1.5708;
  float cosView = -sin(velAngle);
  float D = sqrt(1.0 - beta * beta) / (1.0 - beta * cosView);
  return D * D * D;
}

void main() {
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  float r = dot(cxy, cxy);
  if (r > 1.0) discard;

  float glow = pow(1.0 - r, 2.2);
  vec3 color = vBaseColor;

  if (vType < 1.5 || (vType > 1.5 && vType < 2.5)) {
    float d3 = dopplerD3(vTheta);
    color *= d3;
    float tempBoost = 1.0 + (1.0 - clamp(vRadius, 0.0, 1.0)) * 2.0;
    color *= tempBoost;
  }

  if (vType > 1.5 && vType < 2.5) {
    float infallBoost = 1.0 + (1.0 - clamp(vRadius, 0.0, 1.0)) * 3.0;
    color *= infallBoost;
    glow = pow(1.0 - r, 3.0);
  }

  if (vType > 0.5 && vType < 1.5) {
    glow = pow(1.0 - r, 3.5);
  }

  if (vType > 2.5) {
    glow = pow(1.0 - r, 1.2);
  }

  gl_FragColor = vec4(color, glow);
}
`;
import { GravitationalLens } from "./GravitationalLens";
import { createAccretionDisk } from "./particles/AccretionDisk";
import { createPhotonRing } from "./particles/PhotonRing";
import { createInfallingStream, createLifetimes } from "./particles/InfallingStream";
import { createStarField } from "./particles/StarField";
import { updateAccretionDisk, updateInfalling } from "./physics";
import { PHYSICS, COUNTS } from "./config";

const { EVENT_HORIZON_R, MOUSE_X, MOUSE_Y, LERP } = PHYSICS;
const R = EVENT_HORIZON_R;

export function useBlackHole(containerRef) {
  const animRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const ctr = containerRef.current;
    if (!ctr) return;

    const w = ctr.clientWidth;
    const h = ctr.clientHeight;

    // ─── Scene / Camera / Renderer ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 1, 500);
    camera.position.z = 55;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    ctr.appendChild(renderer.domElement);

    // ─── Group：统一缩放 ───
    const group = new THREE.Group();
    group.scale.set(0.9, 0.9, 0.9);
    scene.add(group);

    // 事件视界球体
    const hGeo = new THREE.SphereGeometry(R, 64, 64);
    const hMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    group.add(new THREE.Mesh(hGeo, hMat));

    // ─── 生成粒子数据 ───
    const disk    = createAccretionDisk();
    const ring    = createPhotonRing();
    const infall  = createInfallingStream();
    const stars   = createStarField();
    const infallLifetimes = createLifetimes(COUNTS.INFALL);

    const total = COUNTS.DISK + COUNTS.PHOTON_RING + COUNTS.INFALL + COUNTS.STARFIELD;
    const particleOrder = [
      { data: disk,   name: "disk" },
      { data: ring,   name: "ring" },
      { data: infall, name: "infall" },
      { data: stars,  name: "star" },
    ];

    // 拼接 buffers
    const pos   = new Float32Array(total * 3);
    const col   = new Float32Array(total * 3);
    const sizes = new Float32Array(total);
    const thetas= new Float32Array(total);
    const radii = new Float32Array(total);
    const types = new Float32Array(total);

    let offset = 0;
    const offsets = {};
    for (const { data, name } of particleOrder) {
      offsets[name] = offset;
      pos.set(data.pos, offset * 3);
      col.set(data.col, offset * 3);
      sizes.set(data.sizes, offset);
      thetas.set(data.thetas, offset);
      radii.set(data.radii, offset);
      types.set(data.types, offset);
      offset += data.count;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position",    new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aBaseColor",  new THREE.BufferAttribute(col, 3));
    geo.setAttribute("size",        new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aTheta",      new THREE.BufferAttribute(thetas, 1));
    geo.setAttribute("aRadius",     new THREE.BufferAttribute(radii, 1));
    geo.setAttribute("aType",       new THREE.BufferAttribute(types, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {},
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    group.add(new THREE.Points(geo, mat));

    // ─── 引力透镜后处理 ───
    const lens = new GravitationalLens(renderer, w, h);

    // ─── 鼠标事件 ───
    const onMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouse);

    // ─── 动画循环 ───
    const clock = new THREE.Clock();
    const rotRef = { x: 0.4, y: 0.3 };  // 初始旋转

    function animate() {
      animRef.current = requestAnimationFrame(animate);

      const dt = Math.min(clock.getDelta(), 0.1);  // cap 防止大帧跳跃

      // 1. 更新吸积盘粒子位置
      const diskStart = offsets.disk;
      updateAccretionDisk(pos, COUNTS.DISK, dt);

      // 2. 更新坍缩粒子位置
      const infallStart = offsets.infall;
      updateInfalling(pos, infallLifetimes, infallStart, COUNTS.INFALL, dt);

      // 3. 更新 thetas（位置变化后重算方位角）
      for (let i = diskStart; i < diskStart + COUNTS.DISK; i++) {
        const x = pos[i * 3], z = pos[i * 3 + 2];
        thetas[i] = Math.atan2(z, x);
      }
      for (let i = infallStart; i < infallStart + COUNTS.INFALL; i++) {
        const x = pos[i * 3], z = pos[i * 3 + 2];
        thetas[i] = Math.atan2(z, x);
      }

      // 标记 buffer 更新
      geo.attributes.position.needsUpdate = true;
      geo.attributes.aTheta.needsUpdate = true;

      // 4. 鼠标跟随
      const ty = mouseRef.current.x * MOUSE_Y;
      const tx = 0.4 + mouseRef.current.y * MOUSE_X;
      rotRef.y += (ty - rotRef.y) * LERP;
      rotRef.x += (tx - rotRef.x) * LERP;
      group.rotation.y = rotRef.y;
      group.rotation.x = rotRef.x;

      // 5. 渲染（通过透镜后处理）
      lens.render(scene, camera);
    }
    animate();

    // ─── Resize ───
    const onResize = () => {
      const nw = ctr.clientWidth, nh = ctr.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      lens.resize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    // ─── Cleanup ───
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      hGeo.dispose();
      hMat.dispose();
      lens.dispose();
      if (ctr.contains(renderer.domElement)) ctr.removeChild(renderer.domElement);
    };
  }, [containerRef]);
}
