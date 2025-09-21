"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Library");

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#07102e] to-[#08307a] text-white flex flex-col">
      {/* Top Navbar */}
      <div className="relative px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">brandname</span>
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="px-4 py-1 rounded-md bg-gray-800 text-sm text-gray-200 hover:bg-gray-700"
          >
            sign out
          </button>
        </div>

        {/* Centered Tabs */}
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

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        {activeTab === "Library" ? (
          <div className="w-full max-w-5xl mx-auto rounded-2xl bg-gradient-to-b from-[#081022] to-[#0b0b0b] shadow-2xl p-12 h-full flex flex-col justify-center">
            <div className="flex-1 rounded-xl bg-gradient-to-b from-black/40 to-black/80 p-8 flex flex-col items-center justify-center text-center">
              <p className="text-gray-400 text-sm mb-4">
                You have not uploaded any pdfs/txts/links yet.
              </p>
              <h2 className="text-2xl font-extrabold mb-6">
                LISTEN TO YOUR FIRST AUDIOBOOK TODAY!
              </h2>
              <button className="px-6 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow-md">
                upload here
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl mx-auto h-full flex-1">
            
            <div className="flex-1 flex items-center justify-center text-white overflow-hidden">
              <main className="flex flex-col md:flex-row items-center justify-center gap-10 w-full">
                {/* Left Section */}
                <section className="max-w-md">
                  <h2 className="text-2xl font-semibold mb-4">
                    Customise stories with your voice
                  </h2>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                    lobortis maximus nunc, ac rhoncus odio congue quis. Sed ac semper
                    orci, eu porttitor lacus...
                  </p>

                  {/* Divider */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex-1 h-px bg-gray-600" />
                    <span className="text-gray-400 text-sm">or</span>
                    <div className="flex-1 h-px bg-gray-600" />
                  </div>

                  {/* Upload Section */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">
                      upload your recording here: <br />
                      <span className="text-gray-500">supported formats: mp3</span>
                    </span>
                    <button
                      type="button"
                      style={{
                        borderRadius: "7px",
                        background:
                          "linear-gradient(90deg, #197AF0 0%, #0252C5 100%)",
                        boxShadow: "4px 4px 1px 0 #B1C2F4",
                      }}
                      className="px-4 py-1 text-white text-sm font-bold border-2 border-blue-700"
                    >
                      voice recording
                    </button>
                  </div>
                </section>

                {/* Right Section */}
                <section className="bg-gradient-to-b from-gray-800 to-black rounded-xl p-8 w-80 text-center shadow-lg">
                  <p className="text-gray-400 mb-6">
                    press the button below to start recording
                  </p>
                  <div className="flex flex-col items-center">
                    <button className="bg-white text-black p-4 rounded-full hover:scale-105 transition">
                      🎤
                    </button>
                  </div>
                </section>
              </main>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
