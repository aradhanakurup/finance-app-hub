import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { CustomError, errorHandler, AppError } from '@/middleware/errorHandler';
import { securityMiddleware } from '@/middleware/security';

const prisma = new PrismaClient();

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new CustomError('User with this email already exists', 400);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    // Generate email verification token
    const emailVerificationToken = Math.random().toString(36).substring(2, 15) + 
                                  Math.random().toString(36).substring(2, 15);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        emailVerificationToken,
      },
    });

    // Create customer profile
    await prisma.customer.create({
      data: {
        userId: user.id,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_REGISTRATION',
        entityType: 'USER',
        entityId: user.id,
        newValues: JSON.stringify({ email: user.email, firstName: user.firstName, lastName: user.lastName }),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        userAgent: req.headers.get('user-agent'),
      },
    });

    // TODO: Send email verification
    // await sendEmailVerification(user.email, emailVerificationToken);

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

  } catch (error) {
    return errorHandler(error as AppError, req);
  }
} 