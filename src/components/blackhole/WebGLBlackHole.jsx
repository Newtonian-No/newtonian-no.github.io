// ─── WebGLBlackHole — WebGL 粒子黑洞包装组件 ───
// 绑定 useBlackHole hook，驱动引力透镜 + 吸积盘 + 光子环 + 星场

import React, { useRef } from "react";
import { useBlackHole } from "./useBlackHole";

export default function WebGLBlackHole() {
  const containerRef = useRef(null);

  useBlackHole(containerRef);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0"
      style={{ pointerEvents: "none" }}
    />
  );
}
