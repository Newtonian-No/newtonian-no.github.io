import React from "react";

function Header({ activeTab, setActiveTab }) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6">
      <div className="text-white text-xl font-bold tracking-widest">YZ</div>
      <nav className="flex gap-1 bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10">
        {["me", "ai"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === tab
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab === "me" ? "Me" : "小灰"}
          </button>
        ))}
      </nav>
      <button className="text-white/60 hover:text-white transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
        </svg>
      </button>
    </header>
  );
}

export default Header;
