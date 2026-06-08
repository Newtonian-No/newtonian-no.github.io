import React, { useState } from "react";
import Intro from "./components/Intro";
import HeroSection from "./components/HeroSection";
import Header from "./components/Header";
import TabMe from "./components/TabMe";
import TabAI from "./components/TabAI";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [activeTab, setActiveTab] = useState("me");

  const handleIntroComplete = () => {
    setIsLoading(false);
    // 等 Intro 从 DOM 移除后，再挂载 HeroSection，确保 GSAP 动画用户可见
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <div className="bg-[#02020e] text-white overflow-x-hidden">
      {isLoading && <Intro onComplete={handleIntroComplete} />}

      {showContent && (
        <div className="animate-fadeIn">
          <HeroSection />
          <section className="min-h-screen">
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
