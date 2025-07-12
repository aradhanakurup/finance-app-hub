import { NextRequest, NextResponse } from 'next/server';
import { lenderIntegrationService } from '../../../../services/lenderIntegrationService';
import { CustomerData, VehicleData, FinancialData, DocumentData } from '../../../../types/lender';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      applicationId,
      customerData,
      vehicleData,
      financialData,
      documents,
      selectedLenders,
    } = body;

    // Validate required fields
    if (!applicationId || !customerData || !vehicleData || !financialData) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: applicationId, customerData, vehicleData, financialData',
        },
        { status: 400 }
      );
    }

    // Submit to multiple lenders
    const result = await lenderIntegrationService.submitToMultipleLenders(
      applicationId,
      customerData as CustomerData,
      vehicleData as VehicleData,
      financialData as FinancialData,
      documents as DocumentData[] || [],
      selectedLenders || []
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: result.message,
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit application',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 