"use client"

import { useState, useEffect } from 'react'

interface EnhancedApplicationViewProps {
  applicationId?: string
  applicationData?: any
  onEnhance?: (enhancedData: any) => void
}

export function EnhancedApplicationView({ 
  applicationId, 
  applicationData, 
  onEnhance 
}: EnhancedApplicationViewProps) {
  const [enhancedData, setEnhancedData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (applicationId) {
      fetchEnhancedData()
    }
  }, [applicationId])

  const fetchEnhancedData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/application/enhance?applicationId=${applicationId}`)
      const result = await response.json()
      
      if (result.success) {
        setEnhancedData(result.data)
        onEnhance?.(result.data)
      } else {
        setError(result.error || 'Failed to fetch enhanced data')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const enhanceCurrentData = async () => {
    if (!applicationData) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/application/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setEnhancedData(result.data)
        onEnhance?.(result.data)
      } else {
        setError(result.error || 'Failed to enhance data')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'LOW': return 'text-green-600 bg-green-50'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50'
      case 'HIGH': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getVerificationStatus = (isValid: boolean, confidence: number) => {
    if (isValid && confidence >= 90) return { status: 'VERIFIED', color: 'text-green-600' }
    if (isValid && confidence >= 70) return { status: 'PARTIALLY VERIFIED', color: 'text-yellow-600' }
    return { status: 'NOT VERIFIED', color: 'text-red-600' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Enhancing application data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-600">⚠️</div>
          <span className="ml-2 text-red-800">{error}</span>
        </div>
        <button
          onClick={applicationId ? fetchEnhancedData : enhanceCurrentData}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!enhancedData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 mb-4">No enhanced data available</p>
        {applicationData && (
          <button
            onClick={enhanceCurrentData}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Enhance Application Data
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Risk Assessment Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getRiskColor(enhancedData.riskAssessment.riskCategory)}`}>
              {enhancedData.riskAssessment.overallRiskScore}/100
            </div>
            <div className="text-sm text-gray-600">Risk Score</div>
          </div>
          <div className="text-center">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(enhancedData.riskAssessment.riskCategory)}`}>
              {enhancedData.riskAssessment.riskCategory} RISK
            </div>
            <div className="text-sm text-gray-600 mt-1">Risk Category</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {enhancedData.riskAssessment.riskFactors.length}
            </div>
            <div className="text-sm text-gray-600">Risk Factors</div>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* PAN Verification */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">PAN Card</span>
              {getVerificationStatus(enhancedData.verification.pan.isValid, enhancedData.verification.pan.confidence).status === 'VERIFIED' && (
                <span className="text-green-600">✓</span>
              )}
            </div>
            <div className={`text-sm ${getVerificationStatus(enhancedData.verification.pan.isValid, enhancedData.verification.pan.confidence).color}`}>
              {getVerificationStatus(enhancedData.verification.pan.isValid, enhancedData.verification.pan.confidence).status}
            </div>
            {enhancedData.verification.pan.verifiedName && (
              <div className="text-xs text-gray-500 mt-1">
                Name: {enhancedData.verification.pan.verifiedName}
              </div>
            )}
          </div>

          {/* Aadhaar Verification */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Aadhaar</span>
              {getVerificationStatus(enhancedData.verification.aadhaar.isValid, enhancedData.verification.aadhaar.confidence).status === 'VERIFIED' && (
                <span className="text-green-600">✓</span>
              )}
            </div>
            <div className={`text-sm ${getVerificationStatus(enhancedData.verification.aadhaar.isValid, enhancedData.verification.aadhaar.confidence).color}`}>
              {getVerificationStatus(enhancedData.verification.aadhaar.isValid, enhancedData.verification.aadhaar.confidence).status}
            </div>
            {enhancedData.verification.aadhaar.verifiedName && (
              <div className="text-xs text-gray-500 mt-1">
                Name: {enhancedData.verification.aadhaar.verifiedName}
              </div>
            )}
          </div>

          {/* Credit Report */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Credit Report</span>
              {enhancedData.verification.credit.creditScore && enhancedData.verification.credit.creditScore >= 700 && (
                <span className="text-green-600">✓</span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {enhancedData.verification.credit.creditScore ? 
                `${enhancedData.verification.credit.creditScore} (${enhancedData.verification.credit.bureauName})` : 
                'Not Available'
              }
            </div>
            {enhancedData.verification.credit.totalAccounts && (
              <div className="text-xs text-gray-500 mt-1">
                {enhancedData.verification.credit.activeAccounts} active / {enhancedData.verification.credit.totalAccounts} total accounts
              </div>
            )}
          </div>

          {/* Income Verification */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Income</span>
              {enhancedData.verification.income.verifiedIncome && (
                <span className="text-green-600">✓</span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {enhancedData.verification.income.verifiedIncome ? 
                `₹${enhancedData.verification.income.verifiedIncome.toLocaleString()}` : 
                'Not Verified'
              }
            </div>
            {enhancedData.verification.income.verificationMethod && (
              <div className="text-xs text-gray-500 mt-1">
                {enhancedData.verification.income.verificationMethod}
              </div>
            )}
          </div>

          {/* Bank Statement */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Bank Statement</span>
              {enhancedData.verification.bankStatement?.monthlyInflow && (
                <span className="text-green-600">✓</span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {enhancedData.verification.bankStatement?.monthlyInflow ? 
                'Analyzed' : 
                'Not Available'
              }
            </div>
            {enhancedData.verification.bankStatement?.inflowTrend && (
              <div className="text-xs text-gray-500 mt-1">
                Trend: {enhancedData.verification.bankStatement.inflowTrend}
              </div>
            )}
          </div>

          {/* KYC Status */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Video KYC</span>
              {enhancedData.verification.kyc?.status === 'APPROVED' && (
                <span className="text-green-600">✓</span>
              )}
            </div>
            <div className={`text-sm ${
              enhancedData.verification.kyc?.status === 'APPROVED' ? 'text-green-600' :
              enhancedData.verification.kyc?.status === 'PENDING' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {enhancedData.verification.kyc?.status || 'Not Started'}
            </div>
            {enhancedData.verification.kyc?.faceMatchScore && (
              <div className="text-xs text-gray-500 mt-1">
                Face Match: {enhancedData.verification.kyc.faceMatchScore}%
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Risk Factors & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Factors */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors</h3>
          {enhancedData.riskAssessment.riskFactors.length > 0 ? (
            <ul className="space-y-2">
              {enhancedData.riskAssessment.riskFactors.map((factor: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-sm text-gray-700">{factor}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No significant risk factors identified</p>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          {enhancedData.riskAssessment.recommendations.length > 0 ? (
            <ul className="space-y-2">
              {enhancedData.riskAssessment.recommendations.map((recommendation: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-sm text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No specific recommendations at this time</p>
          )}
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  )
} 