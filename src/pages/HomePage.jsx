import React, { useState } from "react";
import Intro from "../components/Intro";
import HeroSection from "../components/HeroSection";
import TabMe from "../components/TabMe";
import BlackHole from "../components/blackhole";
import ScrollReveal from "../components/ScrollReveal";
import FAB from "../components/FAB";

function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [fabVisible, setFabVisible] = useState(false);

  const handleIntroComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      setShowContent(true);
      setTimeout(() => setFabVisible(true), 800);
    }, 100);
  };

  return (
    <div className="bg-[#02020e] text-white overflow-x-hidden">
      <BlackHole />
      {isLoading && <Intro onComplete={handleIntroComplete} />}
      {showContent && (
        <div className="animate-fadeIn">
          <HeroSection />

          {/* Bio 区 — 透明背景，卡片自带磨砂玻璃 */}
          <ScrollReveal type="fade-up" threshold={0.2}>
            <section className="min-h-screen">
              <main className="pb-20 px-6">
                <TabMe />
              </main>
            </section>
          </ScrollReveal>
        </div>
      )}
      <FAB visible={fabVisible} />
    </div>
  );
}

export default HomePage;
