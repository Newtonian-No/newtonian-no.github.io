// ─── BlackHole 入口 ───
// 检测 WebGPU → 路由到对应渲染器
//   WebGPU 可用 → RaymarchSphere (体积光线投射)
//   WebGPU 不可用 → StarRing (土星环风格)

import React, { useState, useEffect } from "react";
import StarRing from "../StarRing";

const RaymarchSphere = React.lazy(() => import("./RaymarchSphere"));

async function checkWebGPU() {
  if (!("gpu" in navigator)) return false;
  try {
    const adapter = await navigator.gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}

export default function BlackHole() {
  const [renderer, setRenderer] = useState(null); // null=loading, 'raymarch' | 'fallback'

  useEffect(() => {
    checkWebGPU().then((ok) => setRenderer(ok ? "raymarch" : "fallback"));
  }, []);

  if (renderer === null) {
    return <div className="fixed inset-0 z-0 bg-transparent" />;
  }

  if (renderer === "raymarch") {
    return (
      <React.Suspense fallback={<div className="fixed inset-0 z-0 bg-transparent" />}>
        <RaymarchSphere />
      </React.Suspense>
    );
  }

  // WebGPU 不可用 → 土星环
  return <StarRing style="saturn" />;
}
