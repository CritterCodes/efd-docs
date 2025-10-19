import { NextResponse } from 'next/server';

console.log('🚨🚨🚨 [DOCS MIDDLEWARE] FILE LOADED AT STARTUP!');

export async function middleware(request) {
  console.log('🔥 [DOCS MIDDLEWARE] Request intercepted:', request.nextUrl.pathname);
  
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api');
  const isStatic = pathname.startsWith('/_next') || pathname.startsWith('/static');
  
  console.log('🔍 [DOCS MIDDLEWARE] Path check:', { pathname, isApi, isStatic });
  
  if (isApi || isStatic) {
    console.log('⏭️ [DOCS MIDDLEWARE] Skipping API/static path');
    return NextResponse.next();
  }

  try {
    console.log('🔒 [DOCS MIDDLEWARE] Checking session with admin...');
    
    // Get session from admin app
    const sessionResponse = await fetch('http://localhost:3001/api/auth/session', {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });
    
    console.log('📡 [DOCS MIDDLEWARE] Admin session response status:', sessionResponse.status);
    
    if (!sessionResponse.ok) {
      console.log('❌ [DOCS MIDDLEWARE] Failed to get session from admin');
      const redirectUrl = new URL(`http://localhost:3001/auth/signin?callbackUrl=${encodeURIComponent(request.url)}`);
      console.log('🔄 [DOCS MIDDLEWARE] Redirecting to admin login:', redirectUrl.toString());
      return NextResponse.redirect(redirectUrl);
    }

    const session = await sessionResponse.json();
    console.log('📋 [DOCS MIDDLEWARE] Session data:', session);
    
    if (!session?.user) {
      console.log('❌ [DOCS MIDDLEWARE] No valid session found');
      const redirectUrl = new URL(`http://localhost:3001/auth/signin?callbackUrl=${encodeURIComponent(request.url)}`);
      console.log('🔄 [DOCS MIDDLEWARE] Redirecting to admin login:', redirectUrl.toString());
      return NextResponse.redirect(redirectUrl);
    }

    console.log('✅ [DOCS MIDDLEWARE] Valid session found, allowing access');
    return NextResponse.next();
    
  } catch (error) {
    console.error('💥 [DOCS MIDDLEWARE] Error checking session:', error);
    const redirectUrl = new URL(`http://localhost:3001/auth/signin?callbackUrl=${encodeURIComponent(request.url)}`);
    console.log('🔄 [DOCS MIDDLEWARE] Error redirect to admin login:', redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

console.log('🏁 [DOCS MIDDLEWARE] Middleware setup complete!');
