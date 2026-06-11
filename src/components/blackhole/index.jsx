// ─── BlackHole 入口 ───
// 检测 WebGPU → 路由到对应渲染器

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

  // Fallback: 土星环（StarRing 配置 STYLE='saturn'）
  return <StarRing style="saturn" />;
}
