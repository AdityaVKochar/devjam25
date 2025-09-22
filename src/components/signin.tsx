"use client";
import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { signIn } from "next-auth/react";

const Threads = dynamic(() => import("./Threads").then((m) => m.default), {
  ssr: false,
});

export default function SignIn(): React.ReactElement {
  return (
    <section
      aria-label="Sign in"
      className="relative flex min-h-screen items-center justify-center bg-[#0b0710]"
    >
      {/* Threads background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Threads />
      </div>

      {/* Center card */}
      <div className="relative z-10 flex w-full justify-end md:justify-left px-6 sm:px-10">
        <div className="w-full max-w-lg md:max-w-2xl md:mx-0 rounded-2xl border border-white/50 bg-black/40 p-6 sm:p-10 md:p-30 md:min-h-[480px] shadow-xl backdrop-blur-md">
          <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Listen to your stories, whenever you like
          </h2>
          <p className="mt-4 leading-relaxed text-white/75">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
            lobortis maximus nunc, ac rhoncus odio congue quis. Sed ac semper
            orci, eu porttitor lacus.
          </p>

          <div>
            <button onClick={() => signIn('google', { callbackUrl: '/api/auth/after' })} className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-white px-5 py-3 font-semibold text-black shadow-md transition hover:bg-gray-100 cursor-pointer">
              <img
                src="/google.svg"
                alt="Google"
                className="h-5 w-5"
              />
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
