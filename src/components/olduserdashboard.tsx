"use client";
import React from "react";

export default function LibraryPage() {
  const files = [
    { name: "name-pdf.pdf" },
    { name: "https://z-lib/emily-br..." },
    { name: "name-pdf.pdf" },
    { name: "no-name.txt" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-700 to-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4">
        <h1 className="text-sm font-semibold">brandname</h1>
        <button className="bg-black text-white rounded px-4 py-1">
          sign out
        </button>
      </header>

      {/* Tabs */}
      <div className="flex justify-center mt-4 space-x-2">
        <button className="bg-blue-500 text-white px-6 py-2 rounded">
          Library
        </button>
        <button className="bg-black text-white px-6 py-2 rounded">
          Customisation
        </button>
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center mt-6 px-6">
        <div className="bg-gray-900 p-6 rounded-xl w-full max-w-5xl">
          {/* Search */}
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

          {/* Files */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="bg-gray-200 text-black rounded p-3 flex flex-col justify-between h-28"
              >
                <p className="truncate w-full text-sm mb-2 text-center">
                  {file.name}
                </p>
                <div className="flex justify-center space-x-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                    listen
                  </button>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
