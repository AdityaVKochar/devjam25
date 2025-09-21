"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import CustomisationPage from "./customization";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Library");

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#07102e] to-[#08307a] text-white flex flex-col">
      {/* Top Navbar (brand left, signout right) with centered tabs */}
      <div className="relative px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">brandname</span>
          <button onClick={() => signOut({ callbackUrl: "/signin" })} className="px-4 py-1 rounded-md bg-gray-800 text-sm text-gray-200 hover:bg-gray-700">
            sign out
          </button>
        </div>

        {/* Centered tabs */}
        <div className="absolute left-1/2 top-4 transform -translate-x-1/2">
          <div className="flex items-center space-x-2 bg-[#0f3460] bg-opacity-20 rounded-full p-1">
            {["Library", "Customisation"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: large rounded panel centered horizontally, with roomy padding */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        {activeTab === 'Library' ? (
          <div className="w-full max-w-5xl mx-auto rounded-2xl bg-gradient-to-b from-[#081022] to-[#0b0b0b] shadow-2xl p-12">
            <div className="h-[360px] rounded-xl bg-gradient-to-b from-black/40 to-black/80 p-8 flex flex-col items-center justify-center text-center">
              <p className="text-gray-400 text-sm mb-4">You have not uploaded any pdfs/txts/links yet.</p>
              <h2 className="text-2xl font-extrabold mb-6">LISTEN TO YOUR FIRST AUDIOBOOK TODAY!</h2>
              <button className="px-6 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow-md">upload here</button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl mx-auto">
            <CustomisationPage />
          </div>
        )}
      </div>
    </div>
  );
}
