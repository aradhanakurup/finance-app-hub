"use client"

import { useState, useEffect } from 'react'
import { Shield, CheckCircle, AlertCircle, Star, Clock, DollarSign } from 'lucide-react'

interface InsuranceStepProps {
  applicationData: any
  onDataUpdate: (data: any, step: string) => void
  onNext: () => void
  onPrevious: () => void
}

interface InsuranceQuote {
  providerId: string
  providerName: string
  coverageType: string
  premium: number
  coverage: number
  terms: string[]
  commission: number
  responseTime: number
  rating: number
}

interface CoverageType {
  id: string
  name: string
  description: string
  baseRate: number
}

export function InsuranceStep({ applicationData, onDataUpdate, onNext, onPrevious }: InsuranceStepProps) {
  const [selectedCoverageType, setSelectedCoverageType] = useState<string>('loan_protection')
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [quotes, setQuotes] = useState<InsuranceQuote[]>([])
  const [coverageTypes, setCoverageTypes] = useState<CoverageType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // Load coverage types on component mount
  useEffect(() => {
    loadCoverageTypes()
  }, [])

  // Load quotes when coverage type changes
  useEffect(() => {
    if (selectedCoverageType) {
      loadQuotes()
    }
  }, [selectedCoverageType])

  const loadCoverageTypes = async () => {
    try {
      const response = await fetch('/api/insurance/quotes')
      const data = await response.json()
      
      if (data.success) {
        setCoverageTypes(data.data.coverageTypes)
      }
    } catch (error) {
      console.error('Error loading coverage types:', error)
    }
  }

  const loadQuotes = async () => {
    setLoading(true)
    setError('')

    try {
      // Build risk profile from application data
      const riskProfile = {
        creditScore: applicationData.prescreening?.creditScore || 650,
        employmentType: applicationData.employment?.employmentType || 'salaried',
        monthlyIncome: applicationData.income?.monthlyIncome || 50000,
        loanAmount: applicationData.vehicle?.loanAmount || 500000,
        loanTenure: applicationData.vehicle?.tenure || 60,
        vehicleType: applicationData.vehicle?.make || 'sedan',
        age: applicationData.personalInfo?.age || 30,
        healthStatus: 'good',
        occupation: applicationData.employment?.designation || 'employee',
        experience: applicationData.employment?.experience || 3,
        existingEmis: applicationData.expenses?.existingEmis || 0,
        customerId: applicationData.personalInfo?.email || '',
      }

      const response = await fetch('/api/insurance/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coverageType: selectedCoverageType,
          riskProfile,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setQuotes(data.data.quotes)
        // Auto-select the first (cheapest) quote
        if (data.data.quotes.length > 0) {
          setSelectedProvider(data.data.quotes[0].providerId)
        }
      } else {
        setError(data.error || 'Failed to load insurance quotes')
      }
    } catch (error) {
      console.error('Error loading quotes:', error)
      setError('Failed to load insurance quotes')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = async () => {
    if (!selectedProvider) {
      setError('Please select an insurance provider')
      return
    }

    try {
      setLoading(true)

      // Create insurance policy
      const riskProfile = {
        creditScore: applicationData.prescreening?.creditScore || 650,
        employmentType: applicationData.employment?.employmentType || 'salaried',
        monthlyIncome: applicationData.income?.monthlyIncome || 50000,
        loanAmount: applicationData.vehicle?.loanAmount || 500000,
        loanTenure: applicationData.vehicle?.tenure || 60,
        vehicleType: applicationData.vehicle?.make || 'sedan',
        age: applicationData.personalInfo?.age || 30,
        healthStatus: 'good',
        occupation: applicationData.employment?.designation || 'employee',
        experience: applicationData.employment?.experience || 3,
        existingEmis: applicationData.expenses?.existingEmis || 0,
        customerId: applicationData.personalInfo?.email || '',
      }

      const response = await fetch('/api/insurance/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: `APP-${Date.now()}`,
          providerId: selectedProvider,
          coverageType: selectedCoverageType,
          riskProfile,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Update application data with insurance information
        const selectedQuote = quotes.find(q => q.providerId === selectedProvider)
        onDataUpdate({
          selectedProvider,
          selectedCoverageType,
          insuranceQuote: selectedQuote,
          insurancePolicy: data.data.policy,
        }, 'insurance')
        
        onNext()
      } else {
        setError(data.error || 'Failed to create insurance policy')
      }
    } catch (error) {
      console.error('Error creating insurance policy:', error)
      setError('Failed to create insurance policy')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getCoverageTypeName = (type: string) => {
    return coverageTypes.find(ct => ct.id === type)?.name || type
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Insurance Protection</h2>
        <p className="text-gray-600">
          Protect your loan with comprehensive insurance coverage. Choose the coverage type and provider that best suits your needs.
        </p>
      </div>

      {/* Coverage Type Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Coverage Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coverageTypes.map((coverageType) => (
            <div
              key={coverageType.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedCoverageType === coverageType.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCoverageType(coverageType.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{coverageType.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{coverageType.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Base Rate: {coverageType.baseRate}%</p>
                </div>
                {selectedCoverageType === coverageType.id && (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insurance Quotes */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Quotes</h3>
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading insurance quotes...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {!loading && quotes.length > 0 && (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div
                key={quote.providerId}
                className={`p-6 border rounded-lg cursor-pointer transition-colors ${
                  selectedProvider === quote.providerId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedProvider(quote.providerId)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">{quote.providerName}</h4>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{quote.rating}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Premium</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(quote.premium)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Coverage</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(quote.coverage)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Response Time</p>
                          <p className="font-semibold text-gray-900">{quote.responseTime} min</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Coverage Terms:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {quote.terms.map((term, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {term}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {selectedProvider === quote.providerId && (
                    <CheckCircle className="w-6 h-6 text-blue-500 ml-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && quotes.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No insurance quotes available for the selected coverage type.</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={!selectedProvider || loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : 'Continue'}
        </button>
      </div>
    </div>
  )
} 