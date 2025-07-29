import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Authentication middleware
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Check for admin authentication
    const adminToken = request.cookies.get('admin_token')?.value;
    const authHeader = request.headers.get('authorization');
    
    // In development, allow access with a simple token
    // In production, implement proper JWT validation
    const isDevelopment = process.env.NODE_ENV === 'development';
    const validToken = isDevelopment ? 'dev-admin-token' : process.env.ADMIN_SECRET_TOKEN;
    
    const isAuthenticated = adminToken === validToken || 
                           authHeader === `Bearer ${validToken}`;

    if (!isAuthenticated) {
      // Redirect to admin login page (but not if already on login page)
      if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
      // Return 401 for API routes
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin access required' },
          { status: 401 }
        );
      }
    }
  }

  // Protect customer routes that require authentication
  const protectedCustomerRoutes = [
    '/dashboard',
    '/profile',
    '/applications',
    '/documents',
  ];

  const isProtectedCustomerRoute = protectedCustomerRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedCustomerRoute) {
    // Check for customer authentication
    const authToken = request.cookies.get('auth_token')?.value;
    
    if (!authToken) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // TODO: Validate JWT token here
    // For now, just check if token exists
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/applications/:path*',
    '/documents/:path*',
  ],
}; 