"use client";
import React, { useState } from "react";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<"Library" | "Customisation">(
    "Library"
  );

  const files = [
    { name: "name-pdf.pdf" },
    { name: "https://z-lib/emily-br..." },
    { name: "name-pdf.pdf" },
    { name: "no-name.txt" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-700 to-black text-white">

      <header className="flex justify-between items-center px-6 py-4">
        <h1 className="text-sm font-semibold">brandname</h1>
        <button className="bg-black text-white rounded px-4 py-1">
          sign out
        </button>
      </header>

      
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setActiveTab("Library")}
          className={`px-6 py-2 rounded ${
            activeTab === "Library"
              ? "bg-blue-500 text-white"
              : "bg-black text-white"
          }`}
        >
          Library
        </button>
        <button
          onClick={() => setActiveTab("Customisation")}
          className={`px-6 py-2 rounded ${
            activeTab === "Customisation"
              ? "bg-blue-500 text-white"
              : "bg-black text-white"
          }`}
        >
          Customisation
        </button>
      </div>

      
      <main className="flex-1 flex flex-col items-center mt-6 px-6">
        <div className="bg-gray-900 p-6 rounded-xl w-full max-w-5xl">
          
          <div className="flex items-center space-x-2 mb-6">
            <input
              type="text"
              placeholder="search"
              className="flex-1 bg-gray-200 text-black rounded px-3 py-2"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              upload here
            </button>
          </div>

          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="bg-gray-200 text-black rounded p-3 flex flex-col justify-between h-28"
              >
                <p className="truncate w-full text-sm mb-2 text-center">
                  {file.name}
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
                    upload your recording here : <br />
                    <span className="text-gray-500">supported formats: mp3</span>
                  </span>
                  <button className="bg-blue-600 px-4 py-2 rounded text-sm">
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
                  {/* Mic button */}
                  <button className="bg-white text-black p-4 rounded-full hover:scale-105 transition">
                    🎤
                  </button>
                </div>
              </section>
            </main>
          </div>
        )}
      </main>
    </div>
  );
}
