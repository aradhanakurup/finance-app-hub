'use client';

import React, { useState } from 'react';
import { Fin5Logo } from '@/components/Fin5Logo';

interface LenderRegistrationData {
  // Basic Information
  businessName: string;
  legalName: string;
  registrationNumber: string;
  gstNumber: string;
  panNumber: string;
  
  // Contact Information
  email: string;
  phone: string;
  website: string;
  
  // Address
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  
  // Business Details
  businessType: 'BANK' | 'NBFC' | 'FINANCIAL_INSTITUTION';
  establishedYear: number;
  employeeCount: number;
  
  // Financial Information
  annualTurnover: number;
  netWorth: number;
  
  // Commission Structure
  commissionRates: {
    car: number;
    bike: number;
    commercial: number;
  };
  
  // API Integration
  apiEndpoint: string;
  webhookUrl: string;
  
  // Documents
  documents: {
    businessLicense: File | null;
    complianceCertificate: File | null;
    boardResolution: File | null;
    kycDocuments: File | null;
  };
  
  // Terms
  agreeToTerms: boolean;
  agreeToCommission: boolean;
}

export default function LenderRegistration() {
  const [formData, setFormData] = useState<LenderRegistrationData>({
    businessName: '',
    legalName: '',
    registrationNumber: '',
    gstNumber: '',
    panNumber: '',
    email: '',
    phone: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
    businessType: 'NBFC',
    establishedYear: new Date().getFullYear(),
    employeeCount: 0,
    annualTurnover: 0,
    netWorth: 0,
    commissionRates: {
      car: 1.5,
      bike: 2.0,
      commercial: 1.8,
    },
    apiEndpoint: '',
    webhookUrl: '',
    documents: {
      businessLicense: null,
      complianceCertificate: null,
      boardResolution: null,
      kycDocuments: null,
    },
    agreeToTerms: false,
    agreeToCommission: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof LenderRegistrationData] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file,
      },
    }));
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? All entered data will be lost.')) {
      // Clear any stored data
      localStorage.removeItem('lenderRegistrationData');
      window.location.href = '/';
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel registration? All entered data will be lost.')) {
      // Clear any stored data
      localStorage.removeItem('lenderRegistrationData');
      window.location.href = '/lender/login';
    }
  };

  const handleGoToLogin = () => {
    if (confirm('Do you want to go to login page? All entered data will be lost.')) {
      // Clear any stored data
      localStorage.removeItem('lenderRegistrationData');
      window.location.href = '/lender/login';
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to submit lender registration
      console.log('Submitting lender registration:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Lender registration submitted successfully! Our team will review and contact you within 2-3 business days.');
      window.location.href = '/lender/login';
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Error submitting registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter business name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Legal Name *
          </label>
          <input
            type="text"
            value={formData.legalName}
            onChange={(e) => handleInputChange('legalName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter legal name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Number *
          </label>
          <input
            type="text"
            value={formData.registrationNumber}
            onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter registration number"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GST Number *
          </label>
          <input
            type="text"
            value={formData.gstNumber}
            onChange={(e) => handleInputChange('gstNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter GST number"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PAN Number *
          </label>
          <input
            type="text"
            value={formData.panNumber}
            onChange={(e) => handleInputChange('panNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter PAN number"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type *
          </label>
          <select
            value={formData.businessType}
            onChange={(e) => handleInputChange('businessType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="BANK">Bank</option>
            <option value="NBFC">NBFC</option>
            <option value="FINANCIAL_INSTITUTION">Financial Institution</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter email address"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter phone number"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter website URL"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Established Year *
          </label>
          <input
            type="number"
            value={formData.establishedYear}
            onChange={(e) => handleInputChange('establishedYear', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="1900"
            max={new Date().getFullYear()}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={formData.address.street}
            onChange={(e) => handleInputChange('address.street', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Street address"
            required
          />
          <input
            type="text"
            value={formData.address.city}
            onChange={(e) => handleInputChange('address.city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="City"
            required
          />
          <input
            type="text"
            value={formData.address.state}
            onChange={(e) => handleInputChange('address.state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="State"
            required
          />
          <input
            type="text"
            value={formData.address.pincode}
            onChange={(e) => handleInputChange('address.pincode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Pincode"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Financial Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Turnover (₹) *
          </label>
          <input
            type="number"
            value={formData.annualTurnover}
            onChange={(e) => handleInputChange('annualTurnover', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter annual turnover"
            min="0"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Net Worth (₹) *
          </label>
          <input
            type="number"
            value={formData.netWorth}
            onChange={(e) => handleInputChange('netWorth', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter net worth"
            min="0"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee Count *
          </label>
          <input
            type="number"
            value={formData.employeeCount}
            onChange={(e) => handleInputChange('employeeCount', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter employee count"
            min="1"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Commission Structure</h3>
      <p className="text-sm text-gray-600 mb-4">
        Set your commission rates for different vehicle types. These rates will be used to calculate commissions for successful loan applications.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Car Loans (%) *
          </label>
          <input
            type="number"
            value={formData.commissionRates.car}
            onChange={(e) => handleInputChange('commissionRates.car', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="1.5"
            min="0"
            max="10"
            step="0.1"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bike Loans (%) *
          </label>
          <input
            type="number"
            value={formData.commissionRates.bike}
            onChange={(e) => handleInputChange('commissionRates.bike', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="2.0"
            min="0"
            max="10"
            step="0.1"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commercial Vehicles (%) *
          </label>
          <input
            type="number"
            value={formData.commissionRates.commercial}
            onChange={(e) => handleInputChange('commissionRates.commercial', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="1.8"
            min="0"
            max="10"
            step="0.1"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">API Integration</h3>
      <p className="text-sm text-gray-600 mb-4">
        Provide your API endpoints for seamless integration with the Fin5 platform.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Endpoint *
          </label>
          <input
            type="url"
            value={formData.apiEndpoint}
            onChange={(e) => handleInputChange('apiEndpoint', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://api.yourcompany.com/v1"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webhook URL
          </label>
          <input
            type="url"
            value={formData.webhookUrl}
            onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://api.yourcompany.com/webhooks"
          />
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Document Upload</h3>
      <p className="text-sm text-gray-600 mb-4">
        Please upload the required documents for verification. All documents should be in PDF format.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business License *
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileUpload('businessLicense', e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compliance Certificate *
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileUpload('complianceCertificate', e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Board Resolution
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileUpload('boardResolution', e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            KYC Documents *
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileUpload('kycDocuments', e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Terms & Conditions</h3>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
            I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> of Fin5 platform *
          </label>
        </div>
        
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="agreeToCommission"
            checked={formData.agreeToCommission}
            onChange={(e) => handleInputChange('agreeToCommission', e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="agreeToCommission" className="text-sm text-gray-700">
            I agree to the commission structure and payment terms as outlined in the <a href="/commission-terms" className="text-blue-600 hover:underline">Commission Agreement</a> *
          </label>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Important Information</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your application will be reviewed within 2-3 business days</li>
          <li>• You will receive an email confirmation once approved</li>
          <li>• API credentials will be provided after approval</li>
          <li>• Commission payments are processed monthly</li>
        </ul>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      default: return renderStep1();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName && formData.legalName && formData.registrationNumber && formData.gstNumber && formData.panNumber;
      case 2:
        return formData.email && formData.phone && formData.address.street && formData.address.city && formData.address.state && formData.address.pincode;
      case 3:
        return formData.annualTurnover > 0 && formData.netWorth > 0 && formData.employeeCount > 0;
      case 4:
        return formData.commissionRates.car > 0 && formData.commissionRates.bike > 0 && formData.commissionRates.commercial > 0;
      case 5:
        return formData.apiEndpoint;
      case 6:
        return formData.documents.businessLicense && formData.documents.complianceCertificate && formData.documents.kycDocuments;
      case 7:
        return formData.agreeToTerms && formData.agreeToCommission;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Fin5Logo size="lg" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Lender Registration</h1>
                <p className="text-sm text-gray-600">Join Fin5 as a lending partner</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-600">Step {currentStep} of 7</p>
                <p className="text-xs text-gray-500">Complete all steps to register</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleGoToLogin}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium border border-blue-200 hover:border-blue-300"
                >
                  Login
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              {renderCurrentStep()}
            </div>
            
            {/* Navigation */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
              <div className="flex space-x-3">
                <button
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>
                
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel Registration
                </button>
              </div>
              
              <div className="flex space-x-3">
                {currentStep < 7 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceed()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed() || loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? 'Submitting...' : 'Submit Registration'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 