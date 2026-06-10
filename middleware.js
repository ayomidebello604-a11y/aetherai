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

          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            // Determine if connection is secure (HTTPS) or not
            const isSecure = request.headers.get('x-forwarded-proto') === 'https' || 
                            request.nextUrl.protocol === 'https:'
            
            // Set appropriate cookie options based on connection type
            response.cookies.set(name, value, {
              ...options,
              ...(isSecure 
                ? { sameSite: 'none', secure: true }  // HTTPS: strict cross-site cookies
                : { sameSite: 'lax' }                   // HTTP (dev): basic protection
              ),
            })
          })
        },
      },
    }
  )

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession() 

    if (!session) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  } catch (error) {
    console.error('Middleware auth error:', error?.message)
    // Still redirect to auth on error - session check failed, user not authenticated
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return response
}

export const config = {
  matcher: ['/researcher/:path*'],
}