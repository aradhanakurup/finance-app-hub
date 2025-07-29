import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

interface LenderRegistrationRequest {
  // Basic Information
  businessName: string;
  legalName: string;
  registrationNumber: string;
  gstNumber: string;
  panNumber: string;
  
  // Contact Information
  email: string;
  phone: string;
  website: string;
  
  // Address
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  
  // Business Details
  businessType: 'BANK' | 'NBFC' | 'FINANCIAL_INSTITUTION';
  establishedYear: number;
  employeeCount: number;
  
  // Financial Information
  annualTurnover: number;
  netWorth: number;
  
  // Commission Structure
  commissionRates: {
    car: number;
    bike: number;
    commercial: number;
  };
  
  // API Integration
  apiEndpoint: string;
  webhookUrl: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LenderRegistrationRequest = await request.json();
    const {
      businessName,
      legalName,
      registrationNumber,
      gstNumber,
      panNumber,
      email,
      phone,
      website,
      address,
      businessType,
      establishedYear,
      employeeCount,
      annualTurnover,
      netWorth,
      commissionRates,
      apiEndpoint,
      webhookUrl,
    } = body;

    // Validate required fields
    if (!businessName || !legalName || !registrationNumber || !gstNumber || !panNumber || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Check if lender already exists
    const existingLender = await prisma.lender.findFirst({
      where: {
        OR: [
          { name: businessName },
          { apiEndpoint: apiEndpoint },
        ],
      },
    });

    if (existingLender) {
      return NextResponse.json(
        {
          success: false,
          message: 'Lender with this business name or API endpoint already exists',
        },
        { status: 409 }
      );
    }

    // Create lender record
    const lender = await prisma.lender.create({
      data: {
        name: businessName,
        logo: '', // Will be updated later
        apiEndpoint: apiEndpoint,
        apiKey: `lender_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isActive: false, // Will be activated after approval
        approvalRate: 0,
        avgResponseTime: 0,
        minCreditScore: 650, // Default values
        maxLoanAmount: 5000000,
        minLoanAmount: 50000,
        processingFee: 2000,
        commissionRate: (commissionRates.car + commissionRates.bike + commissionRates.commercial) / 3,
        supportedVehicleTypes: JSON.stringify(['CAR', 'BIKE', 'COMMERCIAL']),
        supportedEmploymentTypes: JSON.stringify(['SALARIED', 'SELF_EMPLOYED', 'BUSINESS']),
        webhookUrl: webhookUrl,
      },
    });

    // Create lender profile with additional details
    // Note: You might want to create a separate LenderProfile model for this
    const lenderProfile = {
      lenderId: lender.id,
      legalName,
      registrationNumber,
      gstNumber,
      panNumber,
      email,
      phone,
      website,
      address,
      businessType,
      establishedYear,
      employeeCount,
      annualTurnover,
      netWorth,
      commissionRates,
      status: 'PENDING_APPROVAL',
      createdAt: new Date(),
    };

    // In production, you would save this to a separate table
    console.log('Lender profile created:', lenderProfile);

    // Send notification email (in production)
    // await sendLenderRegistrationEmail(email, businessName);

    return NextResponse.json({
      success: true,
      data: {
        lenderId: lender.id,
        businessName: lender.name,
        status: 'PENDING_APPROVAL',
        message: 'Lender registration submitted successfully. Our team will review and contact you within 2-3 business days.',
      },
    });

  } catch (error) {
    console.error('Error registering lender:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to register lender',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return sample lender registration form structure
    return NextResponse.json({
      success: true,
      data: {
        businessTypes: ['BANK', 'NBFC', 'FINANCIAL_INSTITUTION'],
        requiredDocuments: [
          'Business License',
          'Compliance Certificate',
          'Board Resolution',
          'KYC Documents',
        ],
        commissionRanges: {
          car: { min: 0.5, max: 3.0, default: 1.5 },
          bike: { min: 0.8, max: 4.0, default: 2.0 },
          commercial: { min: 0.6, max: 3.5, default: 1.8 },
        },
      },
    });
  } catch (error) {
    console.error('Error getting lender registration info:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get registration information',
      },
      { status: 500 }
    );
  }
} 