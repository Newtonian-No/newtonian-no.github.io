import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import milestones from "../data/ai-milestones.json";

gsap.registerPlugin(ScrollTrigger);

function TimeTree() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = sectionRef.current.querySelectorAll(".timeline-card");
    const dots = sectionRef.current.querySelectorAll(".timeline-dot");

    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.6,
          delay: i * 0.08,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          ease: "power3.out",
        }
      );
    });

    dots.forEach((dot, i) => {
      gsap.fromTo(
        dot,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.4,
          scrollTrigger: {
            trigger: dot,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          ease: "back.out(2)",
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div ref={sectionRef} className="relative max-w-4xl mx-auto py-8">
      {/* 中央线 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-500/50 to-transparent" />

      {milestones.map((item, i) => {
        const isLeft = i % 2 === 0;
        return (
          <div
            key={i}
            className={`timeline-card relative flex items-center mb-14 w-full ${
              isLeft ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* 空占位（移动端隐藏） */}
            <div className="hidden md:block w-[45%]" />

            {/* 圆点 */}
            <div className="timeline-dot absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-400 border-4 border-[#02020e] z-10 shadow-[0_0_12px_rgba(52,211,153,0.4)]" />

            {/* 卡片 */}
            <div
              className={`w-full md:w-[45%] p-5 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-emerald-500/40 transition-all duration-300 ${
                isLeft ? "md:text-right" : ""
              }`}
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
