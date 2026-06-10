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
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const validatePassword = (pwd) => {
    if (pwd.length === 0) {
      setPasswordError('')
      return true
    }
    if (pwd.length < 6) {
      setPasswordError('Password must be at least 6 characters long.')
      return false
    }
    setPasswordError('')
    return true
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setUser({...user, password: newPassword})
    validatePassword(newPassword)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate password before submitting
    if (!validatePassword(user.password)) {
      setError('Please fix the password requirements before registering.')
      return
    }

    // Validate all fields
    if (!user.name.trim()) {
      setError('Please enter a username.')
      return
    }
    if (!user.email.trim()) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          full_name: user.name,
        }
      }
    })
    setLoading(false)
    
    // Check if registration succeeded (Supabase returns data object even if email confirmation pending)
    if (data && !error) {
      // Success: user was created (even if email confirmation is required)
      console.log('Registration successful, verification email sent')
      setVerificationSent(true)
      return
    }
    
    // Check for specific errors
    if (error) {
      console.error('Registration failed:', error.message)
      let userError = 'Registration failed. Please try again.'
      
      // Check various error patterns from Supabase
      const errorMsg = error.message?.toLowerCase() || ''
      if (errorMsg.includes('already registered') || errorMsg.includes('already exist') || errorMsg.includes('user already')) {
        userError = 'This email is already registered. Try logging in or use a different email.'
      } else if (errorMsg.includes('password') || errorMsg.includes('password too') || errorMsg.includes('atleast')) {
        userError = 'Password must be at least 6 characters long and contain uppercase, lowercase, numbers, and special characters.'
      } else if (errorMsg.includes('invalid') || errorMsg.includes('email')) {
        userError = 'Please enter a valid email address.'
      } else if (errorMsg.includes('weak')) {
        userError = 'Your password is too weak. Use a mix of uppercase, lowercase, numbers, and special characters.'
      }
      
      setError(userError)
    } else {
      // Fallback - shouldn't reach here
      setError('Registration failed. Please try again.')
    }
  }
 
  return (
    <>
      <form onSubmit={handleRegister} className="flex flex-col gap-5">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-[12px]">
            {error}
          </div>
        )}
        <Input 
          label="Username" 
          value={user.name} 
          onChange={(e) => setUser({ ...user, name: e.target.value })} 
          type="text" 
          placeholder="Choose your username" 
          disabled={verificationSent}
        />
        <Input 
          label="Email Address" 
          value={user.email} 
          onChange={(e) => setUser({ ...user, email: e.target.value })} 
          type="email" 
          placeholder="user@domain.com"
          disabled={verificationSent}
          required
        />
        <div>
          <Input 
            label="Password" 
            value={user.password} 
            onChange={handlePasswordChange}
            type="password" 
            placeholder="••••••••••••"
            disabled={verificationSent}
            error={passwordError}
          />
          {passwordError && (
            <p className="text-red-600 text-[11px] mt-2">{passwordError}</p>
          )}
          {user.password && !passwordError && (
            <p className="text-green-600 text-[11px] mt-2">✓ Password is valid</p>
          )}
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className="w-full mt-2"
          disabled={verificationSent || loading || !user.name || !user.email || !user.password}
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