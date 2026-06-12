import React from "react";
import projects from "../data/projects.json";

const skills = [
  "PyTorch", "YOLO", "Mamba", "Unity", "Three.js",
  "Python", "C++", "SQL", "Milvus", "GSAP",
  "React", "Flask", "Streamlit", "LLM", "RAG",
];

const info = [
  { label: "学校", value: "上海大学" },
  { label: "专业", value: "人工智能 · 2023级" },
  { label: "GPA", value: "3.48 / 4.00" },
  { label: "CET-4", value: "678" },
  { label: "CET-6", value: "557" },
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
            className="text-4xl md:text-5xl font-black tracking-tight text-white mb-1"
            style={{ fontFamily: "'Oswald', 'Impact', 'Arial Black', sans-serif" }}
          >
            阮愔哲
          </h2>
          <p className="text-xs text-white/30 tracking-[0.2em] uppercase">Shanghai University</p>
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

      {/* ===== Row 2: Bio ===== */}
      <Card className="p-8 mb-4">
        <Hairline />
        <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-3xl">
          深度学习与计算机视觉研究者，专注于医学图像分析、具身智能感知与 LLM Agent 系统。
          以「问题驱动的工程师思维」为底色，在 Mamba 架构、三维重建和大模型应用层面积累项目经验。
          正在寻找具身智能感知方向的保研机会。
        </p>
      </Card>

      {/* ===== Row 3: 主推项目 × 2 ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {projects.slice(0, 2).map((p) => (
          <ProjectCard key={p.id} p={p} featured />
        ))}
      </div>

      {/* ===== Row 4: 其余项目 × 2 ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {projects.slice(2).map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>

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
  return (
    <a
      href={p.links.github || "#"}
      target={p.links.github ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={`group block relative bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden
        backdrop-blur-sm transition-all duration-500
        hover:bg-white/[0.06] hover:border-white/20
        hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.08)]
        ${featured ? "p-8" : "p-6"}`}
    >
      {/* 左上角饰线 */}
      <span className="block w-8 h-px bg-white/25 mb-5" />

      {/* 标题 + tag */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3
          className={`font-black tracking-tight text-white group-hover:text-white/90 transition-colors
            ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}
          style={{ fontFamily: "'Oswald', 'Impact', 'Arial Black', sans-serif" }}
        >
          {p.title}
        </h3>
        <span className="relative shrink-0 text-[10px] font-bold uppercase px-2.5 py-1 text-white/70
          before:absolute before:inset-0 before:rounded before:skew-x-[-8deg] before:bg-white/10">
          <span className="relative z-10">{p.tag}</span>
        </span>
      </div>

      {/* 描述 */}
      <p className={`text-gray-400 leading-relaxed mb-5 ${featured ? "text-sm" : "text-xs"}`}>
        {p.description}
      </p>

      {/* 技术标签 */}
      <div className="flex flex-wrap gap-1.5">
        {p.tech.map((t) => (
          <span key={t} className="text-[10px] px-2 py-1 rounded bg-white/[0.04] text-white/40">
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}

export default TabMe;
