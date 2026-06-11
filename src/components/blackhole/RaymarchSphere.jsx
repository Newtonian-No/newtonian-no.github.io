// ─── RaymarchSphere — 单球 + TSL raymarching 黑洞 ───
// 移植自 Singularity (MisterPrada)，简化版，WebGPU only

import React, { useRef, useEffect } from "react";
import * as THREE from "three/webgpu";
import {
  Fn, uniform, vec3, float, Loop, If, Break,
  sin, cos, mix, smoothstep, clamp, abs,
  length as tslLength, normalize as tslNormalize, dot,
  add, sub, mul, div, oneMinus,
  positionGeometry, positionWorld, cameraPosition,
  modelWorldMatrix, faceDirection, time,
  texture, interleavedGradientNoise,
  emissive, PI,
} from "three/tsl";
import { createNoiseTexture } from "./NoiseTexture";

export default function RaymarchSphere() {
  const containerRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    let cleanupFn;

    (async () => {
      const ctr = containerRef.current;
      if (!ctr) return;
      const w = ctr.clientWidth;
      const h = ctr.clientHeight;

      // WebGPU 渲染器
      const renderer = new THREE.WebGPURenderer({ alpha: true, antialias: false });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      ctr.appendChild(renderer.domElement);
      await renderer.init();

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
      camera.position.set(0, 0.35, 2.2);
      camera.lookAt(0, 0, 0);

      const noiseTex = createNoiseTexture(256);
      noiseTex.wrapS = THREE.RepeatWrapping;
      noiseTex.wrapT = THREE.RepeatWrapping;
      noiseTex.needsUpdate = true;

      const geo = new THREE.SphereGeometry(1, 32, 32);
      const mat = new THREE.MeshStandardNodeMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
      });

      const uStepSize = uniform(float(0.008));
      const uPower = uniform(float(0.25));
      const uOriginR = uniform(float(0.14));
      const uBandWidth = uniform(float(0.025));
      const uTime = uniform(float(0));

      mat.colorNode = Fn(() => {
        const objPos = positionGeometry;
        const isBack = clamp(faceDirection.negate(), 0, 1);
        // sphere at world origin, cameraPosition world ≈ object-space camera
        const camObj = cameraPosition;
        const viewWorld = tslNormalize(sub(cameraPosition, positionWorld));
        const viewObj = viewWorld.mul(modelWorldMatrix).mul(vec3(1, 1, 1));
        const startPos = mix(objPos, camObj, isBack);
        // march INTO the sphere (opposite of view direction)
        const marchDir = viewObj.negate();
        const jitter = interleavedGradientNoise(positionGeometry.xy).mul(uStepSize);
        const rayOrigin = startPos.add(marchDir.mul(jitter));

        const rayPos = rayOrigin.toVar();
        const rayDir = marchDir.toVar();
        const colorAcc = vec3(0, 0, 0).toVar();
        const alphaAcc = float(0).toVar();
        const outColor = vec3(0, 0, 0).toVar();
        const sf = uStepSize;
        const pf = uPower;
        const of = uOriginR;
        const bf = uBandWidth;

        Loop(128, () => {
          const rLen = tslLength(rayPos);
          const rNorm = tslNormalize(rayPos);
          const steerMag = sf.mul(pf).div(rLen.mul(rLen));
          const rangeF = smoothstep(float(1.0), of.mul(3), rLen);
          const steer = rNorm.mul(steerMag.mul(rangeF).mul(-1));
          const steered = tslNormalize(rayDir.add(steer));

          rayPos.addAssign(rayDir.mul(sf));
          rayDir.assign(steered);

          const rNow = tslLength(rayPos);
          const xyR = tslLength(rayPos.mul(vec3(1, 0, 1)));

          If(rNow.greaterThan(float(1.0)), () => { Break(); });

          const insideCore = rNow.lessThan(of);
          const zAbs = abs(rayPos.y);
          const zBand = smoothstep(bf, float(0), zAbs);
          const uvNoise = rayPos.mul(vec3(1, 1, 0)).mul(1.5)
            .add(vec3(uTime.mul(0.02), uTime.mul(0.03), 0));
          const noiseVal = texture(noiseTex, uvNoise.xz).r;
          const density = noiseVal.mul(zBand)
            .mul(smoothstep(of.mul(1.5), of.mul(0.8), xyR));

          const colorT = clamp(xyR.sub(of).div(float(1.0).sub(of)), 0, 1);
          const rampCol = mix(
            vec3(1.0, 0.95, 0.85),
            vec3(0.0, 0.0, 0.0),
            colorT.add(noiseVal.sub(0.5).mul(0.3))
          );

          const alpha = float(1.0); // DEBUG: 暴力 alpha 测试
          const oneMinusA = oneMinus(alphaAcc);
          colorAcc.assign(mix(colorAcc, rampCol, oneMinusA.mul(alpha)));
          alphaAcc.assign(mix(alphaAcc, float(1), alpha));
          colorAcc.assign(mix(colorAcc, vec3(0, 0, 0), insideCore));
        });

        const trans = oneMinus(alphaAcc);
        outColor.assign(mix(colorAcc, vec3(0, 0, 0), trans));
        return outColor;
      })();

      mat.emissiveNode = mat.colorNode;

      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      // 鼠标跟随
      const mouse = { x: 0, y: 0 };
      const rot = { x: 0.3, y: 0 };
      const LERP = 0.04;
      const onMouse = (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener("mousemove", onMouse);

      // 动画循环
      let lastTime = performance.now();
      function animate() {
        animRef.current = requestAnimationFrame(animate);
        const now = performance.now();
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;
        uTime.value += dt;
        const ty = mouse.x * 0.3;
        const tx = 0.3 + mouse.y * 0.2;
        rot.y += (ty - rot.y) * LERP;
        rot.x += (tx - rot.x) * LERP;
        mesh.rotation.y = rot.y;
        mesh.rotation.x = rot.x;
        renderer.render(scene, camera);
      }
      animate();

      const onResize = () => {
        const nw = ctr.clientWidth, nh = ctr.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener("resize", onResize);

      cleanupFn = () => {
        cancelAnimationFrame(animRef.current);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("mousemove", onMouse);
        renderer.dispose();
        geo.dispose();
        mat.dispose();
        noiseTex.dispose();
        if (ctr.contains(renderer.domElement)) ctr.removeChild(renderer.domElement);
      };
    })();

    return () => { if (cleanupFn) cleanupFn(); };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0" style={{ pointerEvents: "none" }} />;
}
