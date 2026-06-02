'use client'
import React, { useState } from 'react'
import AuthLeftPanel from './AuthLeftPanel'
import AuthForm from './AuthForm'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <AuthLeftPanel />
      <AuthForm mode={mode} onModeChange={setMode} />
    </div>
  )
}
