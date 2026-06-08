import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const COLS = 10;
const ROWS = 8;
const TOTAL = COLS * ROWS;

function Intro({ onComplete }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // 等 React 把 DOM 写入后再抓元素
    const schedule = requestAnimationFrame(() => {
      const blocks = containerRef.current.querySelectorAll(".mask-block");
      if (blocks.length === 0) return;

      const tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }
          onComplete();
        },
      });

      // 阶段一：icon 旋转
      tl.to(".intro-icon-group", {
        rotation: 360,
        duration: 0.9,
        ease: "power2.inOut",
      })
      // 阶段二：icon 分裂消散
      .to(".intro-icon-left", {
        x: -90, y: -40, opacity: 0, scale: 0.2, duration: 0.4,
      }, "-=0.15")
      .to(".intro-icon-right", {
        x: 90, y: 40, opacity: 0, scale: 0.2, duration: 0.4,
      }, "<")
      // 阶段三：斜切网格遮罩 — 方块随机缩小消失
      .to(blocks, {
        scale: 0,
        duration: 1.0,
        ease: "power2.inOut",
        stagger: {
          amount: 0.7,
          from: "random",
        },
      }, "-=0.1");
    });

    return () => cancelAnimationFrame(schedule);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] overflow-hidden bg-[#02020e]"
    >
      {/* Icon: 两根竖线（占位符） */}
      <div className="intro-icon-group absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <svg width="80" height="100" viewBox="0 0 80 100">
          <rect className="intro-icon-left" x="10" y="10" width="16" height="80" rx="4" fill="white" />
          <rect className="intro-icon-right" x="54" y="10" width="16" height="80" rx="4" fill="white" />
        </svg>
      </div>

      {/* 斜切网格遮罩 — 平行四边形方块 */}
      <div
        className="skew-grid-mask"
        style={{
          position: "absolute",
          top: "-10vh",
          left: "-10vw",
          width: "120vw",
          height: "120vh",
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          gap: "2px",
          transform: "skewX(-15deg)",
        }}
      >
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div
            key={i}
            className="mask-block"
            style={{
              backgroundColor: "#02020e",
              transformOrigin: "center center",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Intro;
