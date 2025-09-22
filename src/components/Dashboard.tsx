"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import Popup from "./Popup";
import Image from "next/image";
import Main from "./Main";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("library");
  const [files, setFiles] = useState<{ name: string }[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedAudioName, setSelectedAudioName] = useState<string | null>(null);
  const [selectedAudioData, setSelectedAudioData] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const audioInputRef = React.useRef<HTMLInputElement | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  React.useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch("/api/files");
        const data = await res.json();
        if (data.files && Array.isArray(data.files)) {
          setFiles(data.files.map((f: any) => ({ name: f.bookid })));
        }
      } catch (err) {
        console.error("Failed to fetch files", err);
      }
    }
    fetchFiles();
  }, []);

  const handleSubmit = async (payload: { type: "file" | "link" | "voice"; value: any }) => {
    console.log("popup submit payload:", payload);
    setIsPopupOpen(false);

    if (payload.type === "file") {
      try {
        const res = await fetch("/api/generate-story", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: payload.value }),
        });
        const data = await res.json();
        if (data?.file) {
         
          setFiles((cur) => [{ name: data.file.title || data.file.bookid }, ...cur]);
        } else {
          console.error("generate-story returned no file", data);
        }
      } catch (err) {
        console.error("Failed to generate story", err);
      }
      return;
    }

    if (payload.type === 'voice') {
      try {
        const r = await uploadVoice(payload.value.filename, payload.value.data);
        if (r && r.success) {

          setFiles((cur) => [{ name: payload.value.filename }, ...cur]);

          setSuccessMessage(`${payload.value.filename} uploaded successfully`);
          setTimeout(() => setSuccessMessage(null), 4000);
        }
      } catch (err) {
        console.error('Failed to upload voice', err);
      }
      return;
    }

    console.log("submitted link:", payload.value);
  };

  const uploadVoice = async (filename: string, dataUrl: string) => {
    try {
      const res = await fetch('/api/upload-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, data: dataUrl }),
      });
      const j = await res.json();
      if (!res.ok) {
        console.error('Failed to upload voice', j);
        alert('Failed to upload voice');
        return null;
      }
      return j;
    } catch (err) {
      console.error('uploadVoice error', err);
      alert('Failed to upload voice');
      return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-500 to-blue-1100 text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4">
        <h1 className="text-lg font-semibold">EchoTales</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="bg-black text-white rounded px-4 py-1 hover:opacity-90 cursor-pointer"
        >
          sign out
        </button>
      </header>

      {successMessage && (
        <div className="mx-6 mt-3 p-3 rounded bg-green-600 text-white text-sm">
          {successMessage}
        </div>
      )}

      {/* Tab Toggle */}
<div className="flex justify-center mt-4">
  <div className="flex bg-[#0f172a] rounded-lg overflow-hidden border-5 border-black">
    <button
      onClick={() => setActiveTab("library")}
      className={`px-6 py-2 font-semibold transition-colors ${
        activeTab === "library"
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
          : "text-white"
      }`}
    >
      Library
    </button>
    <button
      onClick={() => setActiveTab("customisation")}
      className={`px-6 py-2 font-semibold transition-colors ${
        activeTab === "customisation"
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
          : "text-white"
      }`}
    >
      Customisation
    </button>
  </div>
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
                  className="px-6 py-2 text-white font-bold transition-colors border-2 border-blue-700 ml-4 rounded-[7px] bg-gradient-to-r from-[#197AF0] to-[#0252C5] shadow-[4px_4px_1px_0_#B1C2F4] cursor-pointer"
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
                    <p className="truncate w-full text-lg mb-2 mt-6 text-center">
                      {file.name}
                    </p>
                    <div className="flex justify-center space-x-6">
                      <button
                        type="button"
                        onClick={() => {
                          router.push(`/listen?title=${encodeURIComponent(file.name)}`);
                        }}
                        className="px-12 py-1 text-white text-sm font-bold border-2 border-blue-700 rounded-[7px] bg-gradient-to-r from-[#197AF0] to-[#0252C5] shadow-[4px_4px_1px_0_#B1C2F4] cursor-pointer"
                      >
                        listen
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
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => audioInputRef.current?.click()}
                          className="px-4 py-1 text-white text-sm font-bold border-2 border-blue-700 rounded-[7px] bg-gradient-to-r from-[#197AF0] to-[#0252C5] shadow-[4px_4px_1px_0_#B1C2F4] cursor-pointer"
                        >
                          upload audio
                        </button>
                        <input
                          ref={audioInputRef}
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files && e.target.files[0];
                            if (f) {
                              setSelectedAudioName(f.name);
                              try {
                                const arrayBuffer = await f.arrayBuffer();
                                const b64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
                                setSelectedAudioData(`data:${f.type};base64,${b64}`);
                              } catch (err) {
                                console.error('Failed to read audio file', err);
                              }
                            }
                          }}
                        />
                      </div>
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
                    <button
                      onClick={async () => {
                        if (isRecording) {
                          
                          mediaRecorder?.stop();
                          setIsRecording(false);
                        } else {
                          try {
                            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                            const mr = new MediaRecorder(stream);
                            audioChunksRef.current = [];
                            mr.ondataavailable = (ev: any) => {
                              if (ev.data && ev.data.size > 0) audioChunksRef.current.push(ev.data);
                            };
                            mr.onstop = async () => {
                              const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                              const arrayBuffer = await blob.arrayBuffer();
                              const b64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
                              const name = `recording-${Date.now()}.webm`;
                              setSelectedAudioData(`data:audio/webm;base64,${b64}`);
                              setSelectedAudioName(name);
                              const res = await uploadVoice(name, `data:audio/webm;base64,${b64}`);
                              if (res && res.success) {
                                setFiles(cur => [{ name }, ...cur]);
                                alert('Recording uploaded');
                              }
                            };
                            mr.start();
                            setMediaRecorder(mr);
                            setIsRecording(true);
                          } catch (err) {
                            console.error('Microphone access denied or not available', err);
                            alert('Unable to access microphone');
                          }
                        }
                      }}
                      className={`hover:scale-105 transition mt-6 cursor-pointer ${isRecording ? 'ring-4 ring-green-400 rounded-full' : ''}`}
                    >
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
      {isMainOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex">
          <div className="m-auto w-full h-full">
            <Main fileTitle={selectedFile} onBack={() => setIsMainOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
