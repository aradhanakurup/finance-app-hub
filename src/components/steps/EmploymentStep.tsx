"use client"

import { useState, useEffect } from 'react'

interface EmploymentData {
  employmentType: string
  companyType: string
  employerName: string
  jobTitle: string
  department: string
  employeeId: string
  startDate: string
  workExperienceYears: string
  workExperienceMonths: string
  monthlyIncome: string
  annualIncome: string
  employerPhone: string
  employerEmail: string
  officeAddress: string
  officeCity: string
  officeState: string
  officePinCode: string
  supervisorName: string
  supervisorPhone: string
  companyWebsite: string
}

interface EmploymentStepProps {
  data: EmploymentData
  onUpdate: (data: EmploymentData) => void
}

export function EmploymentStep({ data, onUpdate }: EmploymentStepProps) {
  const [formData, setFormData] = useState<EmploymentData>({
    employmentType: data.employmentType || '',
    companyType: data.companyType || '',
    employerName: data.employerName || '',
    jobTitle: data.jobTitle || '',
    department: data.department || '',
    employeeId: data.employeeId || '',
    startDate: data.startDate || '',
    workExperienceYears: data.workExperienceYears || '',
    workExperienceMonths: data.workExperienceMonths || '',
    monthlyIncome: data.monthlyIncome || '',
    annualIncome: data.annualIncome || '',
    employerPhone: data.employerPhone || '',
    employerEmail: data.employerEmail || '',
    officeAddress: data.officeAddress || '',
    officeCity: data.officeCity || '',
    officeState: data.officeState || '',
    officePinCode: data.officePinCode || '',
    supervisorName: data.supervisorName || '',
    supervisorPhone: data.supervisorPhone || '',
    companyWebsite: data.companyWebsite || ''
  })

  useEffect(() => {
    onUpdate(formData)
  }, [formData, onUpdate])

  const handleChange = (field: keyof EmploymentData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatCurrency = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, '')
    if (cleaned) {
      return new Intl.NumberFormat('en-IN').format(parseInt(cleaned))
    }
    return cleaned
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Employment Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type *
          </label>
          <select
            value={formData.employmentType}
            onChange={(e) => handleChange('employmentType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select Employment Type</option>
            <option value="salaried">Salaried</option>
            <option value="self-employed">Self-Employed</option>
            <option value="business-owner">Business Owner</option>
            <option value="professional">Professional (CA, Doctor, Lawyer, etc.)</option>
            <option value="government">Government Employee</option>
            <option value="contract">Contract/Consultant</option>
            <option value="freelancer">Freelancer</option>
            <option value="unemployed">Unemployed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Type *
          </label>
          <select
            value={formData.companyType}
            onChange={(e) => handleChange('companyType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select Company Type</option>
            <option value="private-limited">Private Limited</option>
            <option value="public-limited">Public Limited</option>
            <option value="government">Government</option>
            <option value="psu">Public Sector Unit (PSU)</option>
            <option value="mnc">Multinational Company (MNC)</option>
            <option value="partnership">Partnership</option>
            <option value="proprietorship">Proprietorship</option>
            <option value="llp">Limited Liability Partnership (LLP)</option>
            <option value="startup">Startup</option>
            <option value="msme">MSME</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company/Employer Name *
          </label>
          <input
            type="text"
            value={formData.employerName}
            onChange={(e) => handleChange('employerName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title/Designation *
          </label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., IT, Sales, Finance"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee ID
          </label>
          <input
            type="text"
            value={formData.employeeId}
            onChange={(e) => handleChange('employeeId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Employee ID/Code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Joining *
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Work Experience *
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={formData.workExperienceYears}
              onChange={(e) => handleChange('workExperienceYears', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Years"
              min="0"
              max="50"
              required
            />
            <input
              type="number"
              value={formData.workExperienceMonths}
              onChange={(e) => handleChange('workExperienceMonths', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Months"
              min="0"
              max="11"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Income (₹) *
          </label>
          <input
            type="text"
            value={formData.monthlyIncome}
            onChange={(e) => handleChange('monthlyIncome', formatCurrency(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="₹ 50,000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Income (₹) *
          </label>
          <input
            type="text"
            value={formData.annualIncome}
            onChange={(e) => handleChange('annualIncome', formatCurrency(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="₹ 6,00,000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Phone *
          </label>
          <input
            type="tel"
            value={formData.employerPhone}
            onChange={(e) => handleChange('employerPhone', formatMobile(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="+91 22 1234 5678"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Email
          </label>
          <input
            type="email"
            value={formData.employerEmail}
            onChange={(e) => handleChange('employerEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="hr@company.com"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Office Address *
          </label>
          <input
            type="text"
            value={formData.officeAddress}
            onChange={(e) => handleChange('officeAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Complete office address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Office City *
          </label>
          <input
            type="text"
            value={formData.officeCity}
            onChange={(e) => handleChange('officeCity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Office State *
          </label>
          <select
            value={formData.officeState}
            onChange={(e) => handleChange('officeState', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select State</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Gujarat">Gujarat</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Kerala">Kerala</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Punjab">Punjab</option>
            <option value="Haryana">Haryana</option>
            <option value="Bihar">Bihar</option>
            <option value="Odisha">Odisha</option>
            <option value="Assam">Assam</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Goa">Goa</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Tripura">Tripura</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
            <option value="Ladakh">Ladakh</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
            <option value="Daman and Diu">Daman and Diu</option>
            <option value="Lakshadweep">Lakshadweep</option>
            <option value="Puducherry">Puducherry</option>
            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Office PIN Code *
          </label>
          <input
            type="text"
            value={formData.officePinCode}
            onChange={(e) => handleChange('officePinCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="400001"
            maxLength={6}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supervisor/Manager Name
          </label>
          <input
            type="text"
            value={formData.supervisorName}
            onChange={(e) => handleChange('supervisorName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supervisor Phone
          </label>
          <input
            type="tel"
            value={formData.supervisorPhone}
            onChange={(e) => handleChange('supervisorPhone', formatMobile(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Website
          </label>
          <input
            type="url"
            value={formData.companyWebsite}
            onChange={(e) => handleChange('companyWebsite', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="https://www.company.com"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Employment Verification:</strong> We may contact your employer to verify employment details. 
          Please ensure all information is accurate and up-to-date.
        </p>
      </div>
    </div>
  )
} 