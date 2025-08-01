import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { z } from 'zod';
import { CustomError, errorHandler, AppError } from '@/middleware/errorHandler';
import { securityMiddleware } from '@/middleware/security';

const prisma = new PrismaClient();

const dealerRegistrationSchema = z.object({
  businessName: z.string().min(2),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
  registrationNumber: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  address: z.string().min(5),
  businessType: z.string().min(1),
  yearsInBusiness: z.number().min(0).max(100),
});

export async function POST(req: NextRequest, context: { params: Promise<Record<string, string>> }) {
  try {
    // Apply security middleware
    const securityResponse = await securityMiddleware(req);
    if (securityResponse.status !== 200) {
      return securityResponse;
    }

    const body = await req.json();
    
    // Validate input
    const validatedData = dealerRegistrationSchema.parse(body);

    // Check if dealer already exists
    const existingDealer = await prisma.dealer.findFirst({
      where: {
        OR: [
          { gstNumber: validatedData.gstNumber },
          { panNumber: validatedData.panNumber },
          { registrationNumber: validatedData.registrationNumber },
          { email: validatedData.email },
        ],
      },
    });

    if (existingDealer) {
      throw new CustomError('Dealer with this GST, PAN, registration number, or email already exists', 400);
    }

    // Create dealer
    const dealer = await prisma.dealer.create({
      data: {
        businessName: validatedData.businessName,
        gstNumber: validatedData.gstNumber,
        panNumber: validatedData.panNumber,
        registrationNumber: validatedData.registrationNumber,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
        businessType: validatedData.businessType,
        yearsInBusiness: validatedData.yearsInBusiness,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'DEALER_REGISTRATION',
        entityType: 'DEALER',
        entityId: dealer.id,
        newValues: JSON.stringify(dealer),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        userAgent: req.headers.get('user-agent'),
      },
    });

    // Send welcome email (implement email service)
    // await sendWelcomeEmail(dealer.email, dealer.businessName);

    return NextResponse.json({
      success: true,
      message: 'Dealer registration submitted successfully',
      dealerId: dealer.id,
    });
  } catch (error) {
    return errorHandler(error as AppError, req);
  }
} 