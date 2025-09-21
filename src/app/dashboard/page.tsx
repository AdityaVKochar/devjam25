"use client"
import dynamic from 'next/dynamic'
import React from 'react'

const NewUserDashboard = dynamic(() => import('../../components/newuserdashboard').then(m => m.default), { ssr: false })

export default function DashboardPage() {
  return (
    <main>
      <NewUserDashboard />
    </main>
  )
}
