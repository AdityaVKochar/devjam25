"use client";
import { useState, useEffect, useRef } from "react";
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
  const [lines, setLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLines = async () => {
      if (!fileTitle) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/booklines?bookid=${encodeURIComponent(fileTitle)}`);
        const data = await res.json();
        if (data.lines && Array.isArray(data.lines)) {
          setLines(data.lines);
        } else {
          setError("No lines found for this book.");
        }
      } catch (err) {
        setError("Failed to fetch book lines.");
      } finally {
        setLoading(false);
      }
    };
    fetchLines();
  }, [fileTitle]);

  // Fetch generated audio from the listen API when fileTitle is available
  useEffect(() => {
    let cancelled = false;

    const fetchAudio = async () => {
      if (!fileTitle) return;
      setAudioLoading(true);
      setAudioError(null);

      // cleanup any previous audio
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch (e) {}
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }

      try {
        const res = await fetch(`/api/listen/${encodeURIComponent(fileTitle)}`);
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          setAudioError(`Voice service error: ${txt || res.status}`);
          setAudioLoading(false);
          return;
        }

        const blob = await res.blob();
        if (cancelled) return;

        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;

        const handleEnded = () => setIsPlaying(false);
        audio.addEventListener('ended', handleEnded);

        // Try to autoplay; browsers may block autoplay without user gesture.
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (playErr) {
          // Autoplay blocked; keep audio paused but available to play on user action
          setIsPlaying(false);
        }

        // cleanup listener when audio changes
        const cleanup = () => {
          audio.removeEventListener('ended', handleEnded);
        };

        // Attach cleanup to ref so it can be called on next fetch or unmount
        (audioRef as any).currentCleanup = cleanup;

      } catch (err) {
        setAudioError('Failed to fetch audio');
      } finally {
        setAudioLoading(false);
      }
    };

    fetchAudio();

    return () => {
      cancelled = true;
      // remove audio and cleanup
      if (audioRef.current) {
        try {
          // remove possible custom cleanup
          const c = (audioRef as any).currentCleanup;
          if (typeof c === 'function') c();
          audioRef.current.pause();
        } catch (e) {}
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, [fileTitle]);

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-[#1a1c24] to-black text-white flex flex-col">
      {/* Top Nav */}
      <div className="flex justify-between items-center px-6 py-4 bg-[#2c2f3a]">
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
        <h1 className="text-lg font-semibold text-blue-400 flex-1 text-center">
          {fileTitle ?? "PDF TITLE / LINK URL"}
        </h1>
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="flex items-center gap-2 bg-[#1c1f2b] hover:bg-[#33384a] px-4 py-2 rounded"
        >
          <FiLogOut /> sign out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-[#2b2e3b] to-[#121317] flex flex-col p-4">
          <h2 className="mb-4 font-semibold text-gray-200">characters</h2>
          <ul className="space-y-3 flex-1">
            <li className="flex items-center gap-3 cursor-pointer text-blue-400">
              <BsSoundwave size={22} />
              <span>character 1</span>
            </li>
            <li className="flex items-center gap-3 cursor-pointer text-gray-300 hover:text-blue-400">
              <FaUserCircle size={22} />
              <span>character 2</span>
            </li>
            <li className="flex items-center gap-3 cursor-pointer text-gray-300 hover:text-blue-400">
              <FaUserCircle size={22} />
              <span>character 3</span>
            </li>
            <li className="flex items-center gap-3 cursor-pointer text-gray-300 hover:text-blue-400">
              <FaUserCircle size={22} />
              <span>character 4</span>
            </li>
          </ul>

          <div className="mt-auto text-center">
            <p className="text-sm mb-2 text-gray-400">
              listen in your own voice now
            </p>
            <button
              type="button"
              className="px-6 py-2 justify-center text-white font-bold 
              transition-colors border-2 border-blue-600 rounded-[7px] 
              bg-blue-500 
              shadow-[4px_4px_1px_0_#2b3c64] cursor-pointer"
            >
              use voice!
            </button>
          </div>
        </div>

        {/* Reader Section */}
        <div className="flex-1 bg-gradient-to-b from-[#1f2430] to-black p-6 overflow-y-auto leading-relaxed text-gray-200">
          {loading ? (
            <p>Loading book...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : lines.length > 0 ? (
            lines.map((line, idx) => (
              <p key={idx} className="mb-4">{line}</p>
            ))
          ) : (
            <p>No content found for this book.</p>
          )}
        </div>
      </div>

      {/* Audio Player */}
      <div className="bg-[#0f172a] px-6 py-3 flex flex-col">
        <div className="flex items-center justify-center gap-6 text-xl">
          <button className="text-gray-300 hover:text-white">
            <MdSkipPrevious size={28} />
          </button>
          <button
            onClick={async () => {
              if (!audioRef.current) return;
              try {
                if (isPlaying) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                } else {
                  await audioRef.current.play();
                  setIsPlaying(true);
                }
              } catch (e) {
                // ignore play errors
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3"
          >
            {isPlaying ? <IoMdPause size={28} /> : <IoMdPlay size={28} />}
          </button>
          <button className="text-gray-300 hover:text-white">
            <MdSkipNext size={28} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-between text-sm mt-3">
          <span className="text-gray-400">1:14</span>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="25"
            className="flex-1 mx-4 accent-blue-500"
          />
          <span className="text-gray-400">4:32</span>
        </div>
      </div>
    </div>
  );
}
