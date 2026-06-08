import React from "react";
import projects from "../data/projects.json";

const skills = [
  "PyTorch", "YOLO", "Mamba", "Unity", "Three.js",
  "Python", "C++", "SQL", "Milvus", "GSAP",
  "React", "Flask", "Streamlit", "LLM", "RAG",
];

function TabMe() {
  return (
    <div className="max-w-5xl mx-auto space-y-24">
      {/* 个人卡片 */}
      <section className="text-center space-y-4">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">
          阮愔哲
        </h1>
        <p className="text-xl text-gray-400 font-light">
          上海大学 · 人工智能 · 2023级
        </p>
        <p className="max-w-xl mx-auto text-gray-500 leading-relaxed">
          GPA 3.48/4.00 · CET-4 678 · CET-6 557
          <br />
          深度学习 · 计算机视觉 · 医学图像分析 · LLM Agent
        </p>
      </section>

      {/* 项目网格 */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-8 h-0.5 bg-white/30" />
          Projects
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <a
              key={p.id}
              href={p.links.github || "#"}
              target={p.links.github ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group block p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {p.title}
                </h3>
                <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-white/10 text-white/60">
                  {p.tag}
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-gray-500">
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 技能栈 */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-8 h-0.5 bg-white/30" />
          Skills
        </h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((s) => (
            <span
              key={s}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all cursor-default"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* 页脚 */}
      <footer className="text-center text-gray-600 text-sm pb-12">
        <a href="https://github.com/Newtonian-No" target="_blank" rel="noopener" className="hover:text-white transition-colors">
          github.com/Newtonian-No
        </a>
      </footer>
    </div>
  );
}

export default TabMe;
