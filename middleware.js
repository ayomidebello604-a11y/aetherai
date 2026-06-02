import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // ✅ Fix: set on both request and response so cookies propagate correctly
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            // Ensure cookies work across networks by setting SameSite=None
            response.cookies.set(name, value, {
              ...options,
              sameSite: 'none',
              secure: true,
            })
          })
        },
      },
    }
  )

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession() // ✅ no network call, reads from cookie

    if (!session) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  } catch (error) {
    console.error('Middleware auth error:', error?.message)
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return response
}

export const config = {
  matcher: ['/researcher/:path*'],
}