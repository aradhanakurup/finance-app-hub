import { NextRequest, NextResponse } from 'next/server';
import { signzyAPI } from '@/services/signzyAPI';

function normalize(val: number, max: number, weight: number) {
  return (Math.min(val, max) / max) * weight;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerData, bankStatement, emiAffordability, applicationHistory } = body;
    let score = 0;
    const breakdown: any = {};

    // PAN/Aadhaar Validity (10%)
    const panValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(customerData.personalInfo.pan);
    const aadhaarValid = /^\d{12}$/.test(customerData.personalInfo.aadhaar);
    breakdown.panValid = panValid;
    breakdown.aadhaarValid = aadhaarValid;
    score += (panValid ? 5 : 0) + (aadhaarValid ? 5 : 0); // 10 max

    // Credit Score from Bureau (25%)
    let creditBureauData;
    if (process.env.NODE_ENV === 'development') {
      creditBureauData = await signzyAPI.getMockCreditReport(customerData.personalInfo.pan);
    } else {
      creditBureauData = await signzyAPI.getCreditReport(
        customerData.personalInfo.pan,
        customerData.personalInfo.aadhaar
      );
    }
    breakdown.creditScore = creditBureauData.creditScore;
    breakdown.bureauName = creditBureauData.bureauName;
    breakdown.totalAccounts = creditBureauData.totalAccounts;
    breakdown.activeAccounts = creditBureauData.activeAccounts;
    breakdown.overdueAccounts = creditBureauData.overdueAccounts;
    
    if (creditBureauData.creditScore >= 750) score += 25;
    else if (creditBureauData.creditScore >= 700) score += 20;
    else if (creditBureauData.creditScore >= 650) score += 15;
    else score += 5;

    // Bank Statement Health (20%)
    let bankHealth = 0;
    let bankAnalysis;
    
    if (process.env.NODE_ENV === 'development' && process.env.ENABLE_MOCK_DATA === 'true') {
      // Mock bank analysis for development
      const accountHash = (customerData.financialInfo.bankAccount?.accountNumber || '0000000000').split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
      bankAnalysis = {
        monthlyInflow: 75000 + (accountHash % 50000),
        monthlyOutflow: 45000 + (accountHash % 30000),
        averageBalance: 150000 + (accountHash % 200000),
        bouncedCheques: accountHash % 3,
        inflowTrend: accountHash % 3 === 0 ? 'increasing' : accountHash % 3 === 1 ? 'decreasing' : 'stable',
        salaryCredits: 1 + (accountHash % 2),
        emiDebits: accountHash % 4,
        categorizedTransactions: []
      };
    } else {
      // Real Signzy bank analysis
      bankAnalysis = await signzyAPI.analyzeBankStatement(
        customerData.financialInfo.consentHandle || '',
        customerData.financialInfo.bankAccount?.accountId || '',
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days ago
        new Date().toISOString().split('T')[0]
      );
    }
    
    breakdown.bouncedCheques = bankAnalysis.bouncedCheques;
    breakdown.inflowTrend = bankAnalysis.inflowTrend;
    breakdown.monthlyInflow = bankAnalysis.monthlyInflow;
    breakdown.monthlyOutflow = bankAnalysis.monthlyOutflow;
    breakdown.averageBalance = bankAnalysis.averageBalance;
    breakdown.salaryCredits = bankAnalysis.salaryCredits;
    breakdown.emiDebits = bankAnalysis.emiDebits;
    
    if (breakdown.bouncedCheques === 0) bankHealth += 10;
    else if (breakdown.bouncedCheques <= 2) bankHealth += 5;
    if (breakdown.inflowTrend === 'stable' || breakdown.inflowTrend === 'increasing') bankHealth += 5;
    if (breakdown.monthlyInflow > breakdown.monthlyOutflow) bankHealth += 5;
    breakdown.bankHealth = bankHealth;
    score += bankHealth; // 20 max

    // EMI Affordability (15%)
    breakdown.emiAffordability = emiAffordability?.isAffordable ?? false;
    breakdown.recommendedMaxEmi = emiAffordability?.recommendedMaxEmi ?? 0;
    breakdown.disposableIncome = emiAffordability?.disposableIncome ?? 0;
    if (emiAffordability?.isAffordable) score += 10;
    if (emiAffordability?.disposableIncome > 10000) score += 5;

    // Employment & Income (15%)
    const empType = customerData.employmentInfo.employmentType;
    const income = customerData.employmentInfo.monthlyIncome;
    breakdown.employmentType = empType;
    breakdown.income = income;
    if (empType === 'SALARIED') score += 5;
    else if (empType === 'SELF_EMPLOYED') score += 3;
    if (income > 100000) score += 10;
    else if (income >= 50000) score += 7;
    else score += 3;

    // Application History (10%)
    breakdown.pastDefaults = applicationHistory?.pastDefaults ?? 0;
    breakdown.pastRejections = applicationHistory?.pastRejections ?? 0;
    if (breakdown.pastDefaults === 0) score += 5;
    if (breakdown.pastRejections === 0) score += 5;

    // Clamp score to 100
    score = Math.max(0, Math.min(100, score));

    // Category
    let category = 'High Risk';
    if (score >= 80) category = 'Gold';
    else if (score >= 60) category = 'Silver';
    else if (score >= 40) category = 'Bronze';

    return NextResponse.json({ customScore: score, category, breakdown });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request or server error.' }, { status: 400 });
  }
} 