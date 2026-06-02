'use client'
import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LoginForm({ onModeChange }) {
    const [user,setUser] = useState({email: '',password:''})
    const router = useRouter()
    const supabase = createClient()

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    })
    if (!error) {
      router.push('/researcher')
    } else {
      console.error('Login failed:', error.message)
    }
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-5">
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

      <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
        Authenticate →
      </Button>

      <Divider label="or" className="my-6" />

      <Button variant="secondary" size="md" className="w-full">
        Continue with Google
      </Button>

      <p className="text-center text-sm mt-4">
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