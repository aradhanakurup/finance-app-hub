import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { asyncHandler, CustomError } from '@/middleware/errorHandler';
import { securityMiddleware } from '@/middleware/security';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

async function submitContactForm(req: NextRequest) {
  // Apply security middleware
  const securityResponse = await securityMiddleware(req);
  if (securityResponse.status !== 200) {
    return securityResponse;
  }

  const body = await req.json();
  
  // Validate input
  const validatedData = contactSchema.parse(body);

  // In production, you would:
  // 1. Save to database
  // 2. Send email notification
  // 3. Create support ticket
  // 4. Send auto-reply to customer

  // For now, we'll just log the contact form
  console.log('Contact form submitted:', {
    ...validatedData,
    timestamp: new Date().toISOString(),
    ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
  });

  // Create audit log
  // await prisma.auditLog.create({
  //   data: {
  //     action: 'SUPPORT_CONTACT',
  //     entityType: 'CONTACT_FORM',
  //     entityId: 'contact-form',
  //     newValues: validatedData,
  //     ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
  //     userAgent: req.headers.get('user-agent'),
  //   },
  // });

  return NextResponse.json({
    success: true,
    message: 'Your message has been submitted successfully. We will get back to you within 24 hours.',
  });
}

export const POST = asyncHandler(submitContactForm); 