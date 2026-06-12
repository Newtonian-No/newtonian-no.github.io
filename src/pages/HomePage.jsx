import React, { useState } from "react";
import Intro from "../components/Intro";
import HeroSection from "../components/HeroSection";
import TabMe from "../components/TabMe";
import BlackHole from "../components/blackhole";
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
          <section className="min-h-screen bg-[#02020e]">
            <main className="pb-20 px-6">
              <TabMe />
            </main>
          </section>
        </div>
      )}
      <FAB visible={fabVisible} />
    </div>
  );
}

export default HomePage;
