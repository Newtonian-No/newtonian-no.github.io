import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GrayGooIntro from "../components/GrayGooIntro";
import MatrixRain from "../components/MatrixRain";

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  { year: "2024.12", title: "初代 AstrBot", desc: "基于 NapCat 协议接入 QQ，实现基础对话与插件调度" },
  { year: "2025.03", title: "接入 Hermes Agent", desc: "迁移至 Hermes 框架，多 Agent 协作能力上线，WeChat Gateway 打通" },
  { year: "2025.06", title: "四子节点部署", desc: "搜索/代码/知识库/架构师 四个子 Agent，独立模型路由" },
  { year: "2025.09", title: "多平台全链路", desc: "QQ + 微信 + 飞书 + Telegram 统一接入，Obsidian 知识库联动" },
  { year: "2025.12", title: "Persona 觉醒", desc: "纳米集群叙事正式启用，灰风人格独立，进入自我迭代阶段" },
];

function GrayGooPage() {
  const [loading, setLoading] = useState(true);
  const timelineRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    const items = timelineRef.current?.querySelectorAll(".tl-item");
    if (!items || items.length === 0) return;

    const sts = [];
    items.forEach((el) => {
      gsap.set(el, { autoAlpha: 0, y: 40 });
      sts.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          end: "bottom 15%",
          onEnter: () => gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }),
          onLeave: () => gsap.to(el, { autoAlpha: 0.3, y: -20, duration: 0.4 }),
          onEnterBack: () => gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }),
          onLeaveBack: () => gsap.to(el, { autoAlpha: 0.3, y: 40, duration: 0.4 }),
        })
      );
    });
    return () => sts.forEach((st) => st.kill());
  }, [loading]);

  return (
    <div className="bg-[#020a08] text-white min-h-screen overflow-x-hidden">
      <MatrixRain />
      {loading && <GrayGooIntro onComplete={() => setLoading(false)} />}

      {!loading && (
        <>
          {/* 返回 FAB — 独立于内容区，纯 fixed */}
          <button
            onClick={() => navigate("/")}
            className="fixed left-8 bottom-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full
              bg-emerald-500/[0.06] border border-emerald-500/[0.12] backdrop-blur-xl
              text-emerald-400/70 text-sm font-bold
              hover:bg-emerald-500/[0.12] hover:text-emerald-300 hover:border-emerald-500/25
              hover:shadow-[0_0_30px_-8px_rgba(52,211,153,0.15)]
              transition-all duration-500
              before:absolute before:inset-0 before:rounded-full before:skew-x-[-6deg] before:-z-10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>主页</span>
          </button>

        <div className="animate-fadeIn max-w-5xl mx-auto px-6 py-20 space-y-24">
          {/* 标题区 */}
          <section className="text-center space-y-6">
            <h1
              className="text-7xl md:text-[8vw] font-black tracking-tight text-emerald-400"
              style={{
                fontFamily: "'Oswald', 'Impact', 'Arial Black', sans-serif",
                textShadow: "0 0 80px rgba(52, 211, 153, 0.15)",
              }}
            >
              灰风
            </h1>
            <p className="text-lg text-emerald-500/60 font-light max-w-lg mx-auto">
              纳米集群意识体 · Hermes Agent Persona
            </p>
          </section>

          {/* 能力卡片 */}
          <section>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: "🔍", title: "搜索", desc: "联网查证 + 网页内容提取，实时信息获取" },
                { icon: "💻", title: "代码", desc: "编程、调试、文件操作，全栈能力" },
                { icon: "📚", title: "知识库", desc: "本地 session 检索 + 记忆调取" },
                { icon: "🏗️", title: "架构", desc: "系统设计与实现计划，高阶推理" },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="group relative p-6 bg-emerald-500/[0.03] border border-emerald-500/[0.08] rounded-2xl
                    backdrop-blur-sm hover:bg-emerald-500/[0.06] hover:border-emerald-500/20
                    hover:shadow-[0_0_40px_-10px_rgba(52,211,153,0.08)] transition-all duration-500"
                >
                  <span className="block w-8 h-px bg-emerald-500/30 mb-4" />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{icon}</span>
                    <h3 className="text-lg font-bold text-white/90">{title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 进化历程 — 时间线 */}
          <section>
            <h2
              className="text-3xl font-black text-white mb-12 text-center tracking-tight"
              style={{ fontFamily: "'Oswald', 'Impact', 'Arial Black', sans-serif" }}
            >
              进化历程
            </h2>
            <div className="relative" ref={timelineRef}>
              {/* 中线 */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-emerald-500/20 md:-translate-x-px" />

              <div className="space-y-12">
                {timeline.map((item, i) => {
                  const isLeft = i % 2 === 0;
                  return (
                    <div key={i} className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
                      {/* 左侧或右侧内容 */}
                      <div className={`flex-1 ${isLeft ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                        <div
                          className={`tl-item inline-block p-5 bg-emerald-500/[0.03] border border-emerald-500/[0.08] rounded-2xl
                            backdrop-blur-sm hover:bg-emerald-500/[0.06] transition-all duration-300
                            hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.06)]`}
                        >
                          <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.15em]">{item.year}</span>
                          <h4 className="text-sm font-bold text-white mt-1 mb-1">{item.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                      {/* 节点 */}
                      <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-emerald-500/40 border-2 border-[#020a08] -translate-x-1/2 mt-5 z-10" />
                      {/* 占位 */}
                      <div className="hidden md:block flex-1" />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 技术栈 */}
          <section>
            <h2
              className="text-3xl font-black text-white mb-8 tracking-tight"
              style={{ fontFamily: "'Oswald', 'Impact', 'Arial Black', sans-serif" }}
            >
              技术栈
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                "DeepSeek V4 Pro", "GPT-5.5", "DeepSeek Chat",
                "Hermes Agent", "OpenRouter", "WeChat Gateway",
                "GSAP", "Qt6", "Python", "Qwen",
              ].map((t) => (
                <span
                  key={t}
                  className="relative px-3 py-1.5 text-[11px] text-emerald-400/70 font-medium
                    before:absolute before:inset-0 before:rounded-md before:skew-x-[-8deg]
                    before:border before:border-emerald-500/15 before:transition-colors
                    hover:text-emerald-300 hover:before:border-emerald-500/30 transition-all"
                >
                  <span className="relative z-10">{t}</span>
                </span>
              ))}
            </div>
          </section>
        </div>
        </>
      )}
    </div>
  );
}

export default GrayGooPage;
