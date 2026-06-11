import React, { useState } from "react";
import Intro from "./components/Intro";
import HeroSection from "./components/HeroSection";
import Header from "./components/Header";
import TabMe from "./components/TabMe";
import TabAI from "./components/TabAI";
import BlackHole from "./components/blackhole";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [activeTab, setActiveTab] = useState("me");

  const handleIntroComplete = () => {
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <div className="bg-[#02020e] text-white overflow-x-hidden">
      {/* 星环背景：始终渲染，fixed 全屏，在 Intro 和 HeroSection 下方 */}
      <BlackHole />

      {isLoading && <Intro onComplete={handleIntroComplete} />}

      {showContent && (
        <div className="animate-fadeIn">
          <HeroSection />
          <section className="min-h-screen bg-[#02020e]">
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="pb-20 px-6">
              {activeTab === "me" ? <TabMe /> : <TabAI />}
            </main>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
