"use client"

import { useState, useEffect } from 'react'

interface IncomeData {
  additionalIncome: string
  additionalIncomeSource: string
  bankName: string
  accountNumber: string
  ifscCode: string
  branchName: string
  accountType: string
  monthlyRent: string
  propertyOwnership: string
  existingEMIs: string
  emiDetails: string
  creditCardLimit: string
  creditCardOutstanding: string
  monthlyFamilyIncome: string
  otherDebts: string
  creditScore: string
  bankStatementMonths: string
  salaryAccount: boolean
  otherBankAccounts: string
}

interface IncomeStepProps {
  data: IncomeData
  onUpdate: (data: IncomeData) => void
}

export function IncomeStep({ data, onUpdate }: IncomeStepProps) {
  const [formData, setFormData] = useState<IncomeData>({
    additionalIncome: data.additionalIncome || '',
    additionalIncomeSource: data.additionalIncomeSource || '',
    bankName: data.bankName || '',
    accountNumber: data.accountNumber || '',
    ifscCode: data.ifscCode || '',
    branchName: data.branchName || '',
    accountType: data.accountType || '',
    monthlyRent: data.monthlyRent || '',
    propertyOwnership: data.propertyOwnership || '',
    existingEMIs: data.existingEMIs || '',
    emiDetails: data.emiDetails || '',
    creditCardLimit: data.creditCardLimit || '',
    creditCardOutstanding: data.creditCardOutstanding || '',
    monthlyFamilyIncome: data.monthlyFamilyIncome || '',
    otherDebts: data.otherDebts || '',
    creditScore: data.creditScore || '',
    bankStatementMonths: data.bankStatementMonths || '',
    salaryAccount: data.salaryAccount || false,
    otherBankAccounts: data.otherBankAccounts || ''
  })

  useEffect(() => {
    onUpdate(formData)
  }, [formData, onUpdate])

  const handleChange = (field: keyof IncomeData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatCurrency = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, '')
    if (cleaned) {
      return new Intl.NumberFormat('en-IN').format(parseInt(cleaned))
    }
    return cleaned
  }

  const formatIFSC = (value: string) => {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Monthly Income (₹)
          </label>
          <input
            type="text"
            value={formData.additionalIncome}
            onChange={(e) => handleChange('additionalIncome', formatCurrency(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="₹ 10,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Income Source
          </label>
          <input
            type="text"
            value={formData.additionalIncomeSource}
            onChange={(e) => handleChange('additionalIncomeSource', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Part-time job, investments, rental income"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Name *
          </label>
          <select
            value={formData.bankName}
            onChange={(e) => handleChange('bankName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select Bank</option>
            <option value="SBI">State Bank of India (SBI)</option>
            <option value="HDFC">HDFC Bank</option>
            <option value="ICICI">ICICI Bank</option>
            <option value="Axis">Axis Bank</option>
            <option value="Kotak">Kotak Mahindra Bank</option>
            <option value="PNB">Punjab National Bank (PNB)</option>
            <option value="Canara">Canara Bank</option>
            <option value="Bank of Baroda">Bank of Baroda</option>
            <option value="Union Bank">Union Bank of India</option>
            <option value="IDBI">IDBI Bank</option>
            <option value="Yes Bank">Yes Bank</option>
            <option value="Federal Bank">Federal Bank</option>
            <option value="Karnataka Bank">Karnataka Bank</option>
            <option value="South Indian Bank">South Indian Bank</option>
            <option value="IDFC">IDFC First Bank</option>
            <option value="RBL">RBL Bank</option>
            <option value="Bandhan">Bandhan Bank</option>
            <option value="AU Small Finance">AU Small Finance Bank</option>
            <option value="Equitas Small Finance">Equitas Small Finance Bank</option>
            <option value="Ujjivan Small Finance">Ujjivan Small Finance Bank</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Number *
          </label>
          <input
            type="password"
            value={formData.accountNumber}
            onChange={(e) => handleChange('accountNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Account Number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IFSC Code *
          </label>
          <input
            type="text"
            value={formData.ifscCode}
            onChange={(e) => handleChange('ifscCode', formatIFSC(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="SBIN0001234"
            maxLength={11}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Branch Name *
          </label>
          <input
            type="text"
            value={formData.branchName}
            onChange={(e) => handleChange('branchName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Andheri West Branch"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Type *
          </label>
          <select
            value={formData.accountType}
            onChange={(e) => handleChange('accountType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select Account Type</option>
            <option value="savings">Savings Account</option>
            <option value="current">Current Account</option>
            <option value="salary">Salary Account</option>
            <option value="fixed-deposit">Fixed Deposit</option>
            <option value="recurring-deposit">Recurring Deposit</option>
            <option value="nro">NRO Account</option>
            <option value="nre">NRE Account</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="salaryAccount"
            checked={formData.salaryAccount}
            onChange={(e) => handleChange('salaryAccount', e.target.checked)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="salaryAccount" className="ml-2 block text-sm text-gray-700">
            This is my salary account
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Rent/Mortgage Payment (₹)
          </label>
          <input
            type="text"
            value={formData.monthlyRent}
            onChange={(e) => handleChange('monthlyRent', formatCurrency(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="₹ 15,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Ownership Status
          </label>
          <select
            value={formData.propertyOwnership}
            onChange={(e) => handleChange('propertyOwnership', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select Status</option>
            <option value="own">Own</option>
            <option value="rent">Rent</option>
            <option value="family">Family Property</option>
            <option value="paying-guest">Paying Guest</option>
            <option value="company-accommodation">Company Accommodation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Existing Monthly EMIs (₹)
          </label>
          <input
            type="text"
            value={formData.existingEMIs}
            onChange={(e) => handleChange('existingEMIs', formatCurrency(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="₹ 5,000"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            EMI Details (if any)
          </label>
          <textarea
            value={formData.emiDetails}
            onChange={(e) => handleChange('emiDetails', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Home Loan: ₹15,000/month, Personal Loan: ₹8,000/month"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credit Card Limit (₹)
          </label>
          <input
            type="text"
            value={formData.creditCardLimit}
            onChange={(e) => handleChange('creditCardLimit', formatCurrency(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="₹ 50,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credit Card Outstanding (₹)
          </label>
          <input
            type="text"
            value={formData.creditCardOutstanding}
            onChange={(e) => handleChange('creditCardOutstanding', formatCurrency(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="₹ 10,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Family Income (₹)
          </label>
          <input
            type="text"
            value={formData.monthlyFamilyIncome}
            onChange={(e) => handleChange('monthlyFamilyIncome', formatCurrency(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="₹ 75,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Other Monthly Debts (₹)
          </label>
          <input
            type="text"
            value={formData.otherDebts}
            onChange={(e) => handleChange('otherDebts', formatCurrency(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="₹ 2,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Credit Score
          </label>
          <select
            value={formData.creditScore}
            onChange={(e) => handleChange('creditScore', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select Range</option>
            <option value="excellent">Excellent (750-900)</option>
            <option value="good">Good (700-749)</option>
            <option value="fair">Fair (650-699)</option>
            <option value="poor">Poor (300-649)</option>
            <option value="unknown">Don't Know</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Statements Available (Months)
          </label>
          <select
            value={formData.bankStatementMonths}
            onChange={(e) => handleChange('bankStatementMonths', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select Months</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
            <option value="more">More than 12 Months</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Other Bank Accounts (if any)
          </label>
          <textarea
            value={formData.otherBankAccounts}
            onChange={(e) => handleChange('otherBankAccounts', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="List other bank accounts with bank name and account type"
            rows={2}
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Bank Verification:</strong> We will verify your bank details through our secure banking partners. 
          Please ensure IFSC code and account details are accurate.
        </p>
      </div>
    </div>
  )
} 