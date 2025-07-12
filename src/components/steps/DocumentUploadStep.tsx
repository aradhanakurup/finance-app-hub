"use client"

import { useState, useRef, useCallback } from 'react'
import { CameraCapture } from './document-upload/CameraCapture'

interface DocumentFile {
  id: string
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'verified' | 'rejected' | 'error'
  error?: string
  extractedData?: any
}

interface DocumentCategory {
  id: string
  title: string
  description: string
  required: boolean
  documents: DocumentType[]
}

interface DocumentType {
  id: string
  name: string
  description: string
  required: boolean
  maxFiles: number
  acceptedFormats: string[]
  maxSize: number // in MB
  validationRules?: any
}

interface DocumentUploadData {
  uploadedDocuments: { [key: string]: DocumentFile[] }
  verificationStatus: 'pending' | 'in-progress' | 'completed' | 'failed'
  overallProgress: number
}

interface DocumentUploadStepProps {
  data: DocumentUploadData
  onUpdate: (data: DocumentUploadData) => void
}

export function DocumentUploadStep({ data, onUpdate }: DocumentUploadStepProps) {
  const [currentCategory, setCurrentCategory] = useState<string>('identity')
  const [showCamera, setShowCamera] = useState(false)
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | null>(null)
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const documentCategories: DocumentCategory[] = [
    {
      id: 'identity',
      title: 'Identity Proof',
      description: 'Government-issued identity documents',
      required: true,
      documents: [
        {
          id: 'aadhaar-front',
          name: 'Aadhaar Card (Front)',
          description: 'Front side of Aadhaar card showing photo and Aadhaar number',
          required: true,
          maxFiles: 1,
          acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 5,
          validationRules: {
            ocr: 'aadhaar',
            requiredFields: ['aadhaarNumber', 'name', 'photo']
          }
        },
        {
          id: 'aadhaar-back',
          name: 'Aadhaar Card (Back)',
          description: 'Back side of Aadhaar card showing address',
          required: true,
          maxFiles: 1,
          acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 5,
          validationRules: {
            ocr: 'aadhaar',
            requiredFields: ['address']
          }
        },
        {
          id: 'pan-card',
          name: 'PAN Card',
          description: 'Permanent Account Number card',
          required: true,
          maxFiles: 1,
          acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 5,
          validationRules: {
            ocr: 'pan',
            requiredFields: ['panNumber', 'name']
          }
        },
        {
          id: 'passport',
          name: 'Passport',
          description: 'Valid passport (if available)',
          required: false,
          maxFiles: 1,
          acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 5
        }
      ]
    },
    {
      id: 'income',
      title: 'Income Proof',
      description: 'Documents proving your income and employment',
      required: true,
      documents: [
        {
          id: 'salary-slips',
          name: 'Salary Slips (Last 3 Months)',
          description: 'Salary slips from the last 3 months',
          required: true,
          maxFiles: 3,
          acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 5,
          validationRules: {
            ocr: 'salary-slip',
            requiredFields: ['employerName', 'salary', 'date']
          }
        },
        {
          id: 'form-16',
          name: 'Form 16',
          description: 'Annual tax certificate from employer',
          required: false,
          maxFiles: 1,
          acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 5
        },
        {
          id: 'bank-statements',
          name: 'Bank Statements (Last 6 Months)',
          description: 'Bank account statements showing salary credits',
          required: true,
          maxFiles: 6,
          acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 5,
          validationRules: {
            ocr: 'bank-statement',
            requiredFields: ['accountNumber', 'transactions']
          }
        },
        {
          id: 'it-returns',
          name: 'IT Returns (Last 2 Years)',
          description: 'Income tax return acknowledgments',
          required: false,
          maxFiles: 2,
          acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 5
        }
      ]
    },
    {
      id: 'address',
      title: 'Address Proof',
      description: 'Documents proving your residential address',
      required: true,
      documents: [
        {
          id: 'utility-bills',
          name: 'Utility Bills',
          description: 'Electricity, gas, or water bills (not older than 3 months)',
          required: true,
          maxFiles: 2,
          acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 5
        },
        {
          id: 'rent-agreement',
          name: 'Rent Agreement',
          description: 'Rent agreement if staying in rented accommodation',
          required: false,
          maxFiles: 1,
          acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 5
        },
        {
          id: 'property-documents',
          name: 'Property Documents',
          description: 'Property ownership documents if applicable',
          required: false,
          maxFiles: 2,
          acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 5
        }
      ]
    },
    {
      id: 'employment',
      title: 'Employment Proof',
      description: 'Documents proving your employment status',
      required: true,
      documents: [
        {
          id: 'employment-certificate',
          name: 'Employment Certificate',
          description: 'Certificate from current employer',
          required: true,
          maxFiles: 1,
          acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 5
        },
        {
          id: 'offer-letter',
          name: 'Offer Letter',
          description: 'Current job offer letter',
          required: false,
          maxFiles: 1,
          acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 5
        },
        {
          id: 'business-license',
          name: 'Business License',
          description: 'Business registration documents (for self-employed)',
          required: false,
          maxFiles: 2,
          acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 5
        }
      ]
    }
  ]

  const [uploadedDocuments, setUploadedDocuments] = useState<{ [key: string]: DocumentFile[] }>(
    data.uploadedDocuments || {}
  )

  const handleFileUpload = useCallback(async (files: FileList, documentType: DocumentType) => {
    const newFiles: DocumentFile[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file size
      if (file.size > documentType.maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${documentType.maxSize}MB.`)
        continue
      }

      // Validate file type
      if (!documentType.acceptedFormats.includes(file.type)) {
        alert(`File ${file.name} is not a supported format.`)
        continue
      }

      const fileId = `${documentType.id}-${Date.now()}-${i}`
      const preview = URL.createObjectURL(file)
      
      newFiles.push({
        id: fileId,
        file,
        preview,
        status: 'pending'
      })
    }

    // Update uploaded documents
    const currentFiles = uploadedDocuments[documentType.id] || []
    const updatedFiles = [...currentFiles, ...newFiles]
    
    const updatedDocuments = {
      ...uploadedDocuments,
      [documentType.id]: updatedFiles
    }
    
    setUploadedDocuments(updatedDocuments)
    
    // Simulate file upload and validation
    setUploadingFiles(prev => [...prev, ...newFiles.map(f => f.id)])
    
    for (const fileData of newFiles) {
      try {
        // Simulate upload process
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Simulate OCR and validation
        const extractedData = await simulateOCR(fileData.file, documentType)
        
        setUploadedDocuments(prev => ({
          ...prev,
          [documentType.id]: prev[documentType.id].map(f => 
            f.id === fileData.id 
              ? { ...f, status: 'verified', extractedData }
              : f
          )
        }))
      } catch (error) {
        setUploadedDocuments(prev => ({
          ...prev,
          [documentType.id]: prev[documentType.id].map(f => 
            f.id === fileData.id 
              ? { ...f, status: 'error', error: 'Upload failed' }
              : f
          )
        }))
      } finally {
        setUploadingFiles(prev => prev.filter(id => id !== fileData.id))
      }
    }

    // Update parent component
    onUpdate({
      uploadedDocuments: updatedDocuments,
      verificationStatus: 'in-progress',
      overallProgress: calculateProgress(updatedDocuments)
    })
  }, [uploadedDocuments, onUpdate])

  const simulateOCR = async (file: File, documentType: DocumentType) => {
    // Simulate OCR processing based on document type
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    switch (documentType.id) {
      case 'aadhaar-front':
        return {
          aadhaarNumber: '123456789012',
          name: 'John Doe',
          photo: 'detected'
        }
      case 'aadhaar-back':
        return {
          address: '123 Main Street, Mumbai, Maharashtra 400001'
        }
      case 'pan-card':
        return {
          panNumber: 'ABCDE1234F',
          name: 'John Doe'
        }
      case 'salary-slips':
        return {
          employerName: 'ABC Company Ltd',
          salary: '₹50,000',
          date: 'March 2024'
        }
      case 'bank-statements':
        return {
          accountNumber: '1234567890',
          transactions: 'detected'
        }
      default:
        return {}
    }
  }

  const calculateProgress = (documents: { [key: string]: DocumentFile[] }) => {
    let totalRequired = 0
    let totalUploaded = 0
    
    documentCategories.forEach(category => {
      category.documents.forEach(docType => {
        if (docType.required) {
          totalRequired += docType.maxFiles
          const uploaded = documents[docType.id]?.length || 0
          totalUploaded += Math.min(uploaded, docType.maxFiles)
        }
      })
    })
    
    return totalRequired > 0 ? Math.round((totalUploaded / totalRequired) * 100) : 0
  }

  const handleCameraCapture = async (imageBlob: Blob) => {
    if (!selectedDocumentType) return
    
    const file = new File([imageBlob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
    const files = { 0: file, length: 1, item: (index: number) => index === 0 ? file : null, [Symbol.iterator]: function* () { yield file; } } as FileList
    
    await handleFileUpload(files, selectedDocumentType)
    setShowCamera(false)
    setSelectedDocumentType(null)
  }

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>, documentType: DocumentType) => {
    const files = event.target.files
    if (files) {
      handleFileUpload(files, documentType)
    }
    event.target.value = ''
  }

  const removeDocument = (documentTypeId: string, fileId: string) => {
    const updatedFiles = uploadedDocuments[documentTypeId]?.filter(f => f.id !== fileId) || []
    
    const updatedDocuments = {
      ...uploadedDocuments,
      [documentTypeId]: updatedFiles
    }
    
    setUploadedDocuments(updatedDocuments)
    onUpdate({
      uploadedDocuments: updatedDocuments,
      verificationStatus: 'in-progress',
      overallProgress: calculateProgress(updatedDocuments)
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50'
      case 'uploading': return 'text-blue-600 bg-blue-50'
      case 'rejected': return 'text-red-600 bg-red-50'
      case 'error': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return '✅'
      case 'uploading': return '⏳'
      case 'rejected': return '❌'
      case 'error': return '⚠️'
      default: return '📄'
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Document Upload & Verification</h2>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-500">{calculateProgress(uploadedDocuments)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${calculateProgress(uploadedDocuments)}%` }}
          ></div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {documentCategories.map(category => (
          <button
            key={category.id}
            onClick={() => setCurrentCategory(category.id)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              currentCategory === category.id
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Document Upload Area */}
      <div className="space-y-6">
        {documentCategories
          .find(cat => cat.id === currentCategory)
          ?.documents.map(documentType => {
            const uploadedFiles = uploadedDocuments[documentType.id] || []
            const canUpload = uploadedFiles.length < documentType.maxFiles
            
            return (
              <div key={documentType.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {documentType.name}
                      {documentType.required && <span className="text-red-500 ml-1">*</span>}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{documentType.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Accepted formats: {documentType.acceptedFormats.join(', ')} | 
                      Max size: {documentType.maxSize}MB | 
                      Max files: {documentType.maxFiles}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">
                      {uploadedFiles.length}/{documentType.maxFiles} uploaded
                    </span>
                  </div>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {uploadedFiles.map(file => (
                      <div key={file.id} className="relative border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 truncate">
                            {file.file.name}
                          </span>
                          <button
                            onClick={() => removeDocument(documentType.id, file.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(file.status)}`}>
                            {getStatusIcon(file.status)} {file.status}
                          </span>
                          {uploadingFiles.includes(file.id) && (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          )}
                        </div>

                        {file.status === 'verified' && file.extractedData && (
                          <div className="mt-2 text-xs text-gray-600">
                            <div>Extracted: {Object.keys(file.extractedData).join(', ')}</div>
                          </div>
                        )}

                        {file.status === 'error' && file.error && (
                          <div className="mt-2 text-xs text-red-600">
                            Error: {file.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Buttons */}
                {canUpload && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedDocumentType(documentType)
                        setShowCamera(true)
                      }}
                      className="flex-1 py-3 px-4 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:border-green-400 hover:bg-green-50 transition-colors"
                    >
                      📷 Take Photo
                    </button>
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-3 px-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      📁 Choose File
                    </button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple={documentType.maxFiles > 1}
                      accept={documentType.acceptedFormats.join(',')}
                      onChange={(e) => handleFileInput(e, documentType)}
                      className="hidden"
                    />
                  </div>
                )}

                {!canUpload && (
                  <div className="text-center py-4 text-gray-500">
                    Maximum number of files uploaded for this document type.
                  </div>
                )}
              </div>
            )
          })}
      </div>

      {/* Camera Modal */}
      {showCamera && selectedDocumentType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Capture {selectedDocumentType.name}</h3>
              <button
                onClick={() => {
                  setShowCamera(false)
                  setSelectedDocumentType(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <CameraCapture
              onCapture={handleCameraCapture}
              onCancel={() => {
                setShowCamera(false)
                setSelectedDocumentType(null)
              }}
              documentType={selectedDocumentType}
            />
          </div>
        </div>
      )}

      {/* KYC Compliance Notice */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">KYC Compliance Requirements</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All documents must be clear, readable, and unedited</li>
          <li>• Government-issued documents must be valid and not expired</li>
          <li>• Bank statements must show salary credits for the last 6 months</li>
          <li>• Documents will be verified through RBI-compliant processes</li>
          <li>• Your data is encrypted and secure as per Indian regulations</li>
        </ul>
      </div>
    </div>
  )
} 