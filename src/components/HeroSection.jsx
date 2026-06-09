import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const TARGET = "BEYOND LIMITS";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?!@#$%&";

function HeroSection() {
  const sectionRef = useRef(null);
  const sloganRef = useRef(null);
  const blurRef = useRef(null);

  useGSAP(
    () => {
      const slogan = sloganRef.current;
      const blurEl = blurRef.current;
      if (!slogan || !blurEl) return;

      const scrambleText = (progress) => {
        let result = "";
        for (let i = 0; i < TARGET.length; i++) {
          if (TARGET[i] === " ") {
            result += " ";
            continue;
          }
          const lockThreshold = i / TARGET.length;
          if (progress > lockThreshold) {
            result += TARGET[i];
          } else {
            result += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        slogan.textContent = result;
      };

      const tl = gsap.timeline();

      tl.fromTo(
        slogan,
        { y: 120, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.4, ease: "back.out(3)" },
        0
      );

      tl.to(
        blurEl,
        { attr: { stdDeviation: "0,20" }, duration: 0.3, ease: "power2.out" },
        0
      ).to(
        blurEl,
        { attr: { stdDeviation: "0,0" }, duration: 0.8, ease: "power2.inOut" },
        0.3
      );

      tl.to(
        { progress: 0 },
        {
          progress: 1,
          duration: 1.0,
          ease: "none",
          onUpdate: function () {
            scrambleText(this.targets()[0].progress);
          },
          onComplete: () => {
            slogan.textContent = TARGET;
          },
        },
        0
      );

      tl.fromTo(
        ".hero-sub",
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6 },
        "-=0.2"
      );
      tl.fromTo(
        ".hero-scroll",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.6 },
        "-=0.3"
      );

      tl.to(".hero-scroll", {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      }, "-=0.5");
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="vertical-blur">
            <feGaussianBlur ref={blurRef} stdDeviation="0,0" />
          </filter>
        </defs>
      </svg>

      <div className="text-center z-10 px-6">
        <h1
          ref={sloganRef}
          className="text-7xl md:text-[8vw] font-black text-white uppercase tracking-wide leading-none"
          style={{
            fontFamily: "'Oswald', 'Impact', 'Arial Black', sans-serif",
            filter: "url(#vertical-blur)",
          }}
        >
          {TARGET}
        </h1>
        <p className="hero-sub text-lg md:text-xl text-gray-500 font-light mt-8 max-w-md mx-auto">
          阮愔哲 · 上海大学 · 人工智能
        </p>
      </div>

      <div className="hero-scroll absolute bottom-10 flex flex-col items-center gap-3 text-gray-600">
        <span className="text-[11px] tracking-[0.3em] uppercase">Scroll to Explore</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}

export default HeroSection;
