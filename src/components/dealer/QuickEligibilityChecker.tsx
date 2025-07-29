'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/config/commission';

interface EligibilityData {
  monthlyIncome: number;
  existingEmis: number;
  requestedAmount: number;
  tenure: number;
  creditScore: number;
  employmentType: 'salaried' | 'self-employed' | 'business';
  vehicleType: 'new' | 'used';
  downPayment: number;
}

interface EligibilityResult {
  eligible: boolean;
  maxLoanAmount: number;
  recommendedEmi: number;
  approvalProbability: number;
  suggestedLenders: string[];
  riskFactors: string[];
  recommendations: string[];
}

export function QuickEligibilityChecker() {
  const [formData, setFormData] = useState<EligibilityData>({
    monthlyIncome: 0,
    existingEmis: 0,
    requestedAmount: 0,
    tenure: 60,
    creditScore: 750,
    employmentType: 'salaried',
    vehicleType: 'new',
    downPayment: 0,
  });

  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof EligibilityData, value: number | string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateEligibility = async () => {
    setLoading(true);
    
    try {
      // Calculate basic eligibility
      const monthlyIncome = formData.monthlyIncome;
      const existingEmis = formData.existingEmis;
      const requestedAmount = formData.requestedAmount;
      const tenure = formData.tenure;
      const creditScore = formData.creditScore;
      
      // Calculate disposable income
      const disposableIncome = monthlyIncome - existingEmis;
      
      // Calculate maximum EMI capacity (50% of disposable income)
      const maxEmiCapacity = disposableIncome * 0.5;
      
      // Calculate EMI for requested amount
      const interestRate = getInterestRate(creditScore, formData.employmentType);
      const monthlyRate = interestRate / 12 / 100;
      const emi = requestedAmount * (monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
      
      // Calculate maximum loan amount based on EMI capacity
      const maxLoanAmount = maxEmiCapacity * (Math.pow(1 + monthlyRate, tenure) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, tenure));
      
      // Determine eligibility
      const eligible = emi <= maxEmiCapacity && creditScore >= 650;
      
      // Calculate approval probability
      let approvalProbability = 0;
      if (creditScore >= 800) approvalProbability = 95;
      else if (creditScore >= 750) approvalProbability = 85;
      else if (creditScore >= 700) approvalProbability = 75;
      else if (creditScore >= 650) approvalProbability = 60;
      else approvalProbability = 30;
      
      // Adjust for income factors
      if (monthlyIncome >= 100000) approvalProbability += 10;
      else if (monthlyIncome >= 50000) approvalProbability += 5;
      
      // Adjust for employment type
      if (formData.employmentType === 'salaried') approvalProbability += 5;
      
      approvalProbability = Math.min(approvalProbability, 95);
      
      // Determine suggested lenders
      const suggestedLenders = getSuggestedLenders(creditScore, monthlyIncome, formData.employmentType);
      
      // Identify risk factors
      const riskFactors = [];
      if (creditScore < 700) riskFactors.push('Low credit score');
      if (emi > maxEmiCapacity * 0.8) riskFactors.push('High EMI burden');
      if (existingEmis > monthlyIncome * 0.4) riskFactors.push('High existing debt');
      if (formData.employmentType === 'self-employed') riskFactors.push('Self-employed (requires additional documentation)');
      
      // Generate recommendations
      const recommendations = [];
      if (creditScore < 700) recommendations.push('Improve credit score before applying');
      if (emi > maxEmiCapacity * 0.8) recommendations.push('Consider longer tenure or higher down payment');
      if (existingEmis > monthlyIncome * 0.4) recommendations.push('Reduce existing debt before applying');
      if (formData.employmentType === 'self-employed') recommendations.push('Prepare additional business documents');
      
      const eligibilityResult: EligibilityResult = {
        eligible,
        maxLoanAmount: Math.round(maxLoanAmount),
        recommendedEmi: Math.round(emi),
        approvalProbability,
        suggestedLenders,
        riskFactors,
        recommendations,
      };
      
      setResult(eligibilityResult);
      
    } catch (error) {
      console.error('Error calculating eligibility:', error);
      alert('Error calculating eligibility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getInterestRate = (creditScore: number, employmentType: string): number => {
    let baseRate = 12; // Base rate 12%
    
    // Adjust for credit score
    if (creditScore >= 800) baseRate -= 2;
    else if (creditScore >= 750) baseRate -= 1;
    else if (creditScore >= 700) baseRate += 0;
    else if (creditScore >= 650) baseRate += 1;
    else baseRate += 3;
    
    // Adjust for employment type
    if (employmentType === 'salaried') baseRate -= 0.5;
    else if (employmentType === 'self-employed') baseRate += 1;
    
    return Math.max(baseRate, 8); // Minimum 8%
  };

  const getSuggestedLenders = (creditScore: number, monthlyIncome: number, employmentType: string): string[] => {
    const lenders = [];
    
    if (creditScore >= 750 && monthlyIncome >= 50000) {
      lenders.push('HDFC Bank', 'ICICI Bank', 'Axis Bank');
    }
    
    if (creditScore >= 700) {
      lenders.push('SBI', 'Kotak Mahindra Bank');
    }
    
    if (creditScore >= 650) {
      lenders.push('Bajaj Finance', 'Tata Capital');
    }
    
    if (employmentType === 'self-employed') {
      lenders.push('Mahindra Finance', 'Cholamandalam Finance');
    }
    
    return [...new Set(lenders)]; // Remove duplicates
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Eligibility Checker</h3>
        <p className="text-gray-600">Quickly assess customer eligibility for auto loans</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Income
            </label>
            <input
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => handleInputChange('monthlyIncome', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="₹50,000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Existing EMIs
            </label>
            <input
              type="number"
              value={formData.existingEmis}
              onChange={(e) => handleInputChange('existingEmis', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="₹5,000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requested Loan Amount
            </label>
            <input
              type="number"
              value={formData.requestedAmount}
              onChange={(e) => handleInputChange('requestedAmount', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="₹5,00,000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Tenure (months)
            </label>
            <select
              value={formData.tenure}
              onChange={(e) => handleInputChange('tenure', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={36}>36 months (3 years)</option>
              <option value={48}>48 months (4 years)</option>
              <option value={60}>60 months (5 years)</option>
              <option value={72}>72 months (6 years)</option>
              <option value={84}>84 months (7 years)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credit Score
            </label>
            <input
              type="number"
              value={formData.creditScore}
              onChange={(e) => handleInputChange('creditScore', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="750"
              min="300"
              max="900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employment Type
            </label>
            <select
              value={formData.employmentType}
              onChange={(e) => handleInputChange('employmentType', e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="salaried">Salaried</option>
              <option value="self-employed">Self-Employed</option>
              <option value="business">Business Owner</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type
            </label>
            <select
              value={formData.vehicleType}
              onChange={(e) => handleInputChange('vehicleType', e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="new">New Vehicle</option>
              <option value="used">Used Vehicle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Down Payment
            </label>
            <input
              type="number"
              value={formData.downPayment}
              onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="₹1,00,000"
            />
          </div>

          <button
            onClick={calculateEligibility}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Calculating...' : 'Check Eligibility'}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result && (
            <>
              {/* Eligibility Status */}
              <div className={`p-4 rounded-lg border ${result.eligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${result.eligible ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {result.eligible ? 'Eligible for Loan' : 'Not Eligible'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Approval Probability: {result.approvalProbability}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Loan Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Loan Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Requested Amount:</span>
                    <span className="font-medium">{formatCurrency(formData.requestedAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Eligible Amount:</span>
                    <span className="font-medium">{formatCurrency(result.maxLoanAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly EMI:</span>
                    <span className="font-medium">{formatCurrency(result.recommendedEmi)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="font-medium">{getInterestRate(formData.creditScore, formData.employmentType)}%</span>
                  </div>
                </div>
              </div>

              {/* Suggested Lenders */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Suggested Lenders</h4>
                <div className="flex flex-wrap gap-2">
                  {result.suggestedLenders.map((lender, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {lender}
                    </span>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              {result.riskFactors.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Risk Factors</h4>
                  <ul className="space-y-1">
                    {result.riskFactors.map((factor, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center">
                        <span className="text-yellow-500 mr-2">⚠️</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
                  <ul className="space-y-1">
                    {result.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center">
                        <span className="text-green-500 mr-2">💡</span>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {!result && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600">Fill in the customer details and click "Check Eligibility" to get instant results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 