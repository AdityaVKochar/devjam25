import React from 'react'
import Threads from './Threads'
import Link from 'next/link'

export default function Hero(): React.ReactElement {
	return (
			<header
				style={{
					position: 'relative',
					height: '100vh',
					overflow: 'hidden',
					background: '#000',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center'
				}}
				aria-label="Hero"
			>
			{/* Background thread visual (pointerEvents none so it doesn't block clicks) */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					pointerEvents: 'none',
					zIndex: 1
				}}
			>
				<Threads />
			</div>

			{/* Top nav: brand left, sign in right (fixed at top) */}
			<nav
				style={{
					position: 'absolute',
					top: 16,
					left: 24,
					right: 24,
					zIndex: 6,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}
			>
				<div style={{color: 'white', fontWeight: 600, fontSize: 18}}>brandname</div>
			</nav>

			{/* Center content */}
					<div
						style={{
							position: 'relative',
							zIndex: 5,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							textAlign: 'center',
							padding: '40px 24px',
							width: '100%'
						}}
					>
				<h1
					style={{
						color: 'white',
						fontSize: 'clamp(32px, 6vw, 64px)',
						lineHeight: 1.02,
						margin: 0,
						fontWeight: 800,
						letterSpacing: '-1px'
					}}
				>
					tagline goes hereeeeeeeeee
				</h1>
				<p style={{color: 'rgba(255,255,255,0.75)', marginTop: 16, fontSize: 16}}>
					some stupid text goes here okay? got it - cool
				</p>

						<Link
							href="/signin"
							style={{
								marginTop: 28,
								display: 'inline-block',
								padding: '14px 30px',
								borderRadius: 14,
								color: 'white',
								fontWeight: 700,
								textDecoration: 'none',
								background: 'linear-gradient(90deg,#5b8cff 0%, #39f3e6 100%)',
								boxShadow: '0 8px 30px rgba(59,130,246,0.28)'
							}}
						>
							LISTEN NOW →
						</Link>
			</div>
		</header>
	)
}

