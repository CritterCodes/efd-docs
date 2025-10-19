// 🚨🚨🚨 [DOCS MIDDLEWARE] FILE LOADED AT STARTUP!
console.log('🚨🚨🚨 [DOCS MIDDLEWARE] FILE LOADED AT STARTUP!')

import { NextResponse } from 'next/server'

// 🔥 [DOCS MIDDLEWARE] Middleware is being executed!
console.log('� [DOCS MIDDLEWARE] Middleware is being executed!')

export async function middleware(request) {
  console.log('� [DOCS MIDDLEWARE] Request intercepted:', request.nextUrl.pathname)
  
  const { pathname } = request.nextUrl
    
    console.log('🔍 [DOCS MIDDLEWARE] Processing request to:', pathname);
    console.log('🔍 [DOCS MIDDLEWARE] Request URL:', request.url);
    
    // Skip middleware for public routes
    const publicRoutes = ['/', '/auth/signin', '/auth/error', '/api/auth'];
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        console.log('🔍 [DOCS MIDDLEWARE] Public route, skipping auth check');
        return NextResponse.next();
    }
    
    // Check for session from admin app
    const adminSessionCookie = request.cookies.get('next-auth.session-token');
    console.log('🔍 [DOCS MIDDLEWARE] Admin session cookie:', adminSessionCookie ? 'EXISTS' : 'NOT_FOUND');
    console.log('🔍 [DOCS MIDDLEWARE] Cookie value preview:', adminSessionCookie?.value?.substring(0, 20) + '...');
    
    if (!adminSessionCookie) {
        // No session found, redirect to admin for authentication
        const adminAuthUrl = `${process.env.NEXT_PUBLIC_ADMIN_URL}/auth/signin?callbackUrl=${encodeURIComponent(request.url)}`;
        console.log('🔍 [DOCS MIDDLEWARE] No session cookie, redirecting to:', adminAuthUrl);
        return NextResponse.redirect(adminAuthUrl);
    }
    
    // Validate session with admin app
    try {
        const sessionValidationUrl = `${process.env.NEXT_PUBLIC_ADMIN_URL}/api/auth/session`;
        console.log('🔍 [DOCS MIDDLEWARE] Validating session with:', sessionValidationUrl);
        
        const response = await fetch(sessionValidationUrl, {
            headers: {
                'Cookie': `next-auth.session-token=${adminSessionCookie.value}`
            }
        });
        
        console.log('🔍 [DOCS MIDDLEWARE] Session validation response status:', response.status);
        
        if (!response.ok) {
            // Invalid session, redirect to admin
            const adminAuthUrl = `${process.env.NEXT_PUBLIC_ADMIN_URL}/auth/signin?callbackUrl=${encodeURIComponent(request.url)}`;
            console.log('🔍 [DOCS MIDDLEWARE] Session validation failed, redirecting to:', adminAuthUrl);
            return NextResponse.redirect(adminAuthUrl);
        }
        
        const session = await response.json();
        console.log('🔍 [DOCS MIDDLEWARE] Session validation successful:', session.user?.email, 'Role:', session.user?.role);
        
        // Check if user has permission to access docs
        if (!['admin', 'artisan', 'wholesaler'].includes(session.user?.role)) {
            console.log('🔍 [DOCS MIDDLEWARE] User role not authorized for docs:', session.user?.role);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_ADMIN_URL}/unauthorized`);
        }
        
        // Add session info to request headers for pages to use
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-session', JSON.stringify(session));
        
        console.log('🔍 [DOCS MIDDLEWARE] Access granted, proceeding to page');
        
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
        
    } catch (error) {
        console.error('🔍 [DOCS MIDDLEWARE] Error validating session:', error);
        // Fallback to admin auth
        const adminAuthUrl = `${process.env.NEXT_PUBLIC_ADMIN_URL}/auth/signin?callbackUrl=${encodeURIComponent(request.url)}`;
        console.log('🔍 [DOCS MIDDLEWARE] Session validation error, redirecting to:', adminAuthUrl);
        return NextResponse.redirect(adminAuthUrl);
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
    ],
};