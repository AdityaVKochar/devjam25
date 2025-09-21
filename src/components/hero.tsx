import React from 'react'
import Threads from './Threads'
import Link from 'next/link'

export default function Hero(): React.ReactElement {
	return (
			<header className="relative h-screen overflow-hidden bg-black flex flex-col items-center justify-center" aria-label="Hero">
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
					<Threads distance={0} amplitude={2} />
				</div>

				<nav className="absolute top-4 left-6 right-6 z-[6] flex justify-between items-center">
					<div className="text-white font-semibold text-lg">EchoTales</div>
				</nav>

				<div className="relative z-[5] flex flex-col items-center justify-center text-center px-6 py-10 w-full">
					<h1 className="text-white font-extrabold tracking-tight" style={{ fontSize: 'clamp(25px, 6vw, 64px)', lineHeight: 1.02, letterSpacing: '-1px', margin: 0 }}>
						Turning stories into
					</h1>
					<h1 className="text-white font-extrabold tracking-tight" style={{ fontSize: 'clamp(25px, 6vw, 64px)', lineHeight: 1.02, letterSpacing: '-1px', margin: 0 }}>
						cinematic soundscapes
					</h1>
					<Link href="/signin" className="mt-7 inline-block px-8 py-[14px] rounded-[14px] text-white font-bold no-underline shadow-lg" style={{ background: 'linear-gradient(90deg,#5b8cff 0%, #39f3e6 100%)', boxShadow: '0 8px 30px rgba(59,130,246,0.28)' }}>
						LISTEN NOW →
					</Link>
				</div>
			</header>
	)
}

