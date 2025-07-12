"use client"

import { useState, useEffect } from 'react'

interface Reference {
  name: string
  relationship: string
  phone: string
  email: string
  address: string
  occupation: string
  referenceType: string
}

interface ReferencesData {
  references: Reference[]
}

interface ReferencesStepProps {
  data: ReferencesData
  onUpdate: (data: ReferencesData) => void
}

export function ReferencesStep({ data, onUpdate }: ReferencesStepProps) {
  const [formData, setFormData] = useState<ReferencesData>({
    references: data.references || [
      { name: '', relationship: '', phone: '', email: '', address: '', occupation: '', referenceType: 'personal' },
      { name: '', relationship: '', phone: '', email: '', address: '', occupation: '', referenceType: 'professional' }
    ]
  })

  useEffect(() => {
    onUpdate(formData)
  }, [formData, onUpdate])

  const handleReferenceChange = (index: number, field: keyof Reference, value: string) => {
    const newReferences = [...formData.references]
    newReferences[index] = { ...newReferences[index], [field]: value }
    setFormData(prev => ({ ...prev, references: newReferences }))
  }

  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, { name: '', relationship: '', phone: '', email: '', address: '', occupation: '', referenceType: 'personal' }]
    }))
  }

  const removeReference = (index: number) => {
    if (formData.references.length > 1) {
      const newReferences = formData.references.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, references: newReferences }))
    }
  }

  const formatMobile = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.startsWith('91')) {
      return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7, 12)}`
    }
    return cleaned
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal References</h2>
      
      <div className="space-y-6">
        {formData.references.map((reference, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Reference {index + 1}
              </h3>
              {formData.references.length > 1 && (
                <button
                  onClick={() => removeReference(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={reference.name}
                  onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Type *
                </label>
                <select
                  value={reference.referenceType}
                  onChange={(e) => handleReferenceChange(index, 'referenceType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="personal">Personal Reference</option>
                  <option value="professional">Professional Reference</option>
                  <option value="family">Family Member</option>
                  <option value="neighbor">Neighbor</option>
                  <option value="colleague">Colleague</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship *
                </label>
                <select
                  value={reference.relationship}
                  onChange={(e) => handleReferenceChange(index, 'relationship', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Relationship</option>
                  <option value="friend">Friend</option>
                  <option value="family-member">Family Member</option>
                  <option value="colleague">Colleague</option>
                  <option value="neighbor">Neighbor</option>
                  <option value="relative">Relative</option>
                  <option value="business-partner">Business Partner</option>
                  <option value="landlord">Landlord</option>
                  <option value="teacher">Teacher/Professor</option>
                  <option value="doctor">Doctor</option>
                  <option value="lawyer">Lawyer</option>
                  <option value="banker">Banker</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation *
                </label>
                <input
                  type="text"
                  value={reference.occupation}
                  onChange={(e) => handleReferenceChange(index, 'occupation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Software Engineer, Doctor, Business Owner"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={reference.phone}
                  onChange={(e) => handleReferenceChange(index, 'phone', formatMobile(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={reference.email}
                  onChange={(e) => handleReferenceChange(index, 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={reference.address}
                  onChange={(e) => handleReferenceChange(index, 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Complete address of the reference"
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={addReference}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors"
        >
          + Add Another Reference
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Reference Verification:</strong> We may contact your references to verify the information provided. 
          Please ensure all contact details are accurate and up-to-date.
        </p>
      </div>
    </div>
  )
} 