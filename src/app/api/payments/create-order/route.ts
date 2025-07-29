import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { PAYMENT_CONFIG, calculatePaymentBreakdown } from '@/config/payments';

const razorpay = new Razorpay({
  key_id: PAYMENT_CONFIG.razorpay.keyId,
  key_secret: PAYMENT_CONFIG.razorpay.keySecret,
});

export async function POST(req: NextRequest) {
  try {
    const { planType, dealerData } = await req.json();

    // Validate plan type
    const plan = PAYMENT_CONFIG.dealerRegistration[planType as keyof typeof PAYMENT_CONFIG.dealerRegistration];
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    // Calculate payment breakdown
    const paymentBreakdown = calculatePaymentBreakdown(plan.price);

    // Create Razorpay order
    const orderData = {
      amount: paymentBreakdown.totalAmount * 100, // Razorpay expects amount in paise
      currency: PAYMENT_CONFIG.razorpay.currency,
      receipt: `dealer_reg_${Date.now()}`,
      notes: {
        planType,
        dealerEmail: dealerData.email,
        businessName: dealerData.businessName,
      },
      prefill: {
        name: dealerData.ownerName,
        email: dealerData.email,
        contact: dealerData.phone,
      },
    };

    const order = await razorpay.orders.create(orderData);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planDetails: {
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        features: plan.features,
      },
      paymentBreakdown,
      keyId: PAYMENT_CONFIG.razorpay.keyId,
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
} 