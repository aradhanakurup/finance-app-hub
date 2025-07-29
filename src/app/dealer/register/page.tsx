'use client';

import React, { useState } from 'react';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { Fin5Logo } from '../../../components/Fin5Logo';
import PlanSelection from '../../../components/dealer/PlanSelection';
import PaymentForm from '../../../components/dealer/PaymentForm';

export default function DealerRegistrationPage() {
  const [step, setStep] = useState<'form' | 'plan' | 'payment' | 'success'>('form');
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstNumber: '',
    dealershipType: 'individual',
    yearsInBusiness: '',
    monthlySales: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Check if all required fields are filled
    const requiredFields = ['businessName', 'ownerName', 'email', 'phone', 'address', 'city', 'state', 'pincode', 'gstNumber'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setStep('plan');
  };

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    setStep('payment');
  };

  const handlePaymentSuccess = (paymentData: any) => {
    setStep('success');
    // In production, you would save the dealer data and payment info to your database
    console.log('Payment successful:', paymentData);
  };

  const handlePaymentError = (error: string) => {
    setError(error);
    setStep('payment');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const goBack = () => {
    if (step === 'plan') setStep('form');
    if (step === 'payment') setStep('plan');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="mb-6">
                <Fin5Logo size="lg" showTagline={true} />
              </div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Registration Successful!</h1>
              <p className="text-blue-700">Welcome to Fin5! Your dealer account has been created.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Completed!</h2>
              <p className="text-gray-600 mb-6">
                Your dealer account is now active. You'll receive a welcome email with login credentials within 24 hours.
              </p>
              
              <div className="space-y-4">
                <a
                  href="/dealer/login"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-block"
                >
                  Go to Login
                </a>
                <a
                  href="/"
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-semibold inline-block"
                >
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="mb-6">
              <Fin5Logo size="lg" showTagline={true} />
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Dealer Registration</h1>
            <p className="text-blue-700">Join Fin5 as a dealer and streamline your financing process</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[
                { step: 'form', label: 'Business Info', icon: '📝' },
                { step: 'plan', label: 'Choose Plan', icon: '📋' },
                { step: 'payment', label: 'Payment', icon: '💳' },
              ].map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step === item.step 
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : index < ['form', 'plan', 'payment'].indexOf(step)
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    <span className="text-sm">{item.icon}</span>
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    step === item.step ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                  {index < 2 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      index < ['form', 'plan', 'payment'].indexOf(step) ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {step === 'form' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Business Information</h2>
              
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Business Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your Dealership Name"
                      />
                    </div>

                    <div>
                      <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                        Owner Name *
                      </label>
                      <input
                        type="text"
                        id="ownerName"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Full Name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="business@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Address *
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Complete business address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="State"
                        />
                      </div>

                      <div>
                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="PIN Code"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        GST Number *
                      </label>
                      <input
                        type="text"
                        id="gstNumber"
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="GST Number"
                      />
                    </div>

                    <div>
                      <label htmlFor="dealershipType" className="block text-sm font-medium text-gray-700 mb-2">
                        Dealership Type *
                      </label>
                      <select
                        id="dealershipType"
                        name="dealershipType"
                        value={formData.dealershipType}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="individual">Individual</option>
                        <option value="partnership">Partnership</option>
                        <option value="private-limited">Private Limited</option>
                        <option value="public-limited">Public Limited</option>
                        <option value="llp">LLP</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="yearsInBusiness" className="block text-sm font-medium text-gray-700 mb-2">
                        Years in Business *
                      </label>
                      <input
                        type="number"
                        id="yearsInBusiness"
                        name="yearsInBusiness"
                        value={formData.yearsInBusiness}
                        onChange={handleChange}
                        required
                        min="0"
                        max="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Number of years"
                      />
                    </div>

                    <div>
                      <label htmlFor="monthlySales" className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Sales Volume *
                      </label>
                      <select
                        id="monthlySales"
                        name="monthlySales"
                        value={formData.monthlySales}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select range</option>
                        <option value="0-5">0-5 vehicles</option>
                        <option value="5-10">5-10 vehicles</option>
                        <option value="10-25">10-25 vehicles</option>
                        <option value="25-50">25-50 vehicles</option>
                        <option value="50+">50+ vehicles</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Account Security */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Minimum 8 characters"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="/terms" className="text-blue-600 hover:text-blue-500">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Continue to Plan Selection
                </button>
              </form>
            </div>
          )}

          {step === 'plan' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
                <button
                  onClick={goBack}
                  className="text-blue-600 hover:text-blue-500 text-sm"
                >
                  ← Back to Form
                </button>
              </div>
              
              <PlanSelection
                selectedPlan={selectedPlan}
                onPlanSelect={handlePlanSelect}
              />
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
                <button
                  onClick={goBack}
                  className="text-blue-600 hover:text-blue-500 text-sm"
                >
                  ← Back to Plans
                </button>
              </div>
              
              <PaymentForm
                planType={selectedPlan}
                dealerData={formData}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </div>
          )}

          <div className="mt-8 text-center">
            <a href="/" className="text-blue-600 hover:text-blue-500 text-sm">
              ← Back to Fin5 Home
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 