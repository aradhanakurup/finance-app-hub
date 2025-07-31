import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Authentication middleware
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Allow access to admin login page and login API
    if (pathname === '/admin/login' || pathname === '/api/admin/auth/login') {
      return NextResponse.next();
    }
    
    // Check for admin authentication
    const adminToken = request.cookies.get('admin_token')?.value;
    const authHeader = request.headers.get('authorization');
    
    let isAuthenticated = false;
    
    if (adminToken) {
      try {
        // For now, just check if the token exists and has the right format
        // In production, you should validate the JWT signature
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        if (isDevelopment) {
          // In development, accept any JWT token that looks valid
          isAuthenticated = adminToken.split('.').length === 3;
        } else {
          // In production, validate the JWT token properly
          // This would require proper JWT verification
          isAuthenticated = true; // Placeholder for production JWT validation
        }
      } catch (error) {
        isAuthenticated = false;
      }
    }

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