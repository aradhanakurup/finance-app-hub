import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/services/paymentService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, razorpayPaymentId, signature } = body;

    if (!paymentId || !razorpayPaymentId || !signature) {
      return NextResponse.json(
        { error: 'Payment ID, Razorpay payment ID, and signature are required' },
        { status: 400 }
      );
    }

    // Verify payment
    const isVerified = await paymentService.verifyPayment(paymentId, razorpayPaymentId, signature);

    if (!isVerified) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Get updated payment details
    const paymentDetails = await paymentService.getPaymentDetails(paymentId);

    return NextResponse.json({
      success: true,
      data: {
        payment: paymentDetails,
        message: 'Payment verified successfully',
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 