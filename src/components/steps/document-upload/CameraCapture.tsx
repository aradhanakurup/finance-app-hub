"use client"

import { useState, useRef, useEffect } from 'react'

interface CameraCaptureProps {
  onCapture: (imageBlob: Blob) => void
  onCancel: () => void
  documentType: any
}

export function CameraCapture({ onCapture, onCancel, documentType }: CameraCaptureProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          setIsStreaming(true)
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsStreaming(false)
  }

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob)
        setCapturedImage(imageUrl)
        stopCamera()
      }
    }, 'image/jpeg', 0.9)
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  const processAndUpload = async () => {
    if (!capturedImage || !canvasRef.current) return

    setIsProcessing(true)

    try {
      // Create a new canvas for processing
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (!context) return

      // Load the captured image
      const img = new Image()
      img.onload = () => {
        // Set canvas size
        canvas.width = img.width
        canvas.height = img.height

        // Draw image
        context.drawImage(img, 0, 0)

        // Apply basic enhancement (you can add more sophisticated processing here)
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const enhancedData = enhanceImage(imageData)
        context.putImageData(enhancedData, 0, 0)

        // Convert to blob and upload
        canvas.toBlob((blob) => {
          if (blob) {
            onCapture(blob)
          }
        }, 'image/jpeg', 0.9)
      }
      img.src = capturedImage
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Error processing image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const enhanceImage = (imageData: ImageData): ImageData => {
    const { data, width, height } = imageData
    const enhanced = new Uint8ClampedArray(data)

    // Simple contrast and brightness enhancement
    for (let i = 0; i < data.length; i += 4) {
      // Enhance contrast
      const factor = 1.2
      enhanced[i] = Math.min(255, Math.max(0, (data[i] - 128) * factor + 128))     // Red
      enhanced[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * factor + 128)) // Green
      enhanced[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * factor + 128)) // Blue
      // Alpha channel remains unchanged
    }

    return new ImageData(enhanced, width, height)
  }

  const getDocumentGuidelines = () => {
    switch (documentType.id) {
      case 'aadhaar-front':
        return 'Ensure Aadhaar number and photo are clearly visible'
      case 'aadhaar-back':
        return 'Ensure address details are clearly readable'
      case 'pan-card':
        return 'Ensure PAN number and name are clearly visible'
      case 'salary-slips':
        return 'Ensure employer name, salary, and date are visible'
      case 'bank-statements':
        return 'Ensure account number and transactions are visible'
      default:
        return 'Ensure the document is clear and all text is readable'
    }
  }

  return (
    <div className="space-y-4">
      {/* Guidelines */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <strong>Guidelines:</strong> {getDocumentGuidelines()}
      </div>

      {!capturedImage ? (
        /* Camera View */
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover rounded-lg bg-gray-900"
          />
          
          {!isStreaming && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
              <div className="text-white text-center">
                <div className="text-2xl mb-2">📷</div>
                <div>Initializing camera...</div>
              </div>
            </div>
          )}

          {/* Camera Controls */}
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={captureImage}
              disabled={!isStreaming}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📸 Capture
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Captured Image Preview */
        <div className="space-y-4">
          <div className="relative">
            <img
              src={capturedImage}
              alt="Captured document"
              className="w-full h-64 object-contain border border-gray-200 rounded-lg"
            />
            
            {/* Processing Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="text-white text-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <div>Processing image...</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={retakePhoto}
              disabled={isProcessing}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              🔄 Retake
            </button>
            <button
              onClick={processAndUpload}
              disabled={isProcessing}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : '✅ Use This Photo'}
            </button>
          </div>
        </div>
      )}

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
} 