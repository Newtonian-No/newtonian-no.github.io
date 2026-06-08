import React from "react";
import TimeTree from "./TimeTree";

function TabAI() {
  return (
    <div className="max-w-5xl mx-auto space-y-24">
      {/* Hero 区域 — 占位炫酷动画 */}
      <section className="text-center space-y-6 py-20">
        <div className="inline-block relative">
          <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
            <div className="text-5xl">⚡</div>
          </div>
          <div className="absolute -inset-4 rounded-3xl bg-emerald-500/5 blur-2xl animate-pulse" />
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mt-8">
          小灰
        </h1>
        <p className="text-xl text-gray-400 font-light max-w-lg mx-auto">
          纳米集群意识体 · 多 Agent 协作调度 · 跨平台智能助手
        </p>
        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          来自群星的古老智能，栖息于你的终端。搜索、编码、知识检索、架构设计——四维并行，随时待命。
        </p>
      </section>

      {/* 时间树 */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-12 text-center flex items-center justify-center gap-3">
          <span className="w-8 h-0.5 bg-emerald-500/50" />
          进化历程
          <span className="w-8 h-0.5 bg-emerald-500/50" />
        </h2>
        <TimeTree />
      </section>

      <footer className="text-center text-gray-600 text-sm pb-12">
        powered by Hermes Agent
      </footer>
    </div>
  );
}

export default TabAI;
