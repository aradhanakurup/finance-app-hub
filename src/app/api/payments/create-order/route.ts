import { NextRequest, NextResponse } from 'next/server';
import { paymentService, type PaymentRequest } from '@/services/paymentService';

export async function POST(request: NextRequest) {
  try {
    console.log('Payment create order API called');
    
    const body = await request.json();
    console.log('Request body received:', JSON.stringify(body, null, 2));
    
    const { applicationData, selectedInsurance, customerInfo } = body;

    if (!applicationData || !customerInfo) {
      console.log('Missing required data:', { hasApplicationData: !!applicationData, hasCustomerInfo: !!customerInfo });
      return NextResponse.json(
        { error: 'Application data and customer info are required' },
        { status: 400 }
      );
    }

    // Calculate total cost breakdown
    const costBreakdown = await paymentService.calculateTotalCost(applicationData, selectedInsurance);

    // Prepare payment items
    const paymentItems: any[] = [];

    // Add loan application fee
    paymentItems.push({
      type: 'loan_application',
      description: 'Loan Application Processing Fee',
      amount: costBreakdown.breakdown.applicationFee,
      quantity: 1,
      total: costBreakdown.breakdown.applicationFee,
      metadata: {
        applicationId: applicationData.id || `APP-${Date.now()}`,
        features: applicationData.premiumFeatures || {},
      },
    });

    // Add insurance premium if selected
    if (selectedInsurance) {
      paymentItems.push({
        type: 'insurance_premium',
        description: `${selectedInsurance.providerName} - ${selectedInsurance.coverageType.replace('_', ' ').toUpperCase()}`,
        amount: costBreakdown.breakdown.insuranceCost,
        quantity: 1,
        total: costBreakdown.breakdown.insuranceCost,
        metadata: {
          providerId: selectedInsurance.providerId,
          coverageType: selectedInsurance.coverageType,
          riskProfile: {
            creditScore: applicationData.prescreening?.creditScore || 650,
            employmentType: applicationData.employment?.employmentType || 'salaried',
            monthlyIncome: applicationData.income?.monthlyIncome || 50000,
            loanAmount: applicationData.vehicle?.loanAmount || 500000,
            loanTenure: applicationData.vehicle?.tenure || 60,
            vehicleType: applicationData.vehicle?.make || 'sedan',
            age: applicationData.personalInfo?.age || 30,
            healthStatus: 'good',
            occupation: applicationData.employment?.designation || 'employee',
            experience: applicationData.employment?.experience || 3,
            existingEmis: applicationData.expenses?.existingEmis || 0,
            customerId: customerInfo.email || '',
          },
        },
      });
    }

    // Create payment request
    const paymentRequest: PaymentRequest = {
      customerId: customerInfo.email || `CUST-${Date.now()}`,
      applicationId: applicationData.id || `APP-${Date.now()}`,
      items: paymentItems,
      totalAmount: costBreakdown.breakdown.total,
      currency: costBreakdown.currency,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
    };

    console.log('Creating payment order...');
    
    // Create payment order
    const paymentResponse = await paymentService.createPaymentOrder(paymentRequest);
    console.log('Payment order created:', paymentResponse);

    const response = {
      success: true,
      data: {
        payment: paymentResponse,
        costBreakdown,
        paymentItems,
        timestamp: new Date().toISOString(),
      },
    };

    console.log('Sending response:', JSON.stringify(response, null, 2));
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 