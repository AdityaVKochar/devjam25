"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import Popup from "./Popup";
import Image from "next/image";

export default function OldUserDashboard() {
  const [activeTab, setActiveTab] = useState("library");

  const files = [
    { name: "name-pdf.pdf" },
    { name: "https://z-lib/emily-br..." },
    { name: "name-pdf.pdf" },
    { name: "no-name.txt" },
  ];

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSubmit = (link: string) => {
    console.log("submitted link:", link);
    setIsPopupOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-700 to-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4">
        <h1 className="text-sm font-semibold">EchoTales</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="bg-black text-white rounded px-4 py-1 hover:opacity-90"
        >
          sign out
        </button>
      </header>

      {/* Tab Toggle */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setActiveTab("library")}
          className={`px-6 py-2 rounded ${
            activeTab === "library" ? "bg-blue-500 text-white" : "bg-black text-white"
          }`}
        >
          Library
        </button>
        <button
          onClick={() => setActiveTab("customisation")}
          className={`px-6 py-2 rounded ${
            activeTab === "customisation" ? "bg-blue-500 text-white" : "bg-black text-white"
          }`}
        >
          Customisation
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 pt-6 mb-6">
        <div
  className="p-6 rounded-xl w-full max-w-6xl flex-1 flex flex-col text-white"
  style={{
    background: "rgba(0, 0, 0, 0.45)",
    boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
    backdropFilter: "blur(2px)",
  }}
>

          {activeTab === "library" ? (
            
            <div className="flex flex-col flex-1">
              <div className="flex items-center space-x-2 mb-15 mt-10">
                <input
                  type="text"
                  placeholder="search"
                  className="flex-1 bg-[#C7D0E9] text-black rounded px-3 py-2"
                />
                <button
                  type="button"
                  style={{
                    borderRadius: "7px",
                    background: "linear-gradient(90deg, #197AF0 0%, #0252C5 100%)",
                    boxShadow: "4px 4px 1px 0 #B1C2F4",
                  }}
                  className="px-6 py-2 text-white font-bold transition-colors border-2 border-blue-700 ml-4"
                  onClick={() => setIsPopupOpen(true)}
                >
                  upload here
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 mb-4 flex-grow">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="bg-[#C7D0E9] text-black rounded p-4 flex flex-col justify-between h-38"
                  >
                    <p className="truncate w-full text-sm mb-2 text-center">
                      {file.name}
                    </p>
					<div className="flex justify-center space-x-6">
                      <button
                        type="button"
                        style={{
                          borderRadius: "7px",
                          background: "linear-gradient(90deg, #197AF0 0%, #0252C5 100%)",
                          boxShadow: "4px 4px 1px 0 #B1C2F4",
                        }}
                        className="px-4 py-1 text-white text-sm font-bold border-2 border-blue-700"
                      >
                        listen
                      </button>
                      <button
                        type="button"
                        style={{
                          borderRadius: "7px",
                          background: "linear-gradient(90deg, #197AF0 0%, #0252C5 100%)",
                          boxShadow: "4px 4px 1px 0 #B1C2F4",
                        }}
                        className="px-4 py-1 text-white text-sm font-bold border-2 border-blue-700"
                      >
                        delete
                      </button>
                    </div>
                  </div>
				  
                ))}
              </div>
            </div>
          ) : (
            
            <div className="flex-1 flex items-center justify-center text-white overflow-hidden">
              <main className="flex flex-col md:flex-row items-center justify-center gap-30 w-full">
                {/* Left Section */}
                <section className="max-w-md">
                  <h2 className="text-2xl font-semibold mb-4">
                    Customise stories with your voice
                  </h2>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Customise how your stories sound. Make every story uniquely yours. Record your own voice or upload a file to bring characters and narration to life in a way that feels personal. Your voice, your story.
Record now. 
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
                    <button
                        type="button"
                        style={{
                          borderRadius: "7px",
                          background: "linear-gradient(90deg, #197AF0 0%, #0252C5 100%)",
                          boxShadow: "4px 4px 1px 0 #B1C2F4",
                        }}
                        className="px-4 py-1 text-white text-sm font-bold border-2 border-blue-700"
                      >
                        voice recording
                      </button>
                  </div>
                </section>

                {/* Right Section */}
                <section
  className="bg-[url('/dotbg.svg')] bg-cover border-1 bg-center rounded-xl p-8 w-80 text-center shadow-lg"
>
                  <p className="text-gray-400 mb-6">
                    press the button below to start recording
                  </p>
				                        
                  <div className="flex flex-col items-center">
					<Image src="/wave.svg" alt="mic" width={200} height={200} />
                    <button className="hover:scale-105 transition mt-6">
                      <Image src="/mic.svg" alt="mic" width={60} height={60} />
                    </button>
                  </div>
                </section>
              </main>
            </div>
          )}
        </div>
      </main>
      <Popup isOpen={isPopupOpen} onCancel={() => setIsPopupOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
}
