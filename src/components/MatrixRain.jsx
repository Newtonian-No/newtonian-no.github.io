import React, { useRef, useEffect } from "react";

const CHARS = "01ABCDEF0123456789abcdef<>/{}[]()=+-_*&^%$#@!;:?|\\";
const FONT_SIZE = 14;
const SPEED = 1.2;

export default function MatrixRain() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const canvases = [leftRef.current, rightRef.current];
    const drops = [];
    let raf;

    function init(canvas) {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const cols = Math.floor(canvas.width / FONT_SIZE);
      const d = [];
      for (let i = 0; i < cols; i++) {
        d[i] = Math.random() * -canvas.height;
      }
      drops.push({ canvas, ctx, cols, d });
    }

    function resize() {
      canvases.forEach((c, i) => {
        if (!c) return;
        c.width = Math.min(window.innerWidth * 0.24, 360);
        c.height = window.innerHeight;
        if (drops[i]) {
          const cols = Math.floor(c.width / FONT_SIZE);
          drops[i].cols = cols;
          drops[i].d = Array.from({ length: cols }, () => Math.random() * -c.height);
        }
      });
    }

    init(leftRef.current);
    init(rightRef.current);
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      drops.forEach(({ canvas, ctx, cols, d }) => {
        if (!ctx) return;
        ctx.fillStyle = "rgba(2, 10, 8, 0.08)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${FONT_SIZE}px "Courier New", monospace`;

        for (let i = 0; i < cols; i++) {
          const char = CHARS[Math.floor(Math.random() * CHARS.length)];
          const x = i * FONT_SIZE;
          const y = d[i] * FONT_SIZE;

          ctx.fillStyle = "rgba(180, 255, 200, 0.9)";
          ctx.fillText(char, x, y);

          ctx.fillStyle = "rgba(52, 211, 153, 0.3)";
          ctx.fillText(char, x, y - FONT_SIZE);

          if (y > canvas.height && Math.random() > 0.975) {
            d[i] = 0;
          }
          d[i] += SPEED;
        }
      });
      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={leftRef}
        className="fixed left-0 top-0 z-0 pointer-events-none opacity-60"
        style={{ width: "min(24vw, 360px)", height: "100vh" }}
      />
      <canvas
        ref={rightRef}
        className="fixed right-0 top-0 z-0 pointer-events-none opacity-60"
        style={{ width: "min(24vw, 360px)", height: "100vh" }}
      />
    </>
  );
}
