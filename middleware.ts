import { auth } from './auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/(dashboard)')) {
    if (!req.auth) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
