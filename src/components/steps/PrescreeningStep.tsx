"use client"

import { useState, useEffect } from 'react'

interface PrescreeningStepProps {
  data: any
  onUpdate: (data: any) => void
  applicationData: any
}

export function PrescreeningStep({ data, onUpdate, applicationData }: PrescreeningStepProps) {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runPrescreening = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Add safety checks for undefined applicationData
      const safeApplicationData = applicationData || {}
      
      const customerData = {
        personalInfo: safeApplicationData.personalInfo || {},
        employmentInfo: safeApplicationData.employment || {},
        financialInfo: safeApplicationData.income || {},
        expenses: safeApplicationData.expenses || {
          rent: 0,
          utilities: 0,
          food: 0,
          transportation: 0,
          healthcare: 0,
          other: 0
        }
      }
      
      const vehicleData = safeApplicationData.vehicle || {}
      const financialData = {
        requestedAmount: vehicleData?.loanAmount || 0,
        tenure: vehicleData?.tenure || 60,
        downPayment: vehicleData?.downPayment || 0,
        monthlyIncome: safeApplicationData.income?.monthlyIncome || 0,
        existingEmis: safeApplicationData.income?.existingEmis || 0,
        creditScore: safeApplicationData.income?.creditScore || 750,
      }

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
        customCreditScore,
        completed: true
      }

      setResults(prescreeningResults)
      onUpdate(prescreeningResults)
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

  // Auto-run prescreening when step is loaded
  useEffect(() => {
    if (!results && !loading) {
      runPrescreening()
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Check Eligibility</h3>
        <p className="text-gray-600">
          Click &quot;Run Prescreening&quot; to check your loan eligibility and get personalized offers.
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your profile...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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
          {/* Summary Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Custom Credit Score */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(results.customCreditScore?.customScore || 0)}`}>
                  {results.customCreditScore?.customScore || 0}
                </div>
                <p className="text-sm text-gray-600 mb-2">Credit Score</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(results.customCreditScore?.category || 'Unknown')}`}>
                  {results.customCreditScore?.category || 'Unknown'}
                </span>
              </div>
            </div>

            {/* Risk Profile */}
            <div className="bg-white border rounded-lg p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {results.riskProfile?.riskScore || 0}
                </div>
                <p className="text-sm text-gray-600 mb-2">Risk Score</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(results.riskProfile?.riskCategory || 'Unknown')}`}>
                  {results.riskProfile?.riskCategory || 'Unknown'}
                </span>
              </div>
            </div>

            {/* EMI Affordability */}
            <div className="bg-white border rounded-lg p-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${results.emiAffordability?.isAffordable ? 'text-green-600' : 'text-red-600'}`}>
                  {results.emiAffordability?.isAffordable ? '✓' : '✗'}
                </div>
                <p className="text-sm text-gray-600 mb-2">EMI Affordable</p>
                <div className="text-xs text-gray-500">
                  ₹{results.emiAffordability?.recommendedMaxEmi?.toLocaleString() || '0'}
                </div>
              </div>
            </div>

            {/* Eligible Lenders */}
            <div className="bg-white border rounded-lg p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {results.eligibleLenders.length}
                </div>
                <p className="text-sm text-gray-600 mb-2">Eligible Lenders</p>
                <div className="text-xs text-gray-500">
                  Ready to apply
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Analysis Summary</h4>
            
            <div className="space-y-4">
              {/* KYC Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">KYC Verification:</span>
                <div className="flex space-x-2">
                  <span className={results.riskProfile?.details?.panValid ? 'text-green-600' : 'text-red-600'}>
                    PAN {results.riskProfile?.details?.panValid ? '✓' : '✗'}
                  </span>
                  <span className={results.riskProfile?.details?.aadhaarValid ? 'text-green-600' : 'text-red-600'}>
                    Aadhaar {results.riskProfile?.details?.aadhaarValid ? '✓' : '✗'}
                  </span>
                </div>
              </div>

              {/* EMI Recommendation */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Recommended Max EMI:</span>
                <span className="font-semibold">₹{results.emiAffordability?.recommendedMaxEmi?.toLocaleString() || '0'}</span>
              </div>

              {/* Disposable Income */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Disposable Income:</span>
                <span className="font-semibold">₹{results.emiAffordability?.disposableIncome?.toLocaleString() || '0'}</span>
              </div>

              {/* Warning */}
              {results.emiAffordability?.details?.warning && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-yellow-800 text-sm">{results.emiAffordability.details.warning}</p>
                </div>
              )}
            </div>
          </div>

          {/* Eligible Lenders Preview */}
          {results.eligibleLenders.length > 0 && (
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Eligible Lenders ({results.eligibleLenders.length})
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {results.eligibleLenders.slice(0, 4).map((lender: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">{lender.name}</h5>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Interest Rate: {lender.interestRate}%</div>
                      <div>Loan Range: ₹{lender.minLoanAmount?.toLocaleString()} - ₹{lender.maxLoanAmount?.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
              {results.eligibleLenders.length > 4 && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  +{results.eligibleLenders.length - 4} more lenders available
                </p>
              )}
            </div>
          )}

          {/* Action */}
          <div className="text-center">
            <button
              onClick={runPrescreening}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors mr-4"
            >
              Refresh Analysis
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Your analysis is complete! You can proceed to the next step.
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 