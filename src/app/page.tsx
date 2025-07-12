"use client"

import { useState } from 'react'
import { ApplicationWizard } from '@/components/ApplicationWizard'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [applicationData, setApplicationData] = useState({
    personalInfo: {},
    employment: {},
    income: {},
    references: {},
    vehicle: {},
    documents: {}
  })

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
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-3xl">🚗</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Indian Auto Finance Hub
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Streamline your car financing process with leading Indian banks and NBFCs
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                RBI Compliant
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                KYC Verified
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Multi-Lender Support
              </span>
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
