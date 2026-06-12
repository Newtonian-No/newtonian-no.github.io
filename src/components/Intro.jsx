import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const COLS = 8;
const ROWS = 6;
const TOTAL = COLS * ROWS;

/** 在 canvas 上画一条圆角线 */
function drawLine(canvas, x1, y1, x2, y2, color1, color2, width = 10) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);

  ctx.strokeStyle = grad;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

/* ====== 五根线条的 Canvas 绘制（yzRight 合并了 Y右臂 + Z对角线） ====== */
function useLines(refs) {
  useEffect(() => {
    const colors = {
      yLeft:   ["#ff4444", "#ff4444"],
      yzRight: ["#dd44ff", "#dd44ff"], // 紫 — 既是Y右臂也是Z对角线
      yStem:   ["#44dd44", "#44dd44"],
      zTop:    ["#ffdd44", "#ffdd44"],
      zBottom: ["#ff8844", "#ff8844"],
    };

    if (refs.yLeft.current)   drawLine(refs.yLeft.current,   26, 12, 98, 98,  ...colors.yLeft);
    if (refs.yzRight.current) drawLine(refs.yzRight.current, 98, 22, 18, 98,  ...colors.yzRight);
    if (refs.yStem.current)   drawLine(refs.yStem.current,   60, 98, 60, 190, ...colors.yStem);
    if (refs.zTop.current)    drawLine(refs.zTop.current,    18, 22, 98, 22,  ...colors.zTop);
    if (refs.zBottom.current) drawLine(refs.zBottom.current, 18, 98, 98, 98,  ...colors.zBottom);
  }, []);
}

/* ====== YZ Logo 组件 ====== */
const CANVAS_SIZE = 200;
function YZLogo() {
  const yLeft   = useRef(null);
  const yzRight = useRef(null);
  const yStem   = useRef(null);
  const zTop    = useRef(null);
  const zBottom = useRef(null);

  useLines({ yLeft, yzRight, yStem, zTop, zBottom });

  const canvases = [
    { ref: yLeft,   cls: "yz-left",   style: { position: "absolute", top: 0, left: 0 } },
    { ref: yzRight, cls: "yz-merged", style: { position: "absolute", top: 0, left: 80 } },
    { ref: yStem,   cls: "yz-stem",   style: { position: "absolute", top: 0, left: 38 } },
    { ref: zTop,    cls: "yz-ztop",   style: { position: "absolute", top: 0, left: 80 } },
    { ref: zBottom, cls: "yz-zbot",   style: { position: "absolute", top: 0, left: 80 } },
  ];

  return (
    <div className="yz-logo relative" style={{ width: 280, height: 200 }}>
      {canvases.map(({ ref, cls, style }) => (
        <canvas
          key={cls}
          ref={ref}
          className={`yz-line ${cls}`}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={style}
        />
      ))}
    </div>
  );
}

/* ====== Intro 主组件 ====== */
function Intro({ onComplete }) {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const blocks = containerRef.current.querySelectorAll(".mask-block");

      const tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }
          onComplete();
        },
      });

      // 阶段一：五条线各自飞入
      tl.fromTo(".yz-left",   { x: -60, y: -40, rotation: 60,  autoAlpha: 0 }, { x: 0, y: 0, rotation: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" })
        .fromTo(".yz-merged", { x: 60,  y: -40, rotation: -60, autoAlpha: 0 }, { x: 0, y: 0, rotation: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, "<")
        .fromTo(".yz-stem",   { y: -60, scaleY: 0, autoAlpha: 0 },              { y: 0, scaleY: 1, autoAlpha: 1, duration: 0.45, ease: "power3.out" }, "-=0.3")
        .fromTo(".yz-ztop",   { x: 80, scaleX: 0, autoAlpha: 0 },               { x: 0, scaleX: 1, autoAlpha: 1, duration: 0.45, ease: "power3.out" }, "-=0.35")
        .fromTo(".yz-zbot",   { x: 80, scaleX: 0, autoAlpha: 0 },               { x: 0, scaleX: 1, autoAlpha: 1, duration: 0.45, ease: "power3.out" }, "-=0.35")
        // 阶段二：脉冲
        .to(".yz-line", { scale: 1.15, duration: 0.3, ease: "power2.out" })
        .to(".yz-line", { scale: 1,    duration: 0.5, ease: "power2.inOut" })
        // 阶段三：YZ 消散（五条线全部有消失动画）
        .to(".yz-left",   { x: -80, y: -60, rotation: 80,  autoAlpha: 0, duration: 0.35 }, "+=0.1")
        .to(".yz-merged", { x: 80,  y: -60, rotation: -80, autoAlpha: 0, duration: 0.35 }, "<")
        .to(".yz-stem",   { y: -80, autoAlpha: 0, duration: 0.3 }, "<")
        .to(".yz-ztop",   { x: 100, autoAlpha: 0, duration: 0.3 }, "<")
        .to(".yz-zbot",   { x: 100, autoAlpha: 0, duration: 0.3 }, "<")
        // 阶段四：方块扩散剥落
        .to(blocks, {
          scaleY: 0,
          y: () => gsap.utils.random(-80, 80),
          duration: 0.7,
          ease: "power3.in",
          stagger: { amount: 0.9, from: "center", grid: [ROWS, COLS] },
        }, "-=0.1");
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <YZLogo />
      </div>

      <div style={{
        position: "absolute", top: "-5vh", left: "-12.5%", width: "125%", height: "110vh", zIndex: 10,
        display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        gap: "0px", transform: "skewX(-12deg)",
      }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div key={i} className="mask-block" style={{ backgroundColor: "#0a0a1e", transformOrigin: "center top" }} />
        ))}
      </div>
    </div>
  );
}

export default Intro;
