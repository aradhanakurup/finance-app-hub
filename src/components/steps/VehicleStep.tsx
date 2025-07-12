"use client"

import { useState, useEffect } from 'react'

interface VehicleData {
  make: string
  model: string
  year: string
  variant: string
  fuelType: string
  transmission: string
  vin: string
  engineNumber: string
  registrationNumber: string
  mileage: string
  vehiclePrice: string
  downPayment: string
  loanAmount: string
  loanTenure: string
  interestRate: string
  processingFee: string
  insuranceAmount: string
  rtoCharges: string
  dealerName: string
  dealerPhone: string
  dealerAddress: string
  vehicleCondition: string
  ownershipTransfer: boolean
  hypothecationRequired: boolean
}

interface VehicleStepProps {
  data: VehicleData
  onUpdate: (data: VehicleData) => void
}

export function VehicleStep({ data, onUpdate }: VehicleStepProps) {
  const [formData, setFormData] = useState<VehicleData>({
    make: data.make || '',
    model: data.model || '',
    year: data.year || '',
    variant: data.variant || '',
    fuelType: data.fuelType || '',
    transmission: data.transmission || '',
    vin: data.vin || '',
    engineNumber: data.engineNumber || '',
    registrationNumber: data.registrationNumber || '',
    mileage: data.mileage || '',
    vehiclePrice: data.vehiclePrice || '',
    downPayment: data.downPayment || '',
    loanAmount: data.loanAmount || '',
    loanTenure: data.loanTenure || '',
    interestRate: data.interestRate || '',
    processingFee: data.processingFee || '',
    insuranceAmount: data.insuranceAmount || '',
    rtoCharges: data.rtoCharges || '',
    dealerName: data.dealerName || '',
    dealerPhone: data.dealerPhone || '',
    dealerAddress: data.dealerAddress || '',
    vehicleCondition: data.vehicleCondition || '',
    ownershipTransfer: data.ownershipTransfer || false,
    hypothecationRequired: data.hypothecationRequired || true
  })

  useEffect(() => {
    onUpdate(formData)
  }, [formData, onUpdate])

  const handleChange = (field: keyof VehicleData, value: string | boolean) => {
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle & Loan Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Make *
          </label>
          <select
            value={formData.make}
            onChange={(e) => handleChange('make', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select Make</option>
            <option value="Maruti Suzuki">Maruti Suzuki</option>
            <option value="Hyundai">Hyundai</option>
            <option value="Tata">Tata</option>
            <option value="Mahindra">Mahindra</option>
            <option value="Honda">Honda</option>
            <option value="Toyota">Toyota</option>
            <option value="Ford">Ford</option>
            <option value="Volkswagen">Volkswagen</option>
            <option value="Renault">Renault</option>
            <option value="Nissan">Nissan</option>
            <option value="Kia">Kia</option>
            <option value="MG">MG</option>
            <option value="Skoda">Skoda</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Audi">Audi</option>
            <option value="Jaguar">Jaguar</option>
            <option value="Land Rover">Land Rover</option>
            <option value="Volvo">Volvo</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Model *
          </label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => handleChange('model', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Swift, i20, Nexon"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year *
          </label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            min="1990"
            max="2024"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Variant
          </label>
          <input
            type="text"
            value={formData.variant}
            onChange={(e) => handleChange('variant', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., ZXI, VX, LXI"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuel Type *
          </label>
          <select
            value={formData.fuelType}
            onChange={(e) => handleChange('fuelType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select Fuel Type</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="cng">CNG</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
            <option value="lpg">LPG</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transmission *
          </label>
          <select
            value={formData.transmission}
            onChange={(e) => handleChange('transmission', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select Transmission</option>
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
            <option value="cvt">CVT</option>
            <option value="amt">AMT</option>
            <option value="dct">DCT</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            VIN Number *
          </label>
          <input
            type="text"
            value={formData.vin}
            onChange={(e) => handleChange('vin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="17-character VIN"
            maxLength={17}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Engine Number *
          </label>
          <input
            type="text"
            value={formData.engineNumber}
            onChange={(e) => handleChange('engineNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Number
          </label>
          <input
            type="text"
            value={formData.registrationNumber}
            onChange={(e) => handleChange('registrationNumber', e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="MH01AB1234"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mileage (km) *
          </label>
          <input
            type="number"
            value={formData.mileage}
            onChange={(e) => handleChange('mileage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="50000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Condition *
          </label>
          <select
            value={formData.vehicleCondition}
            onChange={(e) => handleChange('vehicleCondition', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select Condition</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="average">Average</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Price (₹) *
          </label>
          <input
            type="text"
            value={formData.vehiclePrice}
            onChange={(e) => handleChange('vehiclePrice', formatCurrency(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="₹ 5,00,000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Down Payment (₹) *
          </label>
          <input
            type="text"
            value={formData.downPayment}
            onChange={(e) => handleChange('downPayment', formatCurrency(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="₹ 1,00,000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount Requested (₹) *
          </label>
          <input
            type="text"
            value={formData.loanAmount}
            onChange={(e) => handleChange('loanAmount', formatCurrency(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="₹ 4,00,000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Tenure *
          </label>
          <select
            value={formData.loanTenure}
            onChange={(e) => handleChange('loanTenure', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select Tenure</option>
            <option value="12">1 Year</option>
            <option value="24">2 Years</option>
            <option value="36">3 Years</option>
            <option value="48">4 Years</option>
            <option value="60">5 Years</option>
            <option value="72">6 Years</option>
            <option value="84">7 Years</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (% p.a.)
          </label>
          <input
            type="number"
            value={formData.interestRate}
            onChange={(e) => handleChange('interestRate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="12.5"
            step="0.1"
            min="0"
            max="30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Processing Fee (₹)
          </label>
          <input
            type="text"
            value={formData.processingFee}
            onChange={(e) => handleChange('processingFee', formatCurrency(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="₹ 5,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insurance Amount (₹)
          </label>
          <input
            type="text"
            value={formData.insuranceAmount}
            onChange={(e) => handleChange('insuranceAmount', formatCurrency(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="₹ 15,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            RTO Charges (₹)
          </label>
          <input
            type="text"
            value={formData.rtoCharges}
            onChange={(e) => handleChange('rtoCharges', formatCurrency(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="₹ 10,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dealer Name
          </label>
          <input
            type="text"
            value={formData.dealerName}
            onChange={(e) => handleChange('dealerName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dealer Phone
          </label>
          <input
            type="tel"
            value={formData.dealerPhone}
            onChange={(e) => handleChange('dealerPhone', formatMobile(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="+91 98765 43210"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dealer Address
          </label>
          <textarea
            value={formData.dealerAddress}
            onChange={(e) => handleChange('dealerAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Complete dealer address"
            rows={2}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="ownershipTransfer"
            checked={formData.ownershipTransfer}
            onChange={(e) => handleChange('ownershipTransfer', e.target.checked)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="ownershipTransfer" className="ml-2 block text-sm text-gray-700">
            Ownership transfer required
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="hypothecationRequired"
            checked={formData.hypothecationRequired}
            onChange={(e) => handleChange('hypothecationRequired', e.target.checked)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="hypothecationRequired" className="ml-2 block text-sm text-gray-700">
            Hypothecation required
          </label>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Vehicle Verification:</strong> We will verify vehicle details through RTO records and may require 
          physical inspection. Insurance and RTO registration are mandatory for loan approval.
        </p>
      </div>
    </div>
  )
} 