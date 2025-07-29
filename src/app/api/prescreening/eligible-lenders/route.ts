import { NextRequest, NextResponse } from 'next/server';
import { mockLenderService } from '@/services/mockLenderService';
import { Lender } from '@/types/lender';

// Helper: eligibility logic (can be refactored to a shared service if needed)
function isLenderEligible(lender: Lender, customerData: any, vehicleData: any, financialData: any): boolean {
  if (!lender.isActive) return false;
  if (customerData.financialInfo.creditScore < lender.minCreditScore) return false;
  if (financialData.requestedAmount < lender.minLoanAmount || financialData.requestedAmount > lender.maxLoanAmount) return false;
  if (!lender.supportedVehicleTypes.includes(vehicleData.make.toLowerCase())) return false;
  if (!lender.supportedEmploymentTypes.includes(customerData.employmentInfo.employmentType)) return false;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerData, vehicleData, financialData } = body;
    // Fetch all lenders
    const lenders: Lender[] = await mockLenderService.getAllLenders();
    // Filter eligible lenders
    const eligibleLenders = lenders.filter(lender => isLenderEligible(lender, customerData, vehicleData, financialData));
    return NextResponse.json({ eligibleLenders });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request or server error.' }, { status: 400 });
  }
} 