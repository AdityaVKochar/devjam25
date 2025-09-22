import React, { useState } from "react";

interface PopupProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (link: string) => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onCancel, onSubmit }) => {
  const [link, setLink] = useState("");

  if (!isOpen) return null;

  // Smart submit handler
  const handleSmartSubmit = async () => {
    // Check if link matches https://novelbin.com/b/{bookid}
    const match = link.match(/^https:\/\/novelbin\.com\/b\/[^/?#]+/);
    if (match) {
      try {
        await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ link }),
        });
        onSubmit(link);
      } catch (err) {
        alert("Failed to process the link. Please try again.");
      }
    } else {
      onSubmit(link);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-80 backdrop-blur-lg transition-all">
      <div
        style={{
          borderRadius: "7px",
          border: "7px solid var(--blue-grad, #197AF0)",
          background: "#000",
          width: "824px",
          height: "433px",
          fontFamily: "Metropolis, sans-serif",
          fontSize: "20px"
        }}
        className="flex flex-col items-center justify-center p-8"
      >

        {/* Upload file section */}
        <div className="w-full flex flex-col items-center mb-10">
          <div className="flex flex-row items-center justify-center w-fit gap-25">
            <div className="flex flex-col items-start mb-1">
              <span className="text-white text-lg font-semibold mr-4 text-left">upload your document here:</span>
              <span
                style={{
                  color: "#A6A5A5",
                  fontFamily: "Metropolis, sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                  letterSpacing: "0.32px",
                  marginTop: "6px"
                }}
                className="ml-1 text-left"
              >
                supported formats: pdf/txt
              </span>
            </div>
            <button
              type="button"
              style={{
                borderRadius: "7px",
                background: "var(--blue-grad, linear-gradient(90deg, #197AF0 0%, #0252C5 100%))",
                boxShadow: "4px 4px 1px 0 #B1C2F4"
              }}
              className="px-6 py-2 text-white font-bold transition-colors border-2 border-blue-700 ml-4 cursor-pointer"
            >
              upload from you device
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center mb-8">
          <hr className="flex-grow border-t-2 border-white-300" />
          <span className="mx-4 text-white-400 text-2xl font-bold select-none">or</span>
          <hr className="flex-grow border-t-2 border-white-300" />
        </div>

        {/* Paste link section */}
        <div className="w-full mb-6 relative flex items-center">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.2334 19.6072L12.6526 22.188C11.3415 23.4992 9.21578 23.4992 7.90471 22.188C6.59361 20.8769 6.59361 18.7513 7.90471 17.4402L10.4855 14.8593M14.4324 11.0289L17.4149 8.04643C18.7259 6.73534 20.8517 6.73534 22.1627 8.04643C23.4738 9.3575 23.4738 11.4832 22.1627 12.7943L19.1803 15.7767" stroke="#595555" stroke-width="1.40625" stroke-linecap="round"/>
                <path d="M11.5547 18.7626L18.7179 11.5994" stroke="#595555" stroke-width="1.40625" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

          </span>
          <input
            type="text"
            placeholder="paste link here"
            value={link}
            onChange={e => setLink(e.target.value)}
            style={{
              borderRadius: "7px",
              background: "#C7D0E9",
              paddingLeft: "2.5rem"
            }}
            className="w-full py-2 px-4 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
          />
        </div>

        {/* Buttons */}
  <div className="flex w-full gap-4 justify-center items-center">
          <button
            onClick={onCancel}
              style={{
                borderRadius: "7px",
                background: "var(--blue-grad, linear-gradient(90deg, #197AF0 0%, #0252C5 100%))",
                boxShadow: "4px 4px 1px 0 #B1C2F4",
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Metropolis, sans-serif",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "normal",
                padding: "12px 32px"
              }}
              className="text-white font-bold py-2 transition-colors border-2 border-blue-700 cursor-pointer"
          >
            cancel
          </button>
          <button
            onClick={handleSmartSubmit}
              style={{
                borderRadius: "7px",
                background: "var(--blue-grad, linear-gradient(90deg, #197AF0 0%, #0252C5 100%))",
                boxShadow: "4px 4px 1px 0 #B1C2F4",
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Metropolis, sans-serif",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "normal",
                padding: "12px 32px"
              }}
              className="text-white font-bold py-2 transition-colors border-2 border-blue-700 cursor-pointer"
          >
            submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;