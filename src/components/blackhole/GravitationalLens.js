// ─── 屏幕空间引力透镜后处理 ───
// 渲染管线：场景 → RenderTarget → 全屏 quad 扭曲 → canvas

import * as THREE from "three";

const LENSING_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const LENSING_FRAG = /* glsl */ `
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform vec2 uBlackHoleProj;
uniform float uEinsteinRadius;
uniform float uEventHorizonR;

varying vec2 vUv;

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = vUv;
  vec2 center = uBlackHoleProj;

  vec2 toCenter = (uv - center) * vec2(aspect, 1.0);
  float dist = length(toCenter);

  if (dist < uEventHorizonR) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  float deflection = (uEinsteinRadius * uEinsteinRadius) / (dist + 0.001);
  vec2 deflectedUv = uv + normalize(toCenter) * deflection * vec2(1.0 / aspect, 1.0);
  deflectedUv = clamp(deflectedUv, 0.0, 1.0);

  vec4 color = texture2D(tDiffuse, deflectedUv);

  float vignette = smoothstep(uEventHorizonR * 1.5, uEventHorizonR * 4.0, dist);
  color.rgb *= mix(0.6, 1.0, vignette);

  gl_FragColor = color;
}
`;
import { PHYSICS } from "./config";

export class GravitationalLens {
  constructor(renderer, width, height) {
    this.renderer = renderer;

    // RenderTarget：存储场景渲染结果
    this.target = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });

    // 透镜着色器材质
    this.material = new THREE.ShaderMaterial({
      vertexShader: LENSING_VERT,
      fragmentShader: LENSING_FRAG,
      uniforms: {
        tDiffuse: { value: this.target.texture },
        uResolution: { value: new THREE.Vector2(width, height) },
        uBlackHoleProj: { value: new THREE.Vector2(0.5, 0.5) },
        uEinsteinRadius: { value: PHYSICS.EINSTEIN_R },
        uEventHorizonR: { value: PHYSICS.EVENT_HORIZON_SCREEN },
      },
      depthWrite: false,
    });

    // 全屏 quad
    const geo = new THREE.PlaneGeometry(2, 2);
    this.quad = new THREE.Mesh(geo, this.material);

    // 独立的 scene + camera 用于后处理
    this.scene = new THREE.Scene();
    this.scene.add(this.quad);
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }

  render(mainScene, mainCamera) {
    // Step 1: 渲染主场景到 RenderTarget
    this.renderer.setRenderTarget(this.target);
    this.renderer.render(mainScene, mainCamera);

    // Step 2: 后处理渲染到 canvas
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }

  resize(width, height) {
    this.target.setSize(width, height);
    this.material.uniforms.uResolution.value.set(width, height);
  }

  dispose() {
    this.target.dispose();
    this.material.dispose();
    this.quad.geometry.dispose();
  }
}
