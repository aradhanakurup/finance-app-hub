import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = loginSchema.parse(body);

    // In production, validate against database
    // For now, use environment variables for admin credentials
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    
    // For development, allow simple password check
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    let isValid = false;
    
    if (isDevelopment) {
      // Development mode - simple check
      isValid = username === adminUsername && password === (process.env.ADMIN_PASSWORD || 'admin123');
    } else {
      // Production mode - hash comparison
      if (adminPasswordHash) {
        isValid = username === adminUsername && await bcrypt.compare(password, adminPasswordHash);
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        username, 
        role: 'admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
      },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { algorithm: 'HS256' }
    );

    // Set secure cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: { username, role: 'admin' }
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 