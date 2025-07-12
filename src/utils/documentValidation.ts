// Document validation utilities for Indian Auto Finance Hub

export interface ValidationResult {
  isValid: boolean
  confidence: number
  extractedData: any
  errors: string[]
  warnings: string[]
}

export interface DocumentType {
  id: string
  name: string
  validationRules: {
    ocr?: string
    requiredFields?: string[]
    formatValidation?: any
  }
}

// Indian document validation patterns
export const INDIAN_DOCUMENT_PATTERNS = {
  aadhaar: /^\d{4}-\d{4}-\d{4}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  mobile: /^[6-9]\d{9}$/,
  pinCode: /^\d{6}$/,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  accountNumber: /^\d{9,18}$/
}

// Document type definitions with validation rules
export const DOCUMENT_TYPES: { [key: string]: DocumentType } = {
  'aadhaar-front': {
    id: 'aadhaar-front',
    name: 'Aadhaar Card (Front)',
    validationRules: {
      ocr: 'aadhaar',
      requiredFields: ['aadhaarNumber', 'name', 'photo'],
      formatValidation: {
        aadhaarNumber: INDIAN_DOCUMENT_PATTERNS.aadhaar
      }
    }
  },
  'aadhaar-back': {
    id: 'aadhaar-back',
    name: 'Aadhaar Card (Back)',
    validationRules: {
      ocr: 'aadhaar',
      requiredFields: ['address'],
      formatValidation: {
        pinCode: INDIAN_DOCUMENT_PATTERNS.pinCode
      }
    }
  },
  'pan-card': {
    id: 'pan-card',
    name: 'PAN Card',
    validationRules: {
      ocr: 'pan',
      requiredFields: ['panNumber', 'name'],
      formatValidation: {
        panNumber: INDIAN_DOCUMENT_PATTERNS.pan
      }
    }
  },
  'salary-slips': {
    id: 'salary-slips',
    name: 'Salary Slips',
    validationRules: {
      ocr: 'salary-slip',
      requiredFields: ['employerName', 'salary', 'date'],
      formatValidation: {
        salary: /^₹?\d{1,3}(,\d{3})*(\.\d{2})?$/
      }
    }
  },
  'bank-statements': {
    id: 'bank-statements',
    name: 'Bank Statements',
    validationRules: {
      ocr: 'bank-statement',
      requiredFields: ['accountNumber', 'transactions'],
      formatValidation: {
        accountNumber: INDIAN_DOCUMENT_PATTERNS.accountNumber
      }
    }
  }
}

// File validation functions
export const validateFileFormat = (file: File): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    errors.push(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 5MB limit`)
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type "${file.type}" not supported. Please upload JPG, PNG, or PDF files.`)
  }

  // Check file name
  if (file.name.length > 100) {
    warnings.push('File name is very long. Consider using a shorter name.')
  }

  return {
    isValid: errors.length === 0,
    confidence: errors.length === 0 ? 1.0 : 0.0,
    extractedData: {},
    errors,
    warnings
  }
}

// Image quality validation
export const validateImageQuality = async (file: File): Promise<ValidationResult> => {
  const errors: string[] = []
  const warnings: string[] = []

  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve({
        isValid: true, // Skip quality check for PDFs
        confidence: 1.0,
        extractedData: {},
        errors,
        warnings
      })
      return
    }

    const img = new Image()
    img.onload = () => {
      // Check minimum resolution
      const minWidth = 800
      const minHeight = 600
      
      if (img.width < minWidth || img.height < minHeight) {
        warnings.push(`Image resolution (${img.width}x${img.height}) is below recommended minimum (${minWidth}x${minHeight})`)
      }

      // Check aspect ratio (should be reasonable for documents)
      const aspectRatio = img.width / img.height
      if (aspectRatio < 0.5 || aspectRatio > 2.0) {
        warnings.push('Image aspect ratio seems unusual for a document')
      }

      // Simulate blur detection (in real implementation, use actual blur detection algorithm)
      const isBlurry = Math.random() < 0.1 // 10% chance for demo
      if (isBlurry) {
        errors.push('Image appears to be blurry. Please retake with better focus.')
      }

      resolve({
        isValid: errors.length === 0,
        confidence: errors.length === 0 ? 0.9 : 0.3,
        extractedData: {
          width: img.width,
          height: img.height,
          aspectRatio: aspectRatio.toFixed(2)
        },
        errors,
        warnings
      })
    }

    img.onerror = () => {
      resolve({
        isValid: false,
        confidence: 0.0,
        extractedData: {},
        errors: ['Failed to load image for quality analysis'],
        warnings: []
      })
    }

    img.src = URL.createObjectURL(file)
  })
}

// Simulate OCR processing
export const simulateOCR = async (file: File, documentType: string): Promise<any> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

  const extractedData: any = {}

  switch (documentType) {
    case 'aadhaar-front':
      extractedData.aadhaarNumber = '1234-5678-9012'
      extractedData.name = 'John Doe'
      extractedData.dateOfBirth = '01/01/1990'
      extractedData.photo = 'detected'
      extractedData.gender = 'Male'
      break

    case 'aadhaar-back':
      extractedData.address = '123 Main Street, Andheri West, Mumbai, Maharashtra 400058'
      extractedData.pinCode = '400058'
      extractedData.state = 'Maharashtra'
      extractedData.district = 'Mumbai'
      break

    case 'pan-card':
      extractedData.panNumber = 'ABCDE1234F'
      extractedData.name = 'John Doe'
      extractedData.dateOfBirth = '01/01/1990'
      extractedData.fatherName = 'Father Name'
      break

    case 'salary-slips':
      extractedData.employerName = 'ABC Company Ltd'
      extractedData.employeeName = 'John Doe'
      extractedData.salary = '₹50,000'
      extractedData.date = 'March 2024'
      extractedData.employeeId = 'EMP001'
      extractedData.department = 'IT'
      break

    case 'bank-statements':
      extractedData.accountNumber = '1234567890'
      extractedData.accountHolder = 'John Doe'
      extractedData.bankName = 'State Bank of India'
      extractedData.branch = 'Andheri West'
      extractedData.ifscCode = 'SBIN0001234'
      extractedData.balance = '₹1,50,000'
      extractedData.transactions = 'detected'
      break

    default:
      extractedData.text = 'Document text extracted successfully'
      extractedData.confidence = 0.85
  }

  return {
    extractedData,
    confidence: 0.85 + Math.random() * 0.1 // 85-95% confidence
  }
}

// Validate extracted data against document type rules
export const validateExtractedData = (extractedData: any, documentType: string): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []
  let isValid = true
  let confidence = 0.9

  const docType = DOCUMENT_TYPES[documentType]
  if (!docType) {
    return {
      isValid: false,
      confidence: 0.0,
      extractedData,
      errors: ['Unknown document type'],
      warnings: []
    }
  }

  // Check required fields
  if (docType.validationRules.requiredFields) {
    for (const field of docType.validationRules.requiredFields) {
      if (!extractedData[field]) {
        errors.push(`Required field "${field}" not detected`)
        isValid = false
      }
    }
  }

  // Validate format patterns
  if (docType.validationRules.formatValidation) {
    for (const [field, pattern] of Object.entries(docType.validationRules.formatValidation)) {
      if (extractedData[field] && pattern instanceof RegExp && !pattern.test(extractedData[field])) {
        errors.push(`Invalid format for "${field}": ${extractedData[field]}`)
        isValid = false
      }
    }
  }

  // Document-specific validations
  switch (documentType) {
    case 'aadhaar-front':
      if (extractedData.aadhaarNumber && !INDIAN_DOCUMENT_PATTERNS.aadhaar.test(extractedData.aadhaarNumber)) {
        errors.push('Invalid Aadhaar number format. Expected: XXXX-XXXX-XXXX')
        isValid = false
      }
      break

    case 'aadhaar-back':
      if (extractedData.pinCode && !INDIAN_DOCUMENT_PATTERNS.pinCode.test(extractedData.pinCode)) {
        warnings.push('PIN code format appears invalid')
      }
      break

    case 'pan-card':
      if (extractedData.panNumber && !INDIAN_DOCUMENT_PATTERNS.pan.test(extractedData.panNumber)) {
        errors.push('Invalid PAN number format. Expected: ABCDE1234F')
        isValid = false
      }
      break

    case 'bank-statements':
      if (extractedData.accountNumber && !INDIAN_DOCUMENT_PATTERNS.accountNumber.test(extractedData.accountNumber)) {
        warnings.push('Account number format appears invalid')
      }
      if (extractedData.ifscCode && !INDIAN_DOCUMENT_PATTERNS.ifsc.test(extractedData.ifscCode)) {
        warnings.push('IFSC code format appears invalid')
      }
      break
  }

  // Adjust confidence based on validation results
  if (errors.length > 0) {
    confidence = Math.max(0.1, confidence - (errors.length * 0.2))
  }
  if (warnings.length > 0) {
    confidence = Math.max(0.3, confidence - (warnings.length * 0.1))
  }

  return {
    isValid,
    confidence,
    extractedData,
    errors,
    warnings
  }
}

// Complete document validation pipeline
export const validateDocument = async (
  file: File, 
  documentType: string
): Promise<ValidationResult> => {
  try {
    // Step 1: File format validation
    const fileValidation = validateFileFormat(file)
    if (!fileValidation.isValid) {
      return fileValidation
    }

    // Step 2: Image quality validation
    const qualityValidation = await validateImageQuality(file)
    if (!qualityValidation.isValid) {
      return qualityValidation
    }

    // Step 3: OCR processing
    const ocrResult = await simulateOCR(file, documentType)

    // Step 4: Data validation
    const dataValidation = validateExtractedData(ocrResult.extractedData, documentType)

    // Combine results
    const allErrors = [...fileValidation.errors, ...qualityValidation.errors, ...dataValidation.errors]
    const allWarnings = [...fileValidation.warnings, ...qualityValidation.warnings, ...dataValidation.warnings]

    return {
      isValid: allErrors.length === 0,
      confidence: Math.min(fileValidation.confidence, qualityValidation.confidence, dataValidation.confidence),
      extractedData: { ...ocrResult.extractedData, ...qualityValidation.extractedData },
      errors: allErrors,
      warnings: allWarnings
    }

  } catch (error) {
    return {
      isValid: false,
      confidence: 0.0,
      extractedData: {},
      errors: [`Validation failed: ${error}`],
      warnings: []
    }
  }
}

// Utility function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Utility function to get document type display name
export const getDocumentTypeName = (documentType: string): string => {
  return DOCUMENT_TYPES[documentType]?.name || documentType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Utility function to check if document is required
export const isDocumentRequired = (documentType: string): boolean => {
  const docType = DOCUMENT_TYPES[documentType]
  return (docType?.validationRules.requiredFields?.length ?? 0) > 0
} 