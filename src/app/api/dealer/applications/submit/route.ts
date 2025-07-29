import { NextRequest, NextResponse } from 'next/server';
import { lenderIntegrationService } from '../../../../../services/lenderIntegrationService';
import { CustomerData, VehicleData, FinancialData, DocumentData } from '../../../../../types/lender';

interface DealerApplicationData {
  quickReference: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    aadhaar: string;
    pan: string;
    dateOfBirth: string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
    };
  };
  employment: {
    employmentType: 'SALARIED' | 'SELF_EMPLOYED' | 'BUSINESS_OWNER';
    companyName: string;
    designation: string;
    monthlyIncome: number;
    experience: number;
  };
  expenses: {
    rent: number;
    utilities: number;
    food: number;
    transportation: number;
    healthcare: number;
    other: number;
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
    variant: string;
    price: number;
    downPayment: number;
    loanAmount: number;
    tenure: number;
  };
  dealerNotes: string;
  dealerId: string;
  submittedBy: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: DealerApplicationData = await request.json();
    const {
      quickReference,
      customerInfo,
      employment,
      expenses,
      vehicle,
      dealerNotes,
      dealerId,
      submittedBy,
    } = body;

    // Validate required fields
    if (!customerInfo || !employment || !vehicle || !dealerId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: customerInfo, employment, vehicle, dealerId',
        },
        { status: 400 }
      );
    }

    // Generate application ID with dealer prefix
    const applicationId = `DEALER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Transform dealer data to main API format
    const transformedData = {
      applicationId,
      customerData: {
        personalInfo: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          aadhaar: customerInfo.aadhaar,
          pan: customerInfo.pan,
          dateOfBirth: new Date(customerInfo.dateOfBirth),
          address: customerInfo.address,
        },
        employmentInfo: {
          employmentType: employment.employmentType,
          companyName: employment.companyName,
          designation: employment.designation,
          monthlyIncome: employment.monthlyIncome,
          experience: employment.experience,
        },
        financialInfo: {
          creditScore: 700, // Default, will be updated by prescreening
          existingEmis: 0, // Default for dealer applications
          bankAccount: {
            bankName: 'Not Provided',
            accountNumber: 'Not Provided',
            ifscCode: 'Not Provided',
          },
        },
      },
      vehicleData: {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        variant: vehicle.variant,
        price: vehicle.price,
        downPayment: vehicle.downPayment,
        loanAmount: vehicle.loanAmount,
        tenure: vehicle.tenure,
      },
      financialData: {
        requestedAmount: vehicle.loanAmount,
        tenure: vehicle.tenure,
        downPayment: vehicle.downPayment,
        monthlyIncome: employment.monthlyIncome,
        existingEmis: 0,
        creditScore: 700,
      },
      documents: [], // Empty for dealer applications, can be added later
      selectedLenders: [], // Empty for dealer applications, will be auto-selected
      dealerInfo: {
        dealerId,
        quickReference,
        dealerNotes,
        submittedBy,
      },
    };

    // Submit to multiple lenders using the main service
    const result = await lenderIntegrationService.submitToMultipleLenders(
      applicationId,
      transformedData.customerData as CustomerData,
      transformedData.vehicleData as VehicleData,
      transformedData.financialData as FinancialData,
      transformedData.documents as DocumentData[],
      transformedData.selectedLenders
    );

    // In production, you would save the dealer application to a separate table
    // with the dealer-specific information for tracking purposes

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        applicationId,
        quickReference,
        dealerId,
        dealerNotes,
      },
      message: `Application submitted successfully by dealer. Reference: ${quickReference}`,
    });

  } catch (error) {
    console.error('Error submitting dealer application:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit dealer application',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 