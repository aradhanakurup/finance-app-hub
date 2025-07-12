"use client"

import { useState, useEffect } from 'react'

interface ValidationResult {
  isValid: boolean
  confidence: number
  extractedData: any
  errors: string[]
  warnings: string[]
}

interface DocumentValidationProps {
  file: File
  documentType: string
  onValidationComplete: (result: ValidationResult) => void
  onError: (error: string) => void
}

export function DocumentValidation({ 
  file, 
  documentType, 
  onValidationComplete, 
  onError 
}: DocumentValidationProps) {
  const [isValidating, setIsValidating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')

  useEffect(() => {
    validateDocument()
  }, [file, documentType])

  const validateDocument = async () => {
    setIsValidating(true)
    setProgress(0)
    
    try {
      // Step 1: File validation
      setCurrentStep('Validating file format...')
      setProgress(10)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const fileValidation = await validateFileFormat(file)
      if (!fileValidation.isValid) {
        onError(fileValidation.errors.join(', '))
        return
      }

      // Step 2: Image quality check
      setCurrentStep('Checking image quality...')
      setProgress(30)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const qualityCheck = await checkImageQuality(file)
      if (!qualityCheck.isValid) {
        onError(qualityCheck.errors.join(', '))
        return
      }

      // Step 3: OCR processing
      setCurrentStep('Extracting text (OCR)...')
      setProgress(60)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const ocrResult = await performOCR(file, documentType)

      // Step 4: Document-specific validation
      setCurrentStep('Validating document content...')
      setProgress(80)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const documentValidation = await validateDocumentContent(ocrResult, documentType)

      // Step 5: Final validation
      setCurrentStep('Final verification...')
      setProgress(100)
      await new Promise(resolve => setTimeout(resolve, 500))

      const finalResult: ValidationResult = {
        isValid: documentValidation.isValid,
        confidence: documentValidation.confidence,
        extractedData: ocrResult.extractedData,
        errors: documentValidation.errors,
        warnings: documentValidation.warnings
      }

      onValidationComplete(finalResult)

    } catch (error) {
      onError('Validation failed. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  const validateFileFormat = async (file: File): Promise<ValidationResult> => {
    const errors: string[] = []
    const warnings: string[] = []

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errors.push('File size exceeds 5MB limit')
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not supported. Please upload JPG, PNG, or PDF files.')
    }

    return {
      isValid: errors.length === 0,
      confidence: 1.0,
      extractedData: {},
      errors,
      warnings
    }
  }

  const checkImageQuality = async (file: File): Promise<ValidationResult> => {
    const errors: string[] = []
    const warnings: string[] = []

    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        // Check image dimensions
        if (img.width < 800 || img.height < 600) {
          warnings.push('Image resolution is low. Higher resolution may improve OCR accuracy.')
        }

        // Simulate blur detection
        const isBlurry = Math.random() < 0.1 // 10% chance of being blurry
        if (isBlurry) {
          errors.push('Image appears to be blurry. Please retake with better focus.')
        }

        resolve({
          isValid: errors.length === 0,
          confidence: 0.9,
          extractedData: {},
          errors,
          warnings
        })
      }
      img.onerror = () => {
        resolve({
          isValid: false,
          confidence: 0,
          extractedData: {},
          errors: ['Failed to load image for quality check'],
          warnings: []
        })
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const performOCR = async (file: File, documentType: string): Promise<any> => {
    // Simulate OCR processing with document-specific extraction
    const extractedData: any = {}

    switch (documentType) {
      case 'aadhaar-front':
        extractedData.aadhaarNumber = '123456789012'
        extractedData.name = 'John Doe'
        extractedData.photo = 'detected'
        extractedData.dateOfBirth = '01/01/1990'
        break

      case 'aadhaar-back':
        extractedData.address = '123 Main Street, Mumbai, Maharashtra 400001'
        extractedData.pinCode = '400001'
        break

      case 'pan-card':
        extractedData.panNumber = 'ABCDE1234F'
        extractedData.name = 'John Doe'
        extractedData.dateOfBirth = '01/01/1990'
        break

      case 'salary-slips':
        extractedData.employerName = 'ABC Company Ltd'
        extractedData.salary = '₹50,000'
        extractedData.date = 'March 2024'
        extractedData.employeeName = 'John Doe'
        break

      case 'bank-statements':
        extractedData.accountNumber = '1234567890'
        extractedData.accountHolder = 'John Doe'
        extractedData.bankName = 'State Bank of India'
        extractedData.balance = '₹1,50,000'
        break

      default:
        extractedData.text = 'Document text extracted successfully'
    }

    return {
      extractedData,
      confidence: 0.85 + Math.random() * 0.1 // 85-95% confidence
    }
  }

  const validateDocumentContent = async (ocrResult: any, documentType: string): Promise<ValidationResult> => {
    const errors: string[] = []
    const warnings: string[] = []
    let isValid = true
    let confidence = ocrResult.confidence

    const { extractedData } = ocrResult

    switch (documentType) {
      case 'aadhaar-front':
        // Validate Aadhaar number format (12 digits)
        if (!extractedData.aadhaarNumber || !/^\d{12}$/.test(extractedData.aadhaarNumber)) {
          errors.push('Invalid Aadhaar number format. Must be 12 digits.')
          isValid = false
        }
        
        if (!extractedData.name) {
          errors.push('Name not detected in Aadhaar card.')
          isValid = false
        }

        if (!extractedData.photo) {
          warnings.push('Photo not clearly detected. Please ensure photo is visible.')
        }
        break

      case 'aadhaar-back':
        if (!extractedData.address) {
          errors.push('Address not detected in Aadhaar card.')
          isValid = false
        }

        if (!extractedData.pinCode || !/^\d{6}$/.test(extractedData.pinCode)) {
          warnings.push('PIN code not detected or invalid format.')
        }
        break

      case 'pan-card':
        // Validate PAN number format (10 characters: 5 letters + 4 digits + 1 letter)
        if (!extractedData.panNumber || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(extractedData.panNumber)) {
          errors.push('Invalid PAN number format.')
          isValid = false
        }

        if (!extractedData.name) {
          errors.push('Name not detected in PAN card.')
          isValid = false
        }
        break

      case 'salary-slips':
        if (!extractedData.employerName) {
          errors.push('Employer name not detected.')
          isValid = false
        }

        if (!extractedData.salary) {
          errors.push('Salary amount not detected.')
          isValid = false
        }

        if (!extractedData.date) {
          warnings.push('Date not clearly detected.')
        }
        break

      case 'bank-statements':
        if (!extractedData.accountNumber) {
          errors.push('Account number not detected.')
          isValid = false
        }

        if (!extractedData.bankName) {
          warnings.push('Bank name not detected.')
        }

        if (!extractedData.balance) {
          warnings.push('Account balance not detected.')
        }
        break
    }

    // Check confidence threshold
    if (confidence < 0.7) {
      warnings.push('Low confidence in text extraction. Please ensure document is clear and well-lit.')
    }

    return {
      isValid,
      confidence,
      extractedData,
      errors,
      warnings
    }
  }

  if (!isValidating) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Validating Document
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            {currentStep}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-xs text-gray-500">
            {progress}% Complete
          </p>
        </div>
      </div>
    </div>
  )
} 