'use client'
import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LoginForm({ onModeChange }) {
  const [user, setUser] = useState({ email: '', password: '' })
  const [isPending,setIspending] = useState(false)
  const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClient()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIspending(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    })
    setIspending(false)
    if (!error) {
      router.push('/researcher')
    } else {
      console.error('Login failed:', error.message)
      let userError = 'Login failed. Please try again.'
      if (error.message?.includes('Invalid login credentials')) {
        userError = 'Email or password is incorrect. Please try again.'
      } else if (error.message?.includes('Email not confirmed')) {
        userError = 'Please verify your email before logging in. Check your inbox for the verification link.'
      } else if (error.message?.includes('over_request_rate_limit')) {
        userError = 'Too many login attempts. Please wait a few moments and try again.'
      }
      setError(userError)
    }
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-5">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-[11px] sm:text-[12px]">
          {error}
        </div>
      )}
      <Input 
        label="Email Address" 
        type="email" 
        placeholder="user@domain.com"
        value={user.email}
        onChange={(e) => setUser({...user, email: e.target.value})}
      />
      <Input 
        label="Password" 
        type="password" 
        placeholder="••••••••••••"
        value={user.password}
        onChange={(e) => setUser({...user, password: e.target.value})}
      />

      <Button type="submit" variant="primary" disabled={isPending}  size="lg" className="w-full mt-2">
       {isPending ? 'Authenticating....' : 'Authenticate →' } 
      </Button>

      <Divider label="or" className="my-6" />

      <Button variant="secondary" size="md" className="w-full">
        Continue with Google
      </Button>

      <p className="text-center text-xs sm:text-sm mt-4">
        Don't have an account?{' '}
        <button
          onClick={() => onModeChange('register')}
          className="font-bold text-black hover:underline">
          Register
        </button>
      </p>
    </form>
  )
}