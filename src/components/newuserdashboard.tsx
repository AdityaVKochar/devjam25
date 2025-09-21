"use client";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Library");

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1a0026] to-[#2b0040] text-white flex flex-col">
      {/* Top Navbar */}
      <div className="flex justify-between items-center px-6 py-4">
        <span className="text-lg font-semibold">brandname</span>

        {/* Tabs */}
        <div className="flex space-x-2 bg-[#1c1c1c] rounded-lg p-2">
          {["Library", "Customisation"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-md text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-purple-700 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sign Out */}
        <button className="px-4 py-1 rounded-md bg-gray-800 text-sm text-gray-200 hover:bg-gray-700">
          sign out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-400 text-sm">
            You have not uploaded any pdfs/txts/links yet.
          </p>
          <h1 className="text-xl font-bold">
            LISTEN TO YOUR FIRST AUDIOBOOK TODAY!
          </h1>
          <button className="px-6 py-2 rounded-md bg-purple-700 hover:bg-purple-600 text-white shadow-md">
            upload here
          </button>
        </div>
      </div>
    </div>
  );
}
