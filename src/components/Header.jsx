import React from "react";

function Header({ activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-8 py-5 bg-[#02020e]/80 backdrop-blur-md border-b border-white/[0.04]">
      <div className="text-white text-lg font-bold tracking-widest">YZ</div>
      <nav className="flex gap-1 bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10">
        {["me", "ai"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === tab
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab === "me" ? "Me" : "小灰"}
          </button>
        ))}
      </nav>
      <div className="w-6" />
    </header>
  );
}

export default Header;
