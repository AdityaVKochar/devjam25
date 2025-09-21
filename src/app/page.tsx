"use client";
import dynamic from "next/dynamic";
import React from "react";

const Hero = dynamic(() => import('../components/hero').then(m => m.default), { ssr: false });

export default function Page() {
  return (
    <main>
      <Hero />
    </main>
  );
}
