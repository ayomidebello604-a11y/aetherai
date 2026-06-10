'use client'
import React from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function AuthForm({ mode, onModeChange }) {
  const isLogin = mode === 'login'

  return (
    <div className="bg-white flex flex-col justify-center min-h-screen px-6 sm:px-10 lg:px-16 py-10 sm:py-0 lg:p-16">

      <div className="max-w-md">
        <div className="flex border border-black mb-8 lg:mb-10">
          {['login', 'register'].map(m => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`flex-1 py-2 sm:py-3 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase
                          border-r border-black last:border-r-0 transition-all
                          ${mode === m ? 'bg-black text-white' : 'bg-white text-black'}`}>
              {m === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-1">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-sm opacity-50 mb-6 lg:mb-8">
          {isLogin
            ? 'Enter your credentials to access the system.'
            : 'Register to access all AETHER workspaces.'}
        </p>

        {isLogin ? <LoginForm onModeChange={onModeChange} /> : <RegisterForm onModeChange={onModeChange} />}
      </div>

    </div>
  )
}