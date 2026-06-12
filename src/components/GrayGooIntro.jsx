import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const GRID = 8;
const TOTAL = GRID * GRID;

function GrayGooIntro({ onComplete }) {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const dots = containerRef.current.querySelectorAll(".gg-dot");
      const title = containerRef.current.querySelector(".gg-title");

      const tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }
          onComplete();
        },
      });

      // 阶段一：绿色光点随机出现（纳米集群苏醒）
      tl.fromTo(
        dots,
        { scale: 0, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.3,
          ease: "back.out(2)",
          stagger: {
            amount: 1.2,
            from: "random",
            grid: [GRID, GRID],
          },
        }
      )
        // 阶段二：光点脉冲呼吸
        .to(dots, {
          scale: 0.6,
          autoAlpha: 0.4,
          duration: 0.4,
          ease: "power2.inOut",
          stagger: { amount: 0.3, from: "random", grid: [GRID, GRID] },
        }, "+=0.1")
        .to(dots, {
          scale: 1,
          autoAlpha: 1,
          duration: 0.4,
          ease: "power2.inOut",
          stagger: { amount: 0.3, from: "random", grid: [GRID, GRID] },
        }, "-=0.2")
        // 阶段三：光点汇聚成文字
        .to(dots, {
          scale: 0,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power3.in",
          stagger: { amount: 0.6, from: "edges", grid: [GRID, GRID] },
        }, "+=0.2")
        // 阶段四：标题浮现
        .fromTo(
          title,
          { y: 40, autoAlpha: 0, filter: "blur(8px)" },
          { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1, ease: "power3.out" },
          "-=0.3"
        )
        // 阶段五：标题脉冲 + 消散
        .to(title, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out",
        })
        .to(title, {
          scale: 1,
          duration: 0.6,
          ease: "power2.inOut",
        }, "+=0.8")
        .to(title, {
          autoAlpha: 0,
          filter: "blur(4px)",
          duration: 0.5,
          ease: "power3.in",
        });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020a08] overflow-hidden"
    >
      {/* 光点矩阵 */}
      <div
        className="absolute"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID}, 1fr)`,
          gridTemplateRows: `repeat(${GRID}, 1fr)`,
          gap: "2rem",
          width: "min(60vw, 400px)",
          height: "min(60vw, 400px)",
        }}
      >
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div
            key={i}
            className="gg-dot rounded-full"
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: `hsl(${160 + Math.random() * 20}, 70%, ${50 + Math.random() * 30}%)`,
              boxShadow: `0 0 12px hsla(${160 + Math.random() * 20}, 70%, 50%, 0.5)`,
            }}
          />
        ))}
      </div>

      {/* 标题 */}
      <h1
        className="gg-title text-7xl md:text-9xl font-black tracking-tight text-emerald-400 z-10"
        style={{
          fontFamily: "'Oswald', 'Impact', 'Arial Black', sans-serif",
          textShadow: "0 0 60px rgba(52, 211, 153, 0.3)",
        }}
      >
        小灰
      </h1>
    </div>
  );
}

export default GrayGooIntro;
