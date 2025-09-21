"use client"
import dynamic from 'next/dynamic'
import React from 'react'

const SignIn = dynamic(() => import('../../components/signin').then(m => m.default), { ssr: false })

export default function SignInPage() {
  return (
    <main>
      <SignIn />
    </main>
  )
}
