import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { monthlyIncome, existingEmis, monthlyExpenses, requestedEmi } = body;

    // Defaults for optional fields
    const income = Number(monthlyIncome) || 0;
    const emis = Number(existingEmis) || 0;
    const expenses = Number(monthlyExpenses) || 0;
    const reqEmi = Number(requestedEmi) || 0;

    // Calculations
    const recommendedMaxEmi = Math.round(income * 0.4);
    const totalEmiAfterLoan = emis + reqEmi;
    const disposableIncome = income - (emis + expenses);
    const disposableIncomeAfterLoan = income - (totalEmiAfterLoan + expenses);
    const isAffordable = totalEmiAfterLoan <= recommendedMaxEmi && disposableIncomeAfterLoan >= 10000;

    let warning = null;
    if (totalEmiAfterLoan > recommendedMaxEmi) {
      warning = 'Requested EMI exceeds recommended maximum based on your income.';
    } else if (disposableIncomeAfterLoan < 10000) {
      warning = 'Your disposable income after all EMIs will be below ₹10,000.';
    }

    return NextResponse.json({
      recommendedMaxEmi,
      isAffordable,
      disposableIncome,
      details: {
        monthlyIncome: income,
        existingEmis: emis,
        monthlyExpenses: expenses,
        requestedEmi: reqEmi,
        totalEmiAfterLoan,
        disposableIncomeAfterLoan,
        warning,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request or server error.' }, { status: 400 });
  }
} 