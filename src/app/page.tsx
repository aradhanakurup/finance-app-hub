"use client"

import { useState, useEffect } from 'react'
import { ApplicationWizard } from '@/components/ApplicationWizard'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Fin5Logo } from '@/components/Fin5Logo'

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [applicationData, setApplicationData] = useState({
    personalInfo: {},
    employment: {},
    income: {},
    expenses: {},
    references: {},
    vehicle: {},
    enhancedData: {},
    prescreening: {},
    documents: {}
  })

  // Check for prescreening data on component mount
  useEffect(() => {
    const prescreeningResults = localStorage.getItem('prescreeningResults')
    const prescreeningFormData = localStorage.getItem('prescreeningFormData')
    
    if (prescreeningResults && prescreeningFormData) {
      try {
        const results = JSON.parse(prescreeningResults)
        const formData = JSON.parse(prescreeningFormData)
        
        // Pre-populate application data with prescreening information
        setApplicationData(prev => ({
          ...prev,
          personalInfo: {
            firstName: formData.personalInfo?.firstName || '',
            lastName: formData.personalInfo?.lastName || '',
            email: formData.personalInfo?.email || '',
            phone: formData.personalInfo?.phone || '',
            aadhaar: formData.personalInfo?.aadhaar || '',
            pan: formData.personalInfo?.pan || '',
            dateOfBirth: formData.personalInfo?.dateOfBirth || '',
            address: formData.personalInfo?.address || {}
          },
          employment: {
            employmentType: formData.employment?.employmentType || 'SALARIED',
            companyName: formData.employment?.companyName || '',
            designation: formData.employment?.designation || '',
            monthlyIncome: formData.employment?.monthlyIncome || 0,
            experience: formData.employment?.experience || 0
          },
          income: {
            monthlyIncome: formData.employment?.monthlyIncome || 0,
            creditScore: results.customCreditScore?.customScore || 700,
            existingEmis: 0
          },
          expenses: {
            rent: formData.expenses?.rent || 0,
            utilities: formData.expenses?.utilities || 0,
            food: formData.expenses?.food || 0,
            transportation: formData.expenses?.transportation || 0,
            healthcare: formData.expenses?.healthcare || 0,
            other: formData.expenses?.other || 0,
            existingEmis: 0
          },
          vehicle: {
            make: formData.vehicle?.make || '',
            model: formData.vehicle?.model || '',
            year: formData.vehicle?.year || 2024,
            variant: formData.vehicle?.variant || '',
            price: formData.vehicle?.price || 0,
            downPayment: formData.vehicle?.downPayment || 0,
            loanAmount: formData.vehicle?.loanAmount || 0,
            tenure: formData.vehicle?.tenure || 60
          },
          prescreening: results
        }))
        
        // Clear prescreening data from localStorage
        localStorage.removeItem('prescreeningResults')
        localStorage.removeItem('prescreeningFormData')
        
        // Show success message
        alert('Prescreening data loaded successfully! Your application has been pre-filled with your eligibility check information.')
        
      } catch (error) {
        console.error('Error loading prescreening data:', error)
      }
    }
  }, [])

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
  }

  const handleDataUpdate = (stepData: any, step: string) => {
    setApplicationData(prev => ({
      ...prev,
      [step]: stepData
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="flex justify-center mb-4">
                <Fin5Logo size="lg" showTagline={true} />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-blue-900 mb-4">
              Fin5
            </h1>
            <p className="text-xl text-blue-700 mb-4">
              Streamline your financing process with leading Indian banks and NBFCs
            </p>
            <p className="text-lg text-blue-600 mb-4 font-medium">
              Finance. Fast. Five minutes flat.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                RBI Compliant
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                KYC Verified
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Multi-Lender Support
              </span>
            </div>
            
            {/* Quick Check CTA */}
            <div className="mb-8">
              <a
                href="/prescreening"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quick Eligibility Check
              </a>
              <p className="text-sm text-gray-500 mt-2">Get instant loan eligibility without full application</p>
            </div>
            
            {/* Admin Dashboard Link */}
            <div className="mt-6">
              <a
                href="/admin"
                className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Admin Dashboard
              </a>
            </div>
          </div>

          <ApplicationWizard
            currentStep={currentStep}
            onStepChange={handleStepChange}
            applicationData={applicationData}
            onDataUpdate={handleDataUpdate}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
