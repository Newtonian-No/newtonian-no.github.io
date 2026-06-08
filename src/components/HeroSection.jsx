import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function HeroSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // 标题从下浮上
    tl.fromTo(
      ".hero-title",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    )
    // 副标题延迟浮现
    .fromTo(
      ".hero-sub",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    )
    // 滚动指示器呼吸动画
    .fromTo(
      ".hero-scroll",
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      "-=0.2"
    );

    // 持续呼吸
    gsap.to(".hero-scroll", {
      y: 10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex flex-col items-center justify-center bg-[#02020e] overflow-hidden"
    >
      {/* 大标题 */}
      <div className="text-center z-10 px-6">
        <h1 className="hero-title text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter text-white leading-none">
          BEYOND
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            LIMITS
          </span>
        </h1>
        <p className="hero-sub text-lg md:text-xl text-gray-500 font-light mt-8 max-w-md mx-auto">
          阮愔哲 · 上海大学 · 人工智能
        </p>
      </div>

      {/* 滚动指示器 */}
      <div className="hero-scroll absolute bottom-10 flex flex-col items-center gap-3 text-gray-600">
        <span className="text-[11px] tracking-[0.3em] uppercase">Scroll to Explore</span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="animate-bounce"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}

export default HeroSection;
