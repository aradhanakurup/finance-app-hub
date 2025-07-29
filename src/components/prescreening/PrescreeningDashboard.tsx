"use client"

import { useState, useEffect } from 'react'

interface PrescreeningResult {
  eligibleLenders: any[]
  riskProfile: any
  emiAffordability: any
  customCreditScore: any
}

interface PrescreeningDashboardProps {
  customerData: any
  vehicleData: any
  financialData: any
  onComplete: (results: PrescreeningResult) => void
}

export function PrescreeningDashboard({ 
  customerData, 
  vehicleData, 
  financialData, 
  onComplete 
}: PrescreeningDashboardProps) {
  const [results, setResults] = useState<PrescreeningResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runPrescreening = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Run all prescreening checks in parallel
      const [eligibleLendersRes, riskProfileRes, emiAffordabilityRes, customCreditScoreRes] = await Promise.all([
        fetch('/api/prescreening/eligible-lenders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerData, vehicleData, financialData })
        }),
        fetch('/api/prescreening/risk-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            customerData, 
            bankStatement: {
              monthlyInflow: financialData.monthlyIncome * 1.2,
              monthlyOutflow: financialData.monthlyIncome * 0.7,
              bouncedCheques: 0,
              inflowTrend: 'stable'
            }
          })
        }),
        fetch('/api/prescreening/emi-affordability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            monthlyIncome: financialData.monthlyIncome,
            existingEmis: financialData.existingEmis,
            monthlyExpenses: customerData.expenses ? 
              (customerData.expenses.rent + customerData.expenses.utilities + customerData.expenses.food + 
               customerData.expenses.transportation + customerData.expenses.healthcare + customerData.expenses.other) : 
              financialData.monthlyIncome * 0.3,
            requestedEmi: vehicleData.loanAmount / (vehicleData.tenure * 12)
          })
        }),
        fetch('/api/prescreening/custom-credit-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerData,
            bankStatement: {
              monthlyInflow: financialData.monthlyIncome * 1.2,
              monthlyOutflow: financialData.monthlyIncome * 0.7,
              bouncedCheques: 0,
              inflowTrend: 'stable'
            },
            emiAffordability: { isAffordable: true, disposableIncome: financialData.monthlyIncome * 0.3 },
            applicationHistory: { previousApplications: 0, approvedApplications: 0, rejectedApplications: 0 }
          })
        })
      ])

      const [eligibleLenders, riskProfile, emiAffordability, customCreditScore] = await Promise.all([
        eligibleLendersRes.json(),
        riskProfileRes.json(),
        emiAffordabilityRes.json(),
        customCreditScoreRes.json()
      ])

      const prescreeningResults = {
        eligibleLenders: eligibleLenders.eligibleLenders || [],
        riskProfile,
        emiAffordability,
        customCreditScore
      }

      setResults(prescreeningResults)
      onComplete(prescreeningResults)
    } catch (err) {
      setError('Failed to run prescreening. Please try again.')
      console.error('Prescreening error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      case 'gold': return 'text-yellow-600 bg-yellow-100'
      case 'silver': return 'text-gray-600 bg-gray-100'
      case 'bronze': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Loan Eligibility Prescreening
        </h2>
        <p className="text-gray-600">
          Get instant insights into your loan eligibility, risk profile, and recommended loan amounts
        </p>
      </div>

      {!results && !loading && (
        <div className="text-center">
          <button
            onClick={runPrescreening}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Start Prescreening
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your profile...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button
            onClick={runPrescreening}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {results && (
        <div className="space-y-6">
          {/* Custom Credit Score */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Custom Credit Score</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(results.customCreditScore?.category || 'Unknown')}`}>
                {results.customCreditScore?.category || 'Unknown'}
              </span>
            </div>
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(results.customCreditScore?.customScore || 0)}`}>
                {results.customCreditScore?.customScore || 0}
              </div>
              <p className="text-gray-600 mt-2">out of 100</p>
            </div>
          </div>

          {/* Risk Profile */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Profile</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Score:</span>
                  <span className="font-semibold">{results.riskProfile?.riskScore || 0}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getRiskColor(results.riskProfile?.riskCategory || 'Unknown')}`}>
                    {results.riskProfile?.riskCategory || 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PAN Valid:</span>
                  <span className={results.riskProfile?.details?.panValid ? 'text-green-600' : 'text-red-600'}>
                    {results.riskProfile?.details?.panValid ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Aadhaar Valid:</span>
                  <span className={results.riskProfile?.details?.aadhaarValid ? 'text-green-600' : 'text-red-600'}>
                    {results.riskProfile?.details?.aadhaarValid ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            </div>

            {/* EMI Affordability */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">EMI Affordability</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Recommended Max EMI:</span>
                  <span className="font-semibold">₹{results.emiAffordability?.recommendedMaxEmi?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Affordable:</span>
                  <span className={results.emiAffordability?.isAffordable ? 'text-green-600' : 'text-red-600'}>
                    {results.emiAffordability?.isAffordable ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Disposable Income:</span>
                  <span className="font-semibold">₹{results.emiAffordability?.disposableIncome?.toLocaleString() || '0'}</span>
                </div>
                {results.emiAffordability?.details?.warning && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-yellow-800 text-sm">{results.emiAffordability.details.warning}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Eligible Lenders */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Eligible Lenders ({results.eligibleLenders.length})
            </h3>
            {results.eligibleLenders.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.eligibleLenders.map((lender: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-900 mb-2">{lender.name}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Min Credit Score: {lender.minCreditScore}</div>
                      <div>Loan Range: ₹{lender.minLoanAmount?.toLocaleString()} - ₹{lender.maxLoanAmount?.toLocaleString()}</div>
                      <div>Interest Rate: {lender.interestRate}%</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No lenders found for your profile</p>
                <p className="text-sm text-gray-400">Try adjusting your loan amount, credit score, or vehicle details</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-6 border-t">
            <button
              onClick={runPrescreening}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Refresh Analysis
            </button>
            <button
              onClick={() => onComplete(results)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue to Application
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 