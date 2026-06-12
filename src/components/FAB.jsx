import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function FAB({ visible }) {
  const [introDone, setIntroDone] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const barRef = useRef(null);

  // 首次出现：从下方弹入 + 短暂发光
  useEffect(() => {
    if (visible && !introDone) {
      const timer = setTimeout(() => setIntroDone(true), 2200);
      return () => clearTimeout(timer);
    }
  }, [visible, introDone]);

  if (!visible) return null;

  const isHome = location.pathname === "/";

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      {/* 呼吸光晕 — 首次出现时更强 */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-1000
          ${introDone
            ? "opacity-30 bg-white/[0.04] animate-pulse"
            : "opacity-60 bg-white/[0.10]"}`}
        style={{ animationDuration: "3s" }}
      />

      {/* 胶囊条本体 */}
      <div
        ref={barRef}
        className={`relative flex rounded-full bg-white/[0.06] border border-white/[0.10] backdrop-blur-xl p-1
          shadow-[0_8px_32px_rgba(0,0,0,0.4)]
          transition-all duration-700 ease-out
          ${introDone ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
      >
        <button
          onClick={() => navigate("/")}
          className={`relative px-5 py-2 text-sm font-bold rounded-full transition-all duration-300
            before:absolute before:inset-0 before:rounded-full before:skew-x-[-6deg] before:-z-10 before:transition-colors
            ${isHome
              ? "text-white before:bg-white/15"
              : "text-white/50 hover:text-white/80 before:bg-transparent hover:before:bg-white/[0.06]"}`}
        >
          Me
        </button>

        <button
          onClick={() => navigate("/graygoo/")}
          className={`relative px-5 py-2 text-sm font-bold rounded-full transition-all duration-300
            before:absolute before:inset-0 before:rounded-full before:skew-x-[-6deg] before:-z-10 before:transition-colors
            ${!isHome
              ? "text-emerald-300 before:bg-emerald-500/15"
              : "text-emerald-400/50 hover:text-emerald-300/80 before:bg-transparent hover:before:bg-emerald-500/[0.08]"}`}
        >
          灰风
        </button>
      </div>
    </div>
  );
}

export default FAB;
