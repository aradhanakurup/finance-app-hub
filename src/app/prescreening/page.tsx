"use client"

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PrescreeningDashboard } from '@/components/prescreening/PrescreeningDashboard'
import { Fin5Logo } from '@/components/Fin5Logo'

export default function PrescreeningPage() {
  const [showForm, setShowForm] = useState(true)
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      aadhaar: '',
      pan: '',
      dateOfBirth: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: ''
      }
    },
    employment: {
      employmentType: 'SALARIED',
      companyName: '',
      designation: '',
      monthlyIncome: 0,
      experience: 0
    },
    expenses: {
      rent: 0,
      utilities: 0,
      food: 0,
      transportation: 0,
      healthcare: 0,
      other: 0
    },
    vehicle: {
      make: '',
      model: '',
      year: 2024,
      variant: '',
      price: 0,
      downPayment: 0,
      loanAmount: 0,
      tenure: 60
    }
  })

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        address: {
          ...prev.personalInfo.address,
          [field]: value
        }
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowForm(false)
  }

  const handlePrescreeningComplete = (results: any) => {
    console.log('Prescreening completed:', results)
    // Store prescreening results in localStorage for the main application
    localStorage.setItem('prescreeningResults', JSON.stringify(results))
    localStorage.setItem('prescreeningFormData', JSON.stringify(formData))
    
    // Redirect to main application with prescreening data
    window.location.href = '/?prescreening=true'
  }

  if (!showForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <PrescreeningDashboard
              customerData={formData}
              vehicleData={formData.vehicle}
              financialData={{
                monthlyIncome: formData.employment.monthlyIncome,
                existingEmis: 0,
                creditScore: 700 // Default for demo
              }}
              onComplete={handlePrescreeningComplete}
            />
            <div className="text-center mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit Information
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="mb-4">
              <Fin5Logo size="lg" showTagline={true} />
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-4">
              Quick Loan Eligibility Check
            </h1>
            <p className="text-blue-700">
              Get instant insights into your loan eligibility without a full application
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.personalInfo.firstName}
                    onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.personalInfo.lastName}
                    onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                  <input
                    type="text"
                    value={formData.personalInfo.pan}
                    onChange={(e) => handleInputChange('personalInfo', 'pan', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ABCDE1234F"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                  <input
                    type="text"
                    value={formData.personalInfo.aadhaar}
                    onChange={(e) => handleInputChange('personalInfo', 'aadhaar', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123412341234"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <select
                    value={formData.employment.employmentType}
                    onChange={(e) => handleInputChange('employment', 'employmentType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="SALARIED">Salaried</option>
                    <option value="SELF_EMPLOYED">Self Employed</option>
                    <option value="BUSINESS_OWNER">Business Owner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income (₹)</label>
                  <input
                    type="number"
                    value={formData.employment.monthlyIncome}
                    onChange={(e) => handleInputChange('employment', 'monthlyIncome', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.employment.companyName}
                    onChange={(e) => handleInputChange('employment', 'companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={formData.employment.experience}
                    onChange={(e) => handleInputChange('employment', 'experience', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Monthly Expenses */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expenses</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rent/Housing (₹)</label>
                  <input
                    type="number"
                    value={formData.expenses?.rent || 0}
                    onChange={(e) => handleInputChange('expenses', 'rent', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Utilities (₹)</label>
                  <input
                    type="number"
                    value={formData.expenses?.utilities || 0}
                    onChange={(e) => handleInputChange('expenses', 'utilities', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food & Groceries (₹)</label>
                  <input
                    type="number"
                    value={formData.expenses?.food || 0}
                    onChange={(e) => handleInputChange('expenses', 'food', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transportation (₹)</label>
                  <input
                    type="number"
                    value={formData.expenses?.transportation || 0}
                    onChange={(e) => handleInputChange('expenses', 'transportation', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Healthcare (₹)</label>
                  <input
                    type="number"
                    value={formData.expenses?.healthcare || 0}
                    onChange={(e) => handleInputChange('expenses', 'healthcare', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Expenses (₹)</label>
                  <input
                    type="number"
                    value={formData.expenses?.other || 0}
                    onChange={(e) => handleInputChange('expenses', 'other', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Total Monthly Expenses:</strong> ₹{(
                    (formData.expenses?.rent || 0) +
                    (formData.expenses?.utilities || 0) +
                    (formData.expenses?.food || 0) +
                    (formData.expenses?.transportation || 0) +
                    (formData.expenses?.healthcare || 0) +
                    (formData.expenses?.other || 0)
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Make</label>
                  <input
                    type="text"
                    value={formData.vehicle.make}
                    onChange={(e) => handleInputChange('vehicle', 'make', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Maruti, Hyundai, Honda"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    value={formData.vehicle.model}
                    onChange={(e) => handleInputChange('vehicle', 'model', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Swift, i20, City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Price (₹)</label>
                  <input
                    type="number"
                    value={formData.vehicle.price}
                    onChange={(e) => handleInputChange('vehicle', 'price', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment (₹)</label>
                  <input
                    type="number"
                    value={formData.vehicle.downPayment}
                    onChange={(e) => handleInputChange('vehicle', 'downPayment', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.vehicle.loanAmount}
                    onChange={(e) => handleInputChange('vehicle', 'loanAmount', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tenure (Months)</label>
                  <input
                    type="number"
                    value={formData.vehicle.tenure}
                    onChange={(e) => handleInputChange('vehicle', 'tenure', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="text-center pt-6">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Check Eligibility
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
} 