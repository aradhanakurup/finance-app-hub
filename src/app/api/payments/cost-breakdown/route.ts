import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/services/paymentService';

export async function POST(request: NextRequest) {
  try {
    console.log('Payment cost breakdown API called');
    
    const body = await request.json();
    console.log('Request body received:', JSON.stringify(body, null, 2));
    
    const { applicationData, selectedInsurance } = body;

    if (!applicationData) {
      console.log('No application data provided');
      return NextResponse.json(
        { error: 'Application data is required' },
        { status: 400 }
      );
    }

    console.log('Calculating cost breakdown...');
    
    // Calculate total cost breakdown
    const costBreakdown = await paymentService.calculateTotalCost(applicationData, selectedInsurance);
    console.log('Cost breakdown calculated:', costBreakdown);

    // Get real-time insurance quotes if no insurance is selected
    let insuranceQuotes: any[] = [];
    if (!selectedInsurance) {
      console.log('Getting insurance quotes...');
      insuranceQuotes = await paymentService.getInsuranceQuotesWithPricing(applicationData);
      console.log('Insurance quotes received:', insuranceQuotes.length);
    }

    const response = {
      success: true,
      data: {
        costBreakdown,
        insuranceQuotes,
        timestamp: new Date().toISOString(),
      },
    };

    console.log('Sending response:', JSON.stringify(response, null, 2));
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error calculating cost breakdown:', error);
    return NextResponse.json(
      { error: 'Failed to calculate cost breakdown', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 