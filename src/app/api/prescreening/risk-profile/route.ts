import { NextRequest, NextResponse } from 'next/server';

import { signzyAPI } from '@/services/signzyAPI'

// Helper: PAN/Aadhaar validation using Signzy
async function validatePAN(pan: string) {
  // For development, always use mock data if not explicitly disabled
  if (process.env.NODE_ENV === 'development') {
    return await signzyAPI.getMockPANVerification(pan);
  }
  return await signzyAPI.verifyPAN(pan);
}

async function validateAadhaar(aadhaar: string) {
  // For development, always use mock data if not explicitly disabled
  if (process.env.NODE_ENV === 'development') {
    return {
      isValid: /^\d{12}$/.test(aadhaar),
      name: 'MOCK USER NAME',
      dob: '1990-01-01',
      status: 'ACTIVE',
      maskedAadhaar: aadhaar.replace(/(\d{4})\d{4}(\d{4})/, '$1****$2')
    };
  }
  return await signzyAPI.verifyAadhaar(aadhaar);
}

async function calculateRiskScore({ customerData, bankStatement }: any) {
  let score = 0;
  const details: any = {};

  // PAN
  const panValidation = await validatePAN(customerData.personalInfo.pan);
  details.panValid = panValidation.isValid;
  details.panName = panValidation.name;
  details.panStatus = panValidation.status;
  score += details.panValid ? 10 : 0;

  // Aadhaar
  const aadhaarValidation = await validateAadhaar(customerData.personalInfo.aadhaar);
  details.aadhaarValid = aadhaarValidation.isValid;
  details.aadhaarName = aadhaarValidation.name;
  details.aadhaarStatus = aadhaarValidation.status;
  score += details.aadhaarValid ? 10 : 0;

  // Credit Score
  const creditScore = customerData.financialInfo.creditScore;
  details.creditScore = creditScore;
  if (creditScore >= 750) score += 20;
  else if (creditScore >= 700) score += 15;
  else if (creditScore >= 650) score += 10;

  // Monthly Income
  const income = customerData.employmentInfo.monthlyIncome;
  details.income = income;
  if (income >= 100000) score += 10;
  else if (income >= 50000) score += 7;
  else if (income >= 25000) score += 4;

  // Existing EMIs
  const existingEmis = customerData.financialInfo.existingEmis;
  details.existingEmis = existingEmis;
  const emiToIncome = income > 0 ? existingEmis / income : 1;
  details.emiToIncomeRatio = emiToIncome;
  if (emiToIncome < 0.2) score += 10;
  else if (emiToIncome < 0.4) score += 5;

  // Bank Statement: Bounced Cheques
  details.bouncedCheques = bankStatement?.bouncedCheques ?? 0;
  if (details.bouncedCheques === 0) score += 10;
  else if (details.bouncedCheques <= 2) score += 5;

  // Bank Statement: Inflow Trend
  details.inflowTrend = bankStatement?.inflowTrend ?? 'stable';
  if (details.inflowTrend === 'stable' || details.inflowTrend === 'rising') score += 5;

  // Employment Type
  details.employmentType = customerData.employmentInfo.employmentType;
  if (details.employmentType === 'SALARIED') score += 5;
  else if (details.employmentType === 'SELF_EMPLOYED') score += 3;

  return { score, details };
}

function getRiskCategory(score: number) {
  if (score >= 55) return 'Low';
  if (score >= 35) return 'Medium';
  return 'High';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerData, bankStatement } = body;
    const { score, details } = await calculateRiskScore({ customerData, bankStatement });
    const riskCategory = getRiskCategory(score);
    return NextResponse.json({ riskScore: score, riskCategory, details });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request or server error.' }, { status: 400 });
  }
} 