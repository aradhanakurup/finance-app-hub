"use client"

import { useState } from 'react'

interface DocumentPreviewProps {
  file: File
  preview: string
  status: string
  extractedData?: any
  onRemove: () => void
  onRetake: () => void
}

export function DocumentPreview({ 
  file, 
  preview, 
  status, 
  extractedData, 
  onRemove, 
  onRetake 
}: DocumentPreviewProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [rotation, setRotation] = useState(0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50 border-green-200'
      case 'uploading': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor(status)}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
          <p className="text-sm text-gray-500">
            {formatFileSize(file.size)} • {file.type}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
            {getStatusIcon(status)} {status}
          </span>
        </div>
      </div>

      {/* Image Preview */}
      <div className="relative mb-3">
        <div 
          className={`overflow-hidden rounded-lg border ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={preview}
            alt="Document preview"
            className={`w-full transition-all duration-300 ${
              isZoomed ? 'scale-150' : 'hover:scale-105'
            }`}
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </div>

        {/* Image Controls */}
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={rotateImage}
            className="p-1 bg-white bg-opacity-80 rounded-full shadow-sm hover:bg-opacity-100"
            title="Rotate"
          >
            🔄
          </button>
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-1 bg-white bg-opacity-80 rounded-full shadow-sm hover:bg-opacity-100"
            title={isZoomed ? "Zoom out" : "Zoom in"}
          >
            {isZoomed ? "🔍-" : "🔍+"}
          </button>
        </div>
      </div>

      {/* Extracted Data */}
      {extractedData && Object.keys(extractedData).length > 0 && (
        <div className="mb-3 p-3 bg-white rounded-lg border">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Extracted Information:</h5>
          <div className="space-y-1">
            {Object.entries(extractedData).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="text-gray-900 font-medium">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={onRetake}
          className="flex-1 py-2 px-3 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          🔄 Retake
        </button>
        <button
          onClick={onRemove}
          className="flex-1 py-2 px-3 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
        >
          🗑️ Remove
        </button>
      </div>
    </div>
  )
} 