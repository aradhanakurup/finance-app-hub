"use client"

import { useState } from 'react'
import { StepIndicator } from './StepIndicator'
import { PersonalInfoStep } from './steps/PersonalInfoStep'
import { EmploymentStep } from './steps/EmploymentStep'
import { IncomeStep } from './steps/IncomeStep'
import { ReferencesStep } from './steps/ReferencesStep'
import { VehicleStep } from './steps/VehicleStep'
import { DocumentUploadStep } from './steps/DocumentUploadStep'
import LenderSelection from './lender-integration/LenderSelection'
import { ReviewStep } from './steps/ReviewStep'

interface ApplicationWizardProps {
  currentStep: number
  onStepChange: (step: number) => void
  applicationData: any
  onDataUpdate: (data: any, step: string) => void
}

const steps = [
  { id: 1, title: 'Personal Info', description: 'KYC & Basic Details' },
  { id: 2, title: 'Employment', description: 'Work & Company Details' },
  { id: 3, title: 'Income', description: 'Financial Information' },
  { id: 4, title: 'References', description: 'Personal References' },
  { id: 5, title: 'Vehicle', description: 'Car & Loan Details' },
  { id: 6, title: 'Documents', description: 'Upload & Verification' },
  { id: 7, title: 'Lenders', description: 'Select Lenders' },
  { id: 8, title: 'Review', description: 'Final Review' }
]

export function ApplicationWizard({ 
  currentStep, 
  onStepChange, 
  applicationData, 
  onDataUpdate 
}: ApplicationWizardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = () => {
    if (currentStep < steps.length) {
      onStepChange(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Generate application ID
      const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Prepare application data for submission
      const submissionData = {
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

      // Submit to multiple lenders
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()
      
      if (result.success) {
        alert(`Application submitted successfully to ${result.data.submittedLenders.length} lenders! Application ID: ${applicationId}`)
        // Reset to step 1
        onStepChange(1)
      } else {
        throw new Error(result.message || 'Submission failed')
      }
    } catch (error) {
      alert(`Error submitting application: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={applicationData.personalInfo}
            onUpdate={(data) => onDataUpdate(data, 'personalInfo')}
          />
        )
      case 2:
        return (
          <EmploymentStep
            data={applicationData.employment}
            onUpdate={(data) => onDataUpdate(data, 'employment')}
          />
        )
      case 3:
        return (
          <IncomeStep
            data={applicationData.income}
            onUpdate={(data) => onDataUpdate(data, 'income')}
          />
        )
      case 4:
        return (
          <ReferencesStep
            data={applicationData.references}
            onUpdate={(data) => onDataUpdate(data, 'references')}
          />
        )
      case 5:
        return (
          <VehicleStep
            data={applicationData.vehicle}
            onUpdate={(data) => onDataUpdate(data, 'vehicle')}
          />
        )
      case 6:
        return (
          <DocumentUploadStep
            data={applicationData.documents}
            onUpdate={(data) => onDataUpdate(data, 'documents')}
          />
        )
      case 7:
        return (
          <LenderSelection
            selectedLenders={applicationData.selectedLenders || []}
            onLenderSelectionChange={(lenderIds) => onDataUpdate(lenderIds, 'selectedLenders')}
            customerData={applicationData.personalInfo}
            vehicleData={applicationData.vehicle}
            financialData={applicationData.income}
          />
        )
      case 8:
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <StepIndicator 
        steps={steps} 
        currentStep={currentStep} 
        onStepClick={onStepChange}
      />
      
      <div className="mt-8">
        {renderCurrentStep()}
      </div>
      
      <div className="flex justify-between mt-8 pt-6 border-t">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        {currentStep < steps.length ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        )}
      </div>
    </div>
  )
} 