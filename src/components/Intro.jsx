import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const COLS = 14;
const ROWS = 10;

function Intro({ onComplete }) {
  const containerRef = useRef(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // 生成棋盘格方块 — F1方格旗
    const rowData = [];
    for (let r = 0; r < ROWS; r++) {
      const cells = [];
      for (let c = 0; c < COLS; c++) {
        const isWhite = (r + c) % 2 === 0;
        cells.push({ r, c, isWhite });
      }
      rowData.push(cells);
    }
    setRows(rowData);

    // 等 DOM 渲染完再启动动画
    requestAnimationFrame(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // 动画结束后移除整个容器
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
      // 阶段二：icon分裂消散
      .to(".intro-icon-left", {
        x: -90, y: -40, opacity: 0, scale: 0.2, duration: 0.4,
      }, "-=0.15")
      .to(".intro-icon-right", {
        x: 90, y: 40, opacity: 0, scale: 0.2, duration: 0.4,
      }, "<")
      // 阶段三：方格旗丝绸滑落 — 逐列从上往下滑出屏幕
      .to(".checker-col", {
        y: "105vh",
        duration: 1.0,
        stagger: {
          each: 0.06,
          from: "center",     // 从中间列开始向两侧扩展
          grid: "auto",
        },
        ease: "power3.in",    // 加速滑出，模拟重力+丝绸
      }, "-=0.1");
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] overflow-hidden"
    >
      {/* Icon: 两根竖线（占位符） */}
      <div className="intro-icon-group absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <svg width="80" height="100" viewBox="0 0 80 100">
          <rect className="intro-icon-left" x="10" y="10" width="16" height="80" rx="4" fill="white" />
          <rect className="intro-icon-right" x="54" y="10" width="16" height="80" rx="4" fill="white" />
        </svg>
      </div>

      {/* 方格旗网格 — 逐列滑落 */}
      <div className="absolute inset-0 z-10 flex">
        {rows.length > 0 &&
          Array.from({ length: COLS }).map((_, c) => (
            <div
              key={c}
              className="checker-col flex-1 flex flex-col"
            >
              {Array.from({ length: ROWS }).map((_, r) => {
                const isWhite = (r + c) % 2 === 0;
                return (
                  <div
                    key={r}
                    className="flex-1"
                    style={{
                      backgroundColor: isWhite ? "#f0f0f0" : "#0a0a0a",
                    }}
                  />
                );
              })}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Intro;
