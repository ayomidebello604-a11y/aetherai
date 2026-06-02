'use client'
import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Mail, X } from 'lucide-react'

export default function RegisterForm({ onModeChange }) {
  const [user, setUser] = useState({ name: '', email: '', password: '' })
  const [verificationSent, setVerificationSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          full_name: user.name,
        }
      }
    })
    setLoading(false)
    if (!error) {
      setVerificationSent(true)
    }
  }
 
  return (
    <>
      <form onSubmit={handleRegister} className="flex flex-col gap-5">
        <Input 
          label="Username" 
          value={user.name} 
          onChange={(e) => setUser({ ...user, name: e.target.value })} 
          type="text" 
          placeholder="SAGANIGGGGADIIIK" 
          disabled={verificationSent}
        />
        <Input 
          label="Email Address" 
          value={user.email} 
          onChange={(e) => setUser({ ...user, email: e.target.value })} 
          type="email" 
          placeholder="user@domain.com"
          disabled={verificationSent}
        />
        <Input 
          label="Password" 
          value={user.password} 
          onChange={(e) => setUser({ ...user, password: e.target.value })} 
          type="password" 
          placeholder="••••••••••••"
          disabled={verificationSent}
        />

        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className="w-full mt-2"
          disabled={verificationSent || loading}
        >
          {loading ? 'Creating Account...' : 'Create Account →'}
        </Button>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <button
            onClick={() => onModeChange('login')}
            className="font-bold text-black hover:underline"
            disabled={verificationSent}
          >
            Login
          </button>
        </p>
      </form>

      {/* Verification Modal */}
      {verificationSent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-black max-w-md w-full mx-4 p-8 relative">
            <button
              onClick={() => setVerificationSent(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-3 bg-gray-100 rounded-full">
                <Mail size={32} className="text-black" />
              </div>

              <h3 className="text-lg font-black tracking-tight mb-3">
                Verify Your Email
              </h3>

              <p className="text-sm opacity-60 mb-6 leading-relaxed">
                We've sent a verification link to <span className="font-bold text-black">{user.email}</span>. 
                Please check your inbox and click the link to activate your account.
              </p>

              <div className="w-full bg-gray-50 border border-gray-200 rounded p-4 mb-6 text-xs opacity-50">
                <p>If you don't see the email, check your spam folder.</p>
              </div>

              <Button
                onClick={() => setVerificationSent(false)}
                variant="primary"
                size="md"
                className="w-full"
              >
                Got It
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}