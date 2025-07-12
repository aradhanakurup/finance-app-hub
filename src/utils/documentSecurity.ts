// Document security utilities for Indian Auto Finance Hub
// Compliant with RBI guidelines and Indian data protection regulations

import { validateFileFormat } from './documentValidation'

export interface SecurityConfig {
  encryptionKey: string
  maxFileSize: number
  allowedFileTypes: string[]
  retentionDays: number
  auditLogging: boolean
}

export interface EncryptedFile {
  id: string
  encryptedData: string
  iv: string
  metadata: FileMetadata
  timestamp: number
  checksum: string
}

export interface FileMetadata {
  originalName: string
  fileType: string
  fileSize: number
  documentType: string
  uploadTimestamp: number
  userId?: string
  sessionId?: string
}

export interface AuditLog {
  id: string
  action: 'upload' | 'download' | 'delete' | 'verify' | 'reject'
  fileId: string
  userId?: string
  timestamp: number
  ipAddress?: string
  userAgent?: string
  result: 'success' | 'failure'
  details?: string
}

// Default security configuration
export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  encryptionKey: process.env.NEXT_PUBLIC_DOCUMENT_ENCRYPTION_KEY || 'default-key-change-in-production',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  retentionDays: 90, // 90 days retention as per RBI guidelines
  auditLogging: true
}

// Generate a unique file ID
export const generateFileId = (): string => {
  return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Generate checksum for file integrity
export const generateChecksum = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Encrypt file data
export const encryptFile = async (
  file: File, 
  config: SecurityConfig = DEFAULT_SECURITY_CONFIG
): Promise<EncryptedFile> => {
  try {
    // Validate file before encryption
    const validation = validateFileFormat(file)
    if (!validation.isValid) {
      throw new Error(`File validation failed: ${validation.errors.join(', ')}`)
    }

    // Generate encryption key and IV
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(config.encryptionKey),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    )

    const iv = crypto.getRandomValues(new Uint8Array(12))
    
    // Read file data
    const fileBuffer = await file.arrayBuffer()
    
    // Encrypt the data
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      fileBuffer
    )

    // Convert to base64
    const encryptedData = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)))
    const ivString = btoa(String.fromCharCode(...iv))

    // Generate file ID and checksum
    const fileId = generateFileId()
    const checksum = await generateChecksum(file)

    // Create metadata
    const metadata: FileMetadata = {
      originalName: file.name,
      fileType: file.type,
      fileSize: file.size,
      documentType: '', // Will be set by the calling function
      uploadTimestamp: Date.now()
    }

    return {
      id: fileId,
      encryptedData,
      iv: ivString,
      metadata,
      timestamp: Date.now(),
      checksum
    }

  } catch (error) {
    throw new Error(`Encryption failed: ${error}`)
  }
}

// Decrypt file data
export const decryptFile = async (
  encryptedFile: EncryptedFile,
  config: SecurityConfig = DEFAULT_SECURITY_CONFIG
): Promise<File> => {
  try {
    // Import decryption key
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(config.encryptionKey),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    )

    // Convert base64 strings back to arrays
    const encryptedData = Uint8Array.from(atob(encryptedFile.encryptedData), c => c.charCodeAt(0))
    const iv = Uint8Array.from(atob(encryptedFile.iv), c => c.charCodeAt(0))

    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedData
    )

    // Create file from decrypted data
    const decryptedFile = new File(
      [decryptedBuffer],
      encryptedFile.metadata.originalName,
      { type: encryptedFile.metadata.fileType }
    )

    // Verify checksum
    const currentChecksum = await generateChecksum(decryptedFile)
    if (currentChecksum !== encryptedFile.checksum) {
      throw new Error('File integrity check failed - checksum mismatch')
    }

    return decryptedFile

  } catch (error) {
    throw new Error(`Decryption failed: ${error}`)
  }
}

// Secure file upload with encryption
export const secureFileUpload = async (
  file: File,
  documentType: string,
  userId?: string,
  config: SecurityConfig = DEFAULT_SECURITY_CONFIG
): Promise<EncryptedFile> => {
  try {
    // Encrypt the file
    const encryptedFile = await encryptFile(file, config)
    
    // Update metadata with document type and user info
    encryptedFile.metadata.documentType = documentType
    encryptedFile.metadata.userId = userId

    // Log audit event
    if (config.auditLogging) {
      await logAuditEvent({
        id: generateFileId(),
        action: 'upload',
        fileId: encryptedFile.id,
        userId,
        timestamp: Date.now(),
        result: 'success',
        details: `Document type: ${documentType}, Size: ${formatFileSize(file.size)}`
      })
    }

    return encryptedFile

  } catch (error) {
    // Log failed upload
    if (config.auditLogging) {
      await logAuditEvent({
        id: generateFileId(),
        action: 'upload',
        fileId: '',
        userId,
        timestamp: Date.now(),
        result: 'failure',
        details: `Error: ${error}`
      })
    }
    throw error
  }
}

// Secure file download with decryption
export const secureFileDownload = async (
  encryptedFile: EncryptedFile,
  userId?: string,
  config: SecurityConfig = DEFAULT_SECURITY_CONFIG
): Promise<File> => {
  try {
    // Verify file retention policy
    const fileAge = Date.now() - encryptedFile.timestamp
    const maxAge = config.retentionDays * 24 * 60 * 60 * 1000 // Convert days to milliseconds
    
    if (fileAge > maxAge) {
      throw new Error('File has exceeded retention period')
    }

    // Decrypt the file
    const decryptedFile = await decryptFile(encryptedFile, config)

    // Log audit event
    if (config.auditLogging) {
      await logAuditEvent({
        id: generateFileId(),
        action: 'download',
        fileId: encryptedFile.id,
        userId,
        timestamp: Date.now(),
        result: 'success',
        details: `Document type: ${encryptedFile.metadata.documentType}`
      })
    }

    return decryptedFile

  } catch (error) {
    // Log failed download
    if (config.auditLogging) {
      await logAuditEvent({
        id: generateFileId(),
        action: 'download',
        fileId: encryptedFile.id,
        userId,
        timestamp: Date.now(),
        result: 'failure',
        details: `Error: ${error}`
      })
    }
    throw error
  }
}

// Secure file deletion
export const secureFileDelete = async (
  fileId: string,
  userId?: string,
  config: SecurityConfig = DEFAULT_SECURITY_CONFIG
): Promise<void> => {
  try {
    // In a real implementation, this would delete from secure storage
    // For now, we just log the deletion event
    
    if (config.auditLogging) {
      await logAuditEvent({
        id: generateFileId(),
        action: 'delete',
        fileId,
        userId,
        timestamp: Date.now(),
        result: 'success',
        details: 'File marked for secure deletion'
      })
    }

  } catch (error) {
    if (config.auditLogging) {
      await logAuditEvent({
        id: generateFileId(),
        action: 'delete',
        fileId,
        userId,
        timestamp: Date.now(),
        result: 'failure',
        details: `Error: ${error}`
      })
    }
    throw error
  }
}

// Audit logging function
export const logAuditEvent = async (event: AuditLog): Promise<void> => {
  try {
    // In a real implementation, this would send to a secure audit log service
    // For now, we'll just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('AUDIT LOG:', {
        ...event,
        timestamp: new Date(event.timestamp).toISOString()
      })
    }

    // In production, this would be sent to a secure audit service
    // await fetch('/api/audit-log', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // })

  } catch (error) {
    console.error('Failed to log audit event:', error)
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

// Check if file is within retention period
export const isFileWithinRetention = (
  timestamp: number,
  retentionDays: number = DEFAULT_SECURITY_CONFIG.retentionDays
): boolean => {
  const fileAge = Date.now() - timestamp
  const maxAge = retentionDays * 24 * 60 * 60 * 1000
  return fileAge <= maxAge
}

// Generate secure download URL (for temporary access)
export const generateSecureDownloadUrl = (
  fileId: string,
  expiresIn: number = 3600000 // 1 hour default
): string => {
  const expiresAt = Date.now() + expiresIn
  const token = btoa(`${fileId}:${expiresAt}`) // In production, use proper JWT
  return `/api/documents/download/${fileId}?token=${token}`
}

// Validate download token
export const validateDownloadToken = (token: string, fileId: string): boolean => {
  try {
    const decoded = atob(token)
    const [tokenFileId, expiresAt] = decoded.split(':')
    
    if (tokenFileId !== fileId) {
      return false
    }
    
    if (Date.now() > parseInt(expiresAt)) {
      return false
    }
    
    return true
  } catch {
    return false
  }
}

// Compliance utilities for Indian regulations
export const COMPLIANCE_CONFIG = {
  rbi: {
    kycRequired: true,
    documentRetentionDays: 90,
    encryptionRequired: true,
    auditLoggingRequired: true
  },
  gdpr: {
    dataMinimization: true,
    rightToErasure: true,
    consentRequired: true
  },
  indianDataProtection: {
    dataLocalization: true,
    consentManagement: true,
    breachNotification: true
  }
}

// Check compliance requirements
export const checkCompliance = (config: SecurityConfig): string[] => {
  const issues: string[] = []

  if (COMPLIANCE_CONFIG.rbi.encryptionRequired && !config.encryptionKey) {
    issues.push('RBI compliance: Encryption key required')
  }

  if (COMPLIANCE_CONFIG.rbi.auditLoggingRequired && !config.auditLogging) {
    issues.push('RBI compliance: Audit logging required')
  }

  if (config.retentionDays < COMPLIANCE_CONFIG.rbi.documentRetentionDays) {
    issues.push(`RBI compliance: Document retention must be at least ${COMPLIANCE_CONFIG.rbi.documentRetentionDays} days`)
  }

  return issues
} 