import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { CustomError, errorHandler, AppError } from '@/middleware/errorHandler';

const prisma = new PrismaClient();

const profileUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'),
  aadhaar: z.string().regex(/^[0-9]{12}$/, 'Aadhaar must be 12 digits').optional().or(z.literal('')),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number').optional().or(z.literal('')),
  dateOfBirth: z.string().optional(),
  addressStreet: z.string().min(5, 'Address must be at least 5 characters').optional().or(z.literal('')),
  addressCity: z.string().min(2, 'City must be at least 2 characters').optional().or(z.literal('')),
  addressState: z.string().min(2, 'State must be at least 2 characters').optional().or(z.literal('')),
  addressPincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode').optional().or(z.literal('')),
  employmentType: z.enum(['SALARIED', 'SELF_EMPLOYED', 'BUSINESS_OWNER', 'FREELANCER', 'RETIRED', 'STUDENT']).optional(),
  companyName: z.string().min(2, 'Company name must be at least 2 characters').optional().or(z.literal('')),
  designation: z.string().min(2, 'Designation must be at least 2 characters').optional().or(z.literal('')),
  monthlyIncome: z.number().min(1000, 'Monthly income must be at least ₹1,000').optional(),
  experience: z.number().min(0, 'Experience cannot be negative').max(50, 'Experience cannot exceed 50 years').optional(),
  creditScore: z.number().min(300, 'Credit score must be at least 300').max(900, 'Credit score cannot exceed 900').optional(),
  existingEmis: z.number().min(0, 'Existing EMIs cannot be negative').optional(),
  bankName: z.string().min(2, 'Bank name must be at least 2 characters').optional().or(z.literal('')),
  accountNumber: z.string().min(10, 'Account number must be at least 10 digits').optional().or(z.literal('')),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code').optional().or(z.literal('')),
});

export async function PUT(req: NextRequest) {
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

    const body = await req.json();
    
    // Validate input
    const validatedData = profileUpdateSchema.parse(body);

    // Get current user data for audit log
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: true,
      },
    });

    if (!currentUser) {
      throw new CustomError('User not found', 404);
    }

    // Prepare update data
    const userUpdateData: any = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      phone: validatedData.phone,
    };

    const profileUpdateData: any = {};

    // Only include non-empty values in profile update
    if (validatedData.aadhaar !== undefined) profileUpdateData.aadhaar = validatedData.aadhaar || null;
    if (validatedData.pan !== undefined) profileUpdateData.pan = validatedData.pan || null;
    if (validatedData.dateOfBirth !== undefined) profileUpdateData.dateOfBirth = validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null;
    if (validatedData.addressStreet !== undefined) profileUpdateData.addressStreet = validatedData.addressStreet || null;
    if (validatedData.addressCity !== undefined) profileUpdateData.addressCity = validatedData.addressCity || null;
    if (validatedData.addressState !== undefined) profileUpdateData.addressState = validatedData.addressState || null;
    if (validatedData.addressPincode !== undefined) profileUpdateData.addressPincode = validatedData.addressPincode || null;
    if (validatedData.employmentType !== undefined) profileUpdateData.employmentType = validatedData.employmentType || null;
    if (validatedData.companyName !== undefined) profileUpdateData.companyName = validatedData.companyName || null;
    if (validatedData.designation !== undefined) profileUpdateData.designation = validatedData.designation || null;
    if (validatedData.monthlyIncome !== undefined) profileUpdateData.monthlyIncome = validatedData.monthlyIncome || null;
    if (validatedData.experience !== undefined) profileUpdateData.experience = validatedData.experience || null;
    if (validatedData.creditScore !== undefined) profileUpdateData.creditScore = validatedData.creditScore || null;
    if (validatedData.existingEmis !== undefined) profileUpdateData.existingEmis = validatedData.existingEmis || null;
    if (validatedData.bankName !== undefined) profileUpdateData.bankName = validatedData.bankName || null;
    if (validatedData.accountNumber !== undefined) profileUpdateData.accountNumber = validatedData.accountNumber || null;
    if (validatedData.ifscCode !== undefined) profileUpdateData.ifscCode = validatedData.ifscCode || null;

    // Update user and profile in a transaction
    const updatedUser = await prisma.$transaction(async (tx) => {
      // Update user
      const user = await tx.user.update({
        where: { id: decoded.userId },
        data: userUpdateData,
      });

      // Update or create profile
      const profile = await tx.customer.upsert({
        where: { userId: decoded.userId },
        update: profileUpdateData,
        create: {
          userId: decoded.userId,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: user.email,
          phone: validatedData.phone,
          ...profileUpdateData,
        },
      });

      return { user, profile };
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'PROFILE_UPDATED',
        entityType: 'USER',
        entityId: decoded.userId,
        oldValues: JSON.stringify({
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          phone: currentUser.phone,
          profile: currentUser.profile,
        }),
        newValues: JSON.stringify({
          firstName: updatedUser.user.firstName,
          lastName: updatedUser.user.lastName,
          phone: updatedUser.user.phone,
          profile: updatedUser.profile,
        }),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        userAgent: req.headers.get('user-agent'),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.user.id,
        email: updatedUser.user.email,
        firstName: updatedUser.user.firstName,
        lastName: updatedUser.user.lastName,
        phone: updatedUser.user.phone,
        isEmailVerified: updatedUser.user.isEmailVerified,
        profile: updatedUser.profile,
      },
    });

  } catch (error) {
    return errorHandler(error as AppError, req);
  }
} 