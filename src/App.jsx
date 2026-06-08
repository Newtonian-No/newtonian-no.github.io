import React, { useState } from "react";
import Intro from "./components/Intro";
import Header from "./components/Header";
import TabMe from "./components/TabMe";
import TabAI from "./components/TabAI";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("me");

  return (
    <div className="min-h-screen bg-[#02020e] text-white overflow-x-hidden">
      {/* 开场动画 */}
      {isLoading && <Intro onComplete={() => setIsLoading(false)} />}

      {/* 主内容 */}
      <div
        className={`transition-opacity duration-1000 ${
          isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="pt-32 pb-20 px-6">
          {activeTab === "me" ? <TabMe /> : <TabAI />}
        </main>
      </div>
    </div>
  );
}

export default App;
