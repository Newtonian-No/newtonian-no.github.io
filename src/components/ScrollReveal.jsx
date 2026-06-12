import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const defaults = {
  "fade-up": { y: 40, opacity: 0, to: { y: 0, opacity: 1 } },
  "fade-down": { y: -40, opacity: 0, to: { y: 0, opacity: 1 } },
  "fade-left": { x: -40, opacity: 0, to: { x: 0, opacity: 1 } },
  "fade-right": { x: 40, opacity: 0, to: { x: 0, opacity: 1 } },
  "line": { scaleX: 0, transformOrigin: "left center", to: { scaleX: 1 } },
  "scale-in": { scale: 0.92, opacity: 0, to: { scale: 1, opacity: 1 } },
};

/**
 * Scroll-triggered reveal wrapper. 用法：
 * <ScrollReveal type="fade-up" stagger={0.15}>  // stagger 给子元素错开
 *   <div>...</div>
 *   <div>...</div>
 * </ScrollReveal>
 */
export default function ScrollReveal({
  type = "fade-up",
  delay = 0,
  duration = 1,
  ease = "power3.out",
  stagger,
  threshold = 0.15,       // 元素露出多少时触发
  once = true,
  children,
  className = "",
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const preset = defaults[type] || defaults["fade-up"];

  useGSAP(
    () => {
      const targets = stagger
        ? ref.current.children
        : ref.current;

      gsap.fromTo(
        targets,
        { ...preset },
        {
          ...preset.to,
          duration,
          delay,
          ease,
          stagger: stagger || 0,
          scrollTrigger: {
            trigger: ref.current,
            start: `top bottom-=${Math.round(threshold * 100)}%`,
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
