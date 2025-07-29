import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import jwt from 'jsonwebtoken';
import { CustomError, errorHandler, AppError } from '@/middleware/errorHandler';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get auth token from cookie
    const authToken = req.cookies.get('auth_token')?.value;

    if (!authToken) {
      throw new CustomError('Authentication required', 401);
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(authToken, process.env.JWT_SECRET || 'your-jwt-secret') as any;
    } catch (error) {
      throw new CustomError('Invalid or expired token', 401);
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    if (!user.isActive) {
      throw new CustomError('Account is deactivated', 401);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt,
        profile: user.profile,
      },
    });

  } catch (error) {
    return errorHandler(error as AppError, req);
  }
} 