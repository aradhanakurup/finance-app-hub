"use client"

import { useState, useEffect } from 'react'
import { CreditCard, Shield, CheckCircle, AlertCircle, DollarSign, Receipt } from 'lucide-react'

interface PaymentStepProps {
  applicationData: any
  onDataUpdate: (data: any, step: string) => void
  onNext: () => void
  onPrevious: () => void
}

interface CostBreakdown {
  breakdown: {
    applicationFee: number
    insuranceCost: number
    subtotal: number
    gst: number
    total: number
  }
  insuranceDetails?: any
  currency: string
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

export function PaymentStep({ applicationData, onDataUpdate, onNext, onPrevious }: PaymentStepProps) {
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(null)
  const [insuranceQuotes, setInsuranceQuotes] = useState<InsuranceQuote[]>([])
  const [selectedInsurance, setSelectedInsurance] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [paymentUrl, setPaymentUrl] = useState<string>('')

  // Load cost breakdown on component mount
  useEffect(() => {
    loadCostBreakdown()
  }, [applicationData])

  const loadCostBreakdown = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/payments/cost-breakdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationData,
          selectedInsurance,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setCostBreakdown(data.data.costBreakdown)
        setInsuranceQuotes(data.data.insuranceQuotes || [])
      } else {
        setError(data.error || 'Failed to load cost breakdown')
      }
    } catch (error) {
      console.error('Error loading cost breakdown:', error)
      setError('Failed to load cost breakdown')
    } finally {
      setLoading(false)
    }
  }

  const handleInsuranceSelection = async (quote: InsuranceQuote | null) => {
    setSelectedInsurance(quote)
    
    // Reload cost breakdown with selected insurance
    try {
      const response = await fetch('/api/payments/cost-breakdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationData,
          selectedInsurance: quote,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setCostBreakdown(data.data.costBreakdown)
      }
    } catch (error) {
      console.error('Error updating cost breakdown:', error)
    }
  }

  const handlePayment = async () => {
    if (!costBreakdown) {
      setError('Cost breakdown not available')
      return
    }

    setLoading(true)
    setError('')

    try {
      const customerInfo = {
        email: applicationData.personalInfo?.email || '',
        phone: applicationData.personalInfo?.phone || '',
        firstName: applicationData.personalInfo?.firstName || '',
        lastName: applicationData.personalInfo?.lastName || '',
      }

      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationData,
          selectedInsurance,
          customerInfo,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Update application data with payment information
        onDataUpdate({
          paymentOrder: data.data.payment,
          selectedInsurance,
          costBreakdown,
        }, 'payment')

        // Redirect to payment gateway
        if (data.data.payment.paymentUrl) {
          setPaymentUrl(data.data.payment.paymentUrl)
          // In production, you would redirect to the payment URL
          // window.location.href = data.data.payment.paymentUrl
          
          // For demo purposes, simulate successful payment
          setTimeout(() => {
            onNext()
          }, 2000)
        }
      } else {
        setError(data.error || 'Failed to create payment order')
      }
    } catch (error) {
      console.error('Error creating payment order:', error)
      setError('Failed to create payment order')
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
    const names = {
      loan_protection: 'Loan Protection',
      job_loss: 'Job Loss Protection',
      critical_illness: 'Critical Illness',
      asset_protection: 'Asset Protection',
    }
    return names[type as keyof typeof names] || type
  }

  if (loading && !costBreakdown) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading payment details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment & Insurance</h2>
        <p className="text-gray-600">
          Review your application costs and select insurance protection. Complete payment to proceed with your loan application.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Cost Breakdown */}
      {costBreakdown && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Receipt className="w-5 h-5 mr-2" />
            Cost Breakdown
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Application Processing Fee</span>
              <span className="font-medium">{formatCurrency(costBreakdown.breakdown.applicationFee)}</span>
            </div>
            
            {costBreakdown.breakdown.insuranceCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance Premium</span>
                <span className="font-medium">{formatCurrency(costBreakdown.breakdown.insuranceCost)}</span>
              </div>
            )}
            
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(costBreakdown.breakdown.subtotal)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">GST (18%)</span>
              <span className="font-medium">{formatCurrency(costBreakdown.breakdown.gst)}</span>
            </div>
            
            <div className="flex justify-between border-t pt-3">
              <span className="text-lg font-semibold text-gray-900">Total Amount</span>
              <span className="text-lg font-bold text-blue-600">{formatCurrency(costBreakdown.breakdown.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Insurance Selection */}
      {!selectedInsurance && insuranceQuotes.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Select Insurance Protection (Optional)
          </h3>
          
          <p className="text-gray-600 mb-4">
            Protect your loan with comprehensive insurance coverage. Choose the option that best suits your needs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insuranceQuotes.slice(0, 4).map((quote) => (
              <div
                key={`${quote.providerId}-${quote.coverageType}`}
                className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"
                onClick={() => handleInsuranceSelection(quote)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{quote.providerName}</h4>
                  <span className="text-sm text-gray-500">{getCoverageTypeName(quote.coverageType)}</span>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-blue-600">{formatCurrency(quote.premium)}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 ml-1">{quote.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  Coverage: {formatCurrency(quote.coverage)}
                </p>
                
                <p className="text-xs text-gray-500">
                  Response time: {quote.responseTime} minutes
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => handleInsuranceSelection(null)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Skip insurance for now
            </button>
          </div>
        </div>
      )}

      {/* Selected Insurance */}
      {selectedInsurance && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">Selected Insurance</h4>
              <p className="text-sm text-blue-700">
                {selectedInsurance.providerName} - {getCoverageTypeName(selectedInsurance.coverageType)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-900">{formatCurrency(selectedInsurance.premium)}</p>
              <button
                onClick={() => handleInsuranceSelection(null)}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Payment Method
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="razorpay"
              defaultChecked
              className="mr-3"
            />
            <div>
              <p className="font-medium text-gray-900">Razorpay Gateway</p>
              <p className="text-sm text-gray-600">Credit/Debit Cards, UPI, Net Banking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        
        <button
          onClick={handlePayment}
          disabled={!costBreakdown || loading}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4 mr-2" />
              Pay {costBreakdown ? formatCurrency(costBreakdown.breakdown.total) : ''}
            </>
          )}
        </button>
      </div>

      {/* Payment URL (for demo) */}
      {paymentUrl && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-green-700">
              Payment order created successfully! Redirecting to payment gateway...
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 