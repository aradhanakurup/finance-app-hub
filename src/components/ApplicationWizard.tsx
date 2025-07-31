"use client"

import { useState } from 'react'
import { StepIndicator } from './StepIndicator'
import { PersonalInfoStep } from './steps/PersonalInfoStep'
import { EmploymentStep } from './steps/EmploymentStep'
import { IncomeStep } from './steps/IncomeStep'
import { ExpensesStep } from './steps/ExpensesStep'
import { ReferencesStep } from './steps/ReferencesStep'
import { VehicleStep } from './steps/VehicleStep'
import { PrescreeningStep } from './steps/PrescreeningStep'
import { DocumentUploadStep } from './steps/DocumentUploadStep'
import { InsuranceStep } from './steps/InsuranceStep'
import { PaymentStep } from './steps/PaymentStep'
import LenderSelection from './lender-integration/LenderSelection'
import { ReviewStep } from './steps/ReviewStep'
import { EnhancedApplicationView } from './application/EnhancedApplicationView'

interface ApplicationWizardProps {
  currentStep?: number
  onStepChange?: (step: number) => void
  applicationData: any
  onDataUpdate?: (data: any, step: string) => void
  setApplicationData?: (data: any) => void
  isDealerMode?: boolean
}

export function ApplicationWizard({ 
  currentStep = 1, 
  onStepChange, 
  applicationData, 
  onDataUpdate,
  setApplicationData,
  isDealerMode = false
}: ApplicationWizardProps) {
  const [internalCurrentStep, setInternalCurrentStep] = useState(currentStep)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Define steps array inside component
  const steps = [
    { id: 1, title: 'Personal Info', description: 'KYC & Basic Details' },
    { id: 2, title: 'Employment', description: 'Work & Company Details' },
    { id: 3, title: 'Income', description: 'Financial Information' },
    { id: 4, title: 'Expenses', description: 'Monthly Expenses' },
    { id: 5, title: 'References', description: 'Personal References' },
    { id: 6, title: 'Vehicle', description: 'Car & Loan Details' },
    { id: 7, title: 'Data Enhancement', description: 'Signzy Verification' },
    { id: 8, title: 'Prescreening', description: 'Eligibility Analysis' },
    { id: 9, title: 'Documents', description: 'Upload & Verification' },
    { id: 10, title: 'Insurance', description: 'Loan Protection' },
    { id: 11, title: 'Payment', description: 'Pay & Process' },
    { id: 12, title: 'Lenders', description: 'Select Lenders' },
    { id: 13, title: 'Review', description: 'Final Review' }
  ]

  // Use internal state if no external control provided
  const currentStepValue = onStepChange ? currentStep : internalCurrentStep
  const handleStepChange = onStepChange || setInternalCurrentStep
  
  // Default data update function
  const handleDataUpdate = onDataUpdate || ((data: any, step: string) => {
    if (setApplicationData) {
      setApplicationData({
        ...applicationData,
        [step]: data
      })
    }
  })

  const handleNext = () => {
    if (currentStepValue < steps.length) {
      handleStepChange(currentStepValue + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStepValue > 1) {
      handleStepChange(currentStepValue - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Generate application ID
      const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      let submissionData: any

      if (isDealerMode) {
        // Format data for dealer API
        submissionData = {
          quickReference: `QR-${Date.now()}`,
          customerInfo: {
            firstName: applicationData.personalInfo?.firstName || '',
            lastName: applicationData.personalInfo?.lastName || '',
            email: applicationData.personalInfo?.email || '',
            phone: applicationData.personalInfo?.phone || '',
            aadhaar: applicationData.personalInfo?.aadhaar || '',
            pan: applicationData.personalInfo?.pan || '',
            dateOfBirth: applicationData.personalInfo?.dateOfBirth || '',
            address: {
              street: applicationData.personalInfo?.address?.street || '',
              city: applicationData.personalInfo?.address?.city || '',
              state: applicationData.personalInfo?.address?.state || '',
              pincode: applicationData.personalInfo?.address?.pincode || '',
            },
          },
          employment: {
            employmentType: applicationData.employment?.employmentType || 'SALARIED',
            companyName: applicationData.employment?.companyName || '',
            designation: applicationData.employment?.designation || '',
            monthlyIncome: applicationData.income?.monthlyIncome || 0,
            experience: applicationData.employment?.experience || 0,
          },
          expenses: {
            rent: applicationData.expenses?.rent || 0,
            utilities: applicationData.expenses?.utilities || 0,
            food: applicationData.expenses?.food || 0,
            transportation: applicationData.expenses?.transportation || 0,
            healthcare: applicationData.expenses?.healthcare || 0,
            other: applicationData.expenses?.other || 0,
          },
          vehicle: {
            make: applicationData.vehicle?.make || '',
            model: applicationData.vehicle?.model || '',
            year: applicationData.vehicle?.year || new Date().getFullYear(),
            variant: applicationData.vehicle?.variant || '',
            price: applicationData.vehicle?.price || 0,
            downPayment: applicationData.vehicle?.downPayment || 0,
            loanAmount: applicationData.vehicle?.loanAmount || 0,
            tenure: applicationData.vehicle?.tenure || 60,
          },
          dealerNotes: 'Application submitted via dealer portal',
          dealerId: 'DEALER-001',
          submittedBy: 'Dealer Portal',
        }
      } else {
        // Format data for main application API
        submissionData = {
          applicationId,
          customerData: {
            personalInfo: applicationData.personalInfo,
            employmentInfo: applicationData.employment,
            financialInfo: applicationData.income,
          },
          vehicleData: applicationData.vehicle,
          financialData: {
            requestedAmount: applicationData.vehicle?.loanAmount || 0,
            tenure: applicationData.vehicle?.tenure || 0,
            downPayment: applicationData.vehicle?.downPayment || 0,
            monthlyIncome: applicationData.income?.monthlyIncome || 0,
            existingEmis: applicationData.income?.existingEmis || 0,
            creditScore: applicationData.income?.creditScore || 0,
          },
          documents: applicationData.documents || [],
          selectedLenders: applicationData.selectedLenders || [],
        }
      }

      // Use dealer API if in dealer mode
      const apiEndpoint = isDealerMode ? '/api/dealer/applications/submit' : '/api/applications/submit'

      // Submit to multiple lenders
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()
      
      if (result.success) {
        const message = isDealerMode 
          ? `Application submitted successfully! Application ID: ${applicationId}`
          : `Application submitted successfully to ${result.data.submittedLenders.length} lenders! Application ID: ${applicationId}`
        
        alert(message)
        // Reset to step 1
        handleStepChange(1)
      } else {
        throw new Error(result.message || 'Submission failed')
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert(`Submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStepValue) {
      case 1:
        return (
          <PersonalInfoStep
            data={applicationData.personalInfo}
            onUpdate={(data) => handleDataUpdate(data, 'personalInfo')}
          />
        )
      case 2:
        return (
          <EmploymentStep
            data={applicationData.employment}
            onUpdate={(data) => handleDataUpdate(data, 'employment')}
          />
        )
      case 3:
        return (
          <IncomeStep
            data={applicationData.income}
            onUpdate={(data) => handleDataUpdate(data, 'income')}
          />
        )
      case 4:
        return (
          <ExpensesStep
            data={applicationData.expenses}
            onUpdate={(data) => handleDataUpdate(data, 'expenses')}
          />
        )
      case 5:
        return (
          <ReferencesStep
            data={applicationData.references}
            onUpdate={(data) => handleDataUpdate(data, 'references')}
          />
        )
      case 6:
        return (
          <VehicleStep
            data={applicationData.vehicle}
            onUpdate={(data) => handleDataUpdate(data, 'vehicle')}
          />
        )
      case 7:
        return (
          <EnhancedApplicationView
            applicationData={applicationData}
            onEnhance={(data) => handleDataUpdate(data, 'enhancedData')}
          />
        )
      case 8:
        return (
          <PrescreeningStep
            data={applicationData.prescreening}
            onUpdate={(data) => handleDataUpdate(data, 'prescreening')}
            applicationData={applicationData}
          />
        )
      case 9:
        return (
          <DocumentUploadStep
            data={applicationData.documents}
            onUpdate={(data) => handleDataUpdate(data, 'documents')}
          />
        )
      case 10:
        return (
          <InsuranceStep
            applicationData={applicationData}
            onDataUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 11:
        return (
          <PaymentStep
            applicationData={applicationData}
            onDataUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 12:
        return (
          <LenderSelection
            selectedLenders={applicationData.selectedLenders || []}
            onLenderSelectionChange={(lenderIds) => handleDataUpdate(lenderIds, 'selectedLenders')}
            customerData={{
              personalInfo: applicationData.personalInfo,
              employmentInfo: applicationData.employment,
              financialInfo: applicationData.income,
            }}
            vehicleData={applicationData.vehicle}
            financialData={{
              requestedAmount: applicationData.vehicle?.loanAmount || 0,
              tenure: applicationData.vehicle?.tenure || 60,
              downPayment: applicationData.vehicle?.downPayment || 0,
              monthlyIncome: applicationData.income?.monthlyIncome || 0,
              existingEmis: applicationData.income?.existingEmis || 0,
              creditScore: applicationData.income?.creditScore || 750,
            }}
          />
        )
      case 13:
        return (
          <ReviewStep
            applicationData={applicationData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )
      default:
        return <div>Step not found</div>
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <StepIndicator 
        steps={steps}
        currentStep={currentStepValue} 
        onStepClick={handleStepChange}
      />
      
      <div className="mt-8">
        {renderCurrentStep()}
      </div>

      <div className="mt-8 flex justify-between">
        <div className="flex space-x-3">
          <button
            onClick={handlePrevious}
            disabled={currentStepValue === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {isDealerMode && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to cancel this application? All entered data will be lost.')) {
                  window.location.href = '/dealer/dashboard';
                }
              }}
              className="px-6 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50"
            >
              Cancel Application
            </button>
          )}
        </div>

        {currentStepValue === steps.length ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : (isDealerMode ? 'Submit Application' : 'Submit to Lenders')}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
} 