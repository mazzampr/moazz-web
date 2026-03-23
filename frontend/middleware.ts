import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    const adminSecret = request.cookies.get('ADMIN_SECRET')?.value;
    const expectedSecret = process.env.ADMIN_SECRET || 'super-secret-admin-key';

    if (adminSecret !== expectedSecret) {
      // Return 404 page to hide the admin panel from unauthenticated users
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  // Redirect /admin to /admin/dashboard
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
