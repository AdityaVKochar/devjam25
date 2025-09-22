"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { FiChevronLeft, FiLogOut } from "react-icons/fi";
import { BsSoundwave } from "react-icons/bs";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";

type MainProps = {
  fileTitle?: string | null;
  onBack?: () => void;
};

export default function EchoTalesPage({ fileTitle, onBack }: MainProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-blue-700 to-black text-white flex flex-col">
      {/* Top Nav */}
      <div className="flex justify-between items-center px-6 py-4 bg-blue-200">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            if (onBack) onBack();
            else router.back();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              if (onBack) onBack();
              else router.back();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <FiChevronLeft size={20} />
          <span className="font-medium">back</span>
        </div>
  <h1 className="text-lg font-semibold font-color-black">{fileTitle ?? "PDF TITLE / LINK URL"}</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="flex items-center gap-2 bg-[#1c1f2b] hover:bg-[#2a2e3f] px-4 py-2 rounded"
        >
          <FiLogOut /> sign out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-blue-700 to-black flex flex-col p-4">
          <h2 className="mb-4 font-semibold">characters</h2>
          <ul className="space-y-3 flex-1">
            <li className="flex items-center gap-3 cursor-pointer">
              <BsSoundwave size={22} />
              <span>character 1</span>
            </li>
            <li className="flex items-center gap-3 cursor-pointer">
              <FaUserCircle size={22} />
              <span>character 2</span>
            </li>
            <li className="flex items-center gap-3 cursor-pointer">
              <FaUserCircle size={22} />
              <span>character 3</span>
            </li>
            <li className="flex items-center gap-3 cursor-pointer">
              <FaUserCircle size={22} />
              <span>character 4</span>
            </li>
          </ul>

          <div className="mt-auto text-center">
            <p className="text-sm mb-2">listen in your own voice now</p>
            <button
                  type="button"
                  className="px-6 py-2 justify-center text-white font-bold transition-colors border-2 border-blue-700 ml-4 rounded-[7px] bg-gradient-to-r from-[#197AF0] to-[#0252C5] shadow-[4px_4px_1px_0_#B1C2F4] cursor-pointer"

                >
                  record voice now!
                </button>
          </div>
        </div>

        {/* Reader Section */}
        <div className="flex-1 bg-gradient-to-b from-blue-400 to-black p-6 overflow-y-auto leading-relaxed text-gray-200">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
            lobortis maximus nunc, ac rhoncus odio congue quis. Sed ac semper
            orci, eu porttitor lacus. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Morbi lobortis maximus nunc, ac rhoncus odio congue
            quis. Sed ac semper orci, eu porttitor lacus. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Morbi lobortis maximus nunc, ac
            rhoncus odio congue quis...
          </p>
          <p className="mt-6">
            (repeat dummy text as much as needed to match UI)
          </p>
        </div>
      </div>

      {/* Audio Player */}
      <div className="bg-[#0f172a] px-6 py-3 flex flex-col">
        <div className="flex items-center justify-center gap-6 text-xl">
          <button>
            <MdSkipPrevious size={28} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white text-black rounded-full p-3"
          >
            {isPlaying ? <IoMdPause size={28} /> : <IoMdPlay size={28} />}
          </button>
          <button>
            <MdSkipNext size={28} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-between text-sm mt-3">
          <span>1:14</span>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="25"
            className="flex-1 mx-4"
          />
          <span>4:32</span>
        </div>
      </div>
    </div>
  );
}
