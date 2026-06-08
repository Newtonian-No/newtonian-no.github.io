import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const COLS = 12;
const ROWS = 8;

function Intro({ onComplete }) {
  const containerRef = useRef(null);
  const iconLeftRef = useRef(null);
  const iconRightRef = useRef(null);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const items = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const distFromCenter = Math.sqrt(
          Math.pow((c - COLS / 2 + 0.5) / (COLS / 2), 2) +
          Math.pow((r - ROWS / 2 + 0.5) / (ROWS / 2), 2)
        );
        items.push({ r, c, dist: distFromCenter });
      }
    }
    items.sort((a, b) => a.dist - b.dist);
    setBlocks(items);

    const tl = gsap.timeline({ onComplete });

    // 阶段一：icon 旋转
    tl.to(".intro-icon-group", {
      rotation: 360,
      duration: 1,
      ease: "power2.inOut",
    })
    // 阶段二：icon 分裂消散
    .to(iconLeftRef.current, {
      x: -80, y: -30, opacity: 0, scale: 0.3, duration: 0.5,
    }, "-=0.2")
    .to(iconRightRef.current, {
      x: 80, y: 30, opacity: 0, scale: 0.3, duration: 0.5,
    }, "<")
    // 阶段三：方块从中心向外扩散消失（带闪烁）
    .add(() => {
      const allBlocks = document.querySelectorAll(".mask-block");
      // 先集体闪白
      gsap.to(allBlocks, {
        backgroundColor: "rgba(255,255,255,0.08)",
        duration: 0.15,
        ease: "power1.out",
        onComplete: () => {
          // 然后从中心向外缩小消失
          gsap.to(allBlocks, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: {
              each: 0.006,
              from: "center",
              grid: [ROWS, COLS],
            },
            ease: "power2.in",
          });
        },
      });
    }, "-=0.2");

    return () => tl.kill();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#02020e] flex items-center justify-center overflow-hidden"
    >
      {/* Icon: 两根竖线（占位符） */}
      <div className="intro-icon-group absolute z-20">
        <svg width="80" height="100" viewBox="0 0 80 100">
          <rect ref={iconLeftRef} x="10" y="10" width="16" height="80" rx="4" fill="white" />
          <rect ref={iconRightRef} x="54" y="10" width="16" height="80" rx="4" fill="white" />
        </svg>
      </div>

      {/* 方块遮罩网格 — 比背景稍亮 + 微弱边框，让消散可见 */}
      <div
        className="absolute inset-0 z-10"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {blocks.map((b, i) => (
          <div
            key={i}
            className="mask-block"
            style={{
              gridRow: b.r + 1,
              gridColumn: b.c + 1,
              backgroundColor: "#0a0a1e",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Intro;
