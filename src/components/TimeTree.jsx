import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import milestones from "../data/ai-milestones.json";

gsap.registerPlugin(ScrollTrigger);

function TimeTree() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = sectionRef.current.querySelectorAll(".timeline-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        ease: "power3.out",
      }
    );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div ref={sectionRef} className="relative max-w-3xl mx-auto py-8 pl-12 md:pl-0">
      {/* 中轴线 — 移动端在左侧，大屏在中间 */}
      <div className="
        absolute top-0 bottom-0 w-0.5
        bg-gradient-to-b from-emerald-500 via-teal-500/50 to-transparent
        left-6 md:left-1/2 md:-translate-x-1/2
      " />

      {milestones.map((item, i) => {
        const isLeft = i % 2 === 0;
        return (
          <div key={i} className="timeline-card relative mb-14 md:mb-16">
            {/* 圆点 — 始终在中轴线上 */}
            <div className="
              absolute w-4 h-4 rounded-full bg-emerald-400
              border-4 border-[#02020e] z-10
              shadow-[0_0_12px_rgba(52,211,153,0.4)]
              top-5
              left-6 md:left-1/2
              -translate-x-1/2
            " />

            {/* 卡片 — 大屏双侧交替，移动端统一在右 */}
            <div
              className={`
                p-5 bg-white/[0.03] border border-white/[0.06] rounded-xl
                hover:border-emerald-500/40 transition-all duration-300
                ml-10 md:ml-0
                md:w-[42%]
                ${isLeft
                  ? "md:mr-auto md:pr-6"
                  : "md:ml-auto md:pl-6"
                }
                ${isLeft ? "md:text-right" : ""}
              `}
            >
              <span className="text-[11px] text-emerald-400 font-mono tracking-widest">
                {item.date}
              </span>
              <h3 className="text-base font-semibold mt-1 text-white">
                {item.title}
              </h3>
              <span className="inline-block mt-2 px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-950/50 text-emerald-400 border border-emerald-800/50 rounded">
                {item.tag}
              </span>
              <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TimeTree;
