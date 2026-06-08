import React, { useState } from "react";
import Intro from "./components/Intro";
import HeroSection from "./components/HeroSection";
import Header from "./components/Header";
import TabMe from "./components/TabMe";
import TabAI from "./components/TabAI";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("me");

  return (
    <div className="bg-[#02020e] text-white overflow-x-hidden">
      {/* 阶段1：开场动画 */}
      {isLoading && <Intro onComplete={() => setIsLoading(false)} />}

      {/* 阶段2+3：Hero 全屏 → 滚动进入内容 */}
      <div
        className={`transition-opacity duration-700 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Hero: 100vh 全屏 Slogan */}
        <HeroSection />

        {/* 内容区：Header + Tab */}
        <section className="min-h-screen">
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="pb-20 px-6">
            {activeTab === "me" ? <TabMe /> : <TabAI />}
          </main>
        </section>
      </div>
    </div>
  );
}

export default App;
