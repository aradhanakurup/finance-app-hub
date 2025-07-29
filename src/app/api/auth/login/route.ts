import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CustomError, errorHandler, AppError } from '@/middleware/errorHandler';
import { securityMiddleware } from '@/middleware/security';

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Apply security middleware
    const securityResponse = await securityMiddleware(req);
    if (securityResponse.status !== 200) {
      return securityResponse;
    }

    const body = await req.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new CustomError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new CustomError('Account is deactivated. Please contact support.', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      throw new CustomError('Invalid email or password', 401);
    }

    // Check if email is verified (optional for now)
    // if (!user.isEmailVerified) {
    //   throw new CustomError('Please verify your email address before logging in', 401);
    // }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: 'customer',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (validatedData.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60), // 30 days or 1 day
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'your-jwt-secret',
      { algorithm: 'HS256' }
    );

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_LOGIN',
        entityType: 'USER',
        entityId: user.id,
        oldValues: JSON.stringify({ lastLoginAt: user.lastLoginAt }),
        newValues: JSON.stringify({ lastLoginAt: new Date() }),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        userAgent: req.headers.get('user-agent'),
      },
    });

    // Set secure cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
        profile: user.profile,
      },
    });

    // Set cookie with appropriate settings
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: validatedData.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day
      path: '/',
    };

    response.cookies.set('auth_token', token, cookieOptions);

    return response;

  } catch (error) {
    return errorHandler(error as AppError, req);
  }
} 