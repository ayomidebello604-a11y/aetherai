import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/researcher'

  if (code) {
    const supabase = await createClient()
    
    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error.message)
        // Redirect to login if there's an error
        return NextResponse.redirect(new URL('/auth?error=verification_failed', request.url))
      }

      // Email verified successfully - redirect to the next page or researcher
      return NextResponse.redirect(new URL(next, request.url))
    } catch (err) {
      console.error('Unexpected callback error:', err)
      return NextResponse.redirect(new URL('/auth?error=unexpected', request.url))
    }
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL('/auth', request.url))
}
