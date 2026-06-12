import React from "react";
import ScrollReveal from "./ScrollReveal";
import projects from "../data/projects.json";

const skills = [
  "Python", "PyTorch", "Mamba", "RAG / LLM",
  "Three.js", "React", "GSAP",
  "YOLO", "Milvus", "Unity",
  "Flask", "C++", "SQL",
];

const info = [
  { label: "GitHub",  value: "Newtonian-No" },
  { label: "邮箱",    value: "kevin_ruan@shu.edu.cn" },
  { label: "手机",    value: "19102125736" },
];

/* 玻璃态卡片底座 */
function Card({ className = "", children, glow = false }) {
  return (
    <div
      className={`relative group bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden
        backdrop-blur-sm transition-all duration-500
        ${glow ? "hover:bg-white/[0.06] hover:border-white/20 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.08)]" : ""}
        ${className}`}
    >
      {children}
    </div>
  );
}

/* Leclerc 风格饰线 */
function Hairline() {
  return <span className="block w-8 h-px bg-white/25 mb-4" />;
}

function TabMe() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* ===== Row 1: Photo + Info + Skills ===== */}
      <ScrollReveal type="fade-up" stagger={0.12} threshold={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

        {/* --- Photo + Name --- */}
        <Card glow className="md:col-span-1 flex flex-col items-center justify-center p-8 text-center min-h-[280px]">
          <div
            className="w-28 h-28 md:w-32 md:h-32 rounded-full mb-6 overflow-hidden
              border-2 border-dashed border-white/20 bg-white/[0.02]
              flex items-center justify-center text-white/20 text-[10px] tracking-widest uppercase"
          >
            {/* 替换 src 放自己照片 */}
            <img
              src={`${import.meta.env.BASE_URL}photo.jpg`}
              alt="阮愔哲"
              className="w-full h-full object-cover"
            />
          </div>
          <h2
            className="text-4xl md:text-5xl font-black tracking-tight text-white"
            style={{ fontFamily: "'Oswald', 'Impact', 'Arial Black', sans-serif" }}
          >
            阮愔哲
          </h2>
        </Card>

        {/* --- 基本信息 --- */}
        <Card className="md:col-span-1 p-6 flex flex-col justify-center">
          <Hairline />
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-6">Info</h3>
          <div className="space-y-4">
            {info.map(({ label, value }) => (
              <div key={label}>
                <p className="text-[11px] text-white/30 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm text-white/80 font-medium">{value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* --- 技能标签 --- */}
        <Card className="md:col-span-1 p-6 flex flex-col justify-center">
          <Hairline />
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-6">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s}
                className="relative px-3 py-1.5 text-[11px] text-white/60 font-medium
                  before:absolute before:inset-0 before:rounded-md before:skew-x-[-8deg]
                  before:border before:border-white/10 before:transition-colors before:duration-300
                  hover:text-white hover:before:border-white/30 transition-all"
              >
                <span className="relative z-10">{s}</span>
              </span>
            ))}
          </div>
        </Card>
      </div>
      </ScrollReveal>

      {/* ===== Row 2: Bio ===== */}
      <ScrollReveal type="fade-up" delay={0.1} threshold={0.15}>
      <Card className="p-8 mb-4">
        <Hairline />
        <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-3xl">
          深度学习与计算机视觉研究者。以「问题驱动的工程师思维」切入医学图像分析、具身智能感知与 LLM Agent 系统，
          在 Mamba 架构、三维重建和大模型应用层面积累项目经验。
        </p>
      </Card>
      </ScrollReveal>

      {/* ===== Row 3: 主推项目 × 2 ===== */}
      <ScrollReveal type="fade-up" stagger={0.15} delay={0.05} threshold={0.1}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {projects.slice(0, 2).map((p) => (
          <ProjectCard key={p.id} p={p} featured />
        ))}
      </div>
      </ScrollReveal>

      {/* ===== Row 4: 其余项目 × 2 ===== */}
      <ScrollReveal type="fade-up" stagger={0.15} delay={0.1} threshold={0.1}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {projects.slice(2, 4).map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>
      </ScrollReveal>

      {/* ===== Row 5: 更多项目 ===== */}
      {projects.length > 4 && (
        <ScrollReveal type="fade-up" stagger={0.15} delay={0.15} threshold={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {projects.slice(4).map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
        </div>
        </ScrollReveal>
      )}

      {/* ===== Footer ===== */}
      <footer className="text-center text-gray-600 text-sm py-12">
        <a href="https://github.com/Newtonian-No" target="_blank" rel="noopener" className="hover:text-white transition-colors">
          github.com/Newtonian-No
        </a>
      </footer>
    </div>
  );
}

/* 项目卡片 */
function ProjectCard({ p, featured = false }) {
  const hasRepo = !!p.links.github;
  const hoverColor = hasRepo
    ? "hover:border-emerald-400/40 hover:bg-emerald-400/[0.04] hover:shadow-[0_0_40px_-10px_rgba(52,211,153,0.12)]"
    : "hover:border-amber-400/30 hover:bg-amber-400/[0.04] hover:shadow-[0_0_40px_-10px_rgba(251,191,36,0.10)]";

  const hairlineHover = hasRepo
    ? "group-hover:bg-emerald-400/60"
    : "group-hover:bg-amber-400/50";
  const tagHover = hasRepo
    ? "group-hover:text-emerald-300 group-hover:before:bg-emerald-400/15"
    : "group-hover:text-amber-300 group-hover:before:bg-amber-400/12";
  const descHover = hasRepo
    ? "group-hover:text-emerald-100/80"
    : "group-hover:text-amber-100/80";
  const techHover = hasRepo
    ? "group-hover:text-emerald-300/70 group-hover:bg-emerald-400/[0.08]"
    : "group-hover:text-amber-300/60 group-hover:bg-amber-400/[0.06]";
  const arrowHover = hasRepo
    ? "group-hover:text-emerald-400/50"
    : "group-hover:text-amber-400/40";

  const cardClass = `group block relative bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden
    backdrop-blur-sm transition-all duration-500
    hover:-translate-y-0.5
    ${hoverColor}
    ${featured ? "p-8" : "p-6"}`;

  const inner = (
    <>
      {/* 左上角饰线 */}
      <span className={`block w-8 h-px bg-white/25 mb-5 transition-all duration-500 group-hover:w-12 ${hairlineHover}`} />

      {/* 标题 + tag */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3
          className={`font-black tracking-tight text-white group-hover:text-white/90 transition-colors
            ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}
          style={{ fontFamily: "'Oswald', 'Impact', 'Arial Black', sans-serif" }}
        >
          {p.title}
        </h3>
        <span className={`relative shrink-0 text-[10px] font-bold uppercase px-2.5 py-1 text-white/70 transition-colors duration-300
          before:absolute before:inset-0 before:rounded before:skew-x-[-8deg] before:bg-white/10 before:transition-colors
          ${tagHover}`}>
          <span className="relative z-10">{p.tag}</span>
        </span>
      </div>

      {/* 描述 */}
      <p className={`text-gray-400 leading-relaxed mb-5 transition-colors ${descHover} ${featured ? "text-sm" : "text-xs"}`}>
        {p.description}
      </p>

      {/* 技术标签 */}
      <div className="flex flex-wrap gap-1.5">
        {p.tech.map((t) => (
          <span key={t} className={`text-[10px] px-2 py-1 rounded bg-white/[0.04] text-white/40 transition-all ${techHover}`}>
            {t}
          </span>
        ))}
      </div>

      {/* 悬停指示 */}
      {hasRepo ? (
        <span className={`absolute bottom-4 right-4 text-white/0 transition-all duration-500 translate-x-2 group-hover:translate-x-0 text-lg font-light ${arrowHover}`}>
          ↗
        </span>
      ) : (
        <span className={`absolute bottom-4 right-4 text-white/0 transition-all duration-500 translate-x-2 group-hover:translate-x-0 text-[10px] uppercase tracking-wider font-bold ${arrowHover}`}>
          详情 →
        </span>
      )}
    </>
  );

  if (hasRepo) {
    return (
      <a href={p.links.github} target="_blank" rel="noopener noreferrer" className={cardClass}>
        {inner}
      </a>
    );
  }

  return <div className={cardClass}>{inner}</div>;
}

export default TabMe;
