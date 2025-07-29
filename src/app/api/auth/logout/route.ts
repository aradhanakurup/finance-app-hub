import { NextRequest, NextResponse } from 'next/server';
import { CustomError, errorHandler, AppError } from '@/middleware/errorHandler';

export async function POST(req: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    });

    // Clear auth token cookie
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return response;

  } catch (error) {
    return errorHandler(error as AppError, req);
  }
} 