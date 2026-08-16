import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// 1. Define your protected routes
const protectedRoutes = ['/researcher', '/coprogrammer', '/Image-generation']

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // 2. Check if the current request path matches any protected route or its sub-paths
  const isProtectedRoute = protectedRoutes.some((route) => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

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
            const isSecure = request.headers.get('x-forwarded-proto') === 'https' || 
                            request.nextUrl.protocol === 'https:'
            
            response.cookies.set(name, value, {
              ...options,
              ...(isSecure 
                ? { sameSite: 'none', secure: true }  // HTTPS: strict cross-site cookies
                : { sameSite: 'lax' }                 // HTTP (dev): basic protection
              ),
            })
          })
        },
      },
    }
  )

  try {
    // 3. Get the current user 
    const {
      data: { user },
    } = await supabase.auth.getUser() 

    // 4. ONLY redirect to /auth if the route is protected AND there is no session
    if (isProtectedRoute && !user) {
      const authUrl = new URL('/auth', request.url)
      // Optional: Pass the original path as a query parameter to redirect back after login
      authUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(authUrl)
    }
  } catch (error) {
    console.error('Middleware auth error:', error?.message)
    // If there's an error and they are trying to access a protected route, block them
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  return response
}

// 5. Update the matcher to run on all protected routes and their sub-paths
export const config = {
  matcher: [
    '/researcher/:path*',
    '/coprogrammer/:path*',
    '/Image-generation/:path*',
  ],
}