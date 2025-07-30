import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { z } from 'zod';
import { CustomError, errorHandler, AppError } from '@/middleware/errorHandler';

const prisma = new PrismaClient();

const approvalSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  reason: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const validatedData = approvalSchema.parse(body);

    // Check if dealer exists
    const dealer = await prisma.dealer.findUnique({
      where: { id },
    });

    if (!dealer) {
      throw new CustomError('Dealer not found', 404);
    }

    if (dealer.isApproved) {
      throw new CustomError('Dealer is already approved', 400);
    }

    // Update dealer status
    const updatedDealer = await prisma.dealer.update({
      where: { id },
      data: {
        isApproved: validatedData.status === 'APPROVED',
        isActive: validatedData.status === 'APPROVED',
        approvedBy: 'admin', // In production, get from auth context
        approvedAt: validatedData.status === 'APPROVED' ? new Date() : null,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: `DEALER_${validatedData.status}`,
        entityType: 'DEALER',
        entityId: id,
        oldValues: JSON.stringify(dealer),
        newValues: JSON.stringify(updatedDealer),
        userId: 'admin', // In production, get from auth context
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        userAgent: req.headers.get('user-agent'),
      },
    });

    // Send email notification
    // await sendDealerApprovalEmail(dealer.email, dealer.businessName, validatedData.status, validatedData.reason);

    return NextResponse.json({
      success: true,
      message: `Dealer ${validatedData.status.toLowerCase()} successfully`,
      dealer: updatedDealer,
    });
  } catch (error) {
    return errorHandler(error as AppError, req);
  }
} 