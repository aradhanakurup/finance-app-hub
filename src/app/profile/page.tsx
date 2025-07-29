'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Fin5Logo } from '../../components/Fin5Logo';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isEmailVerified: boolean;
  profile: {
    id: string;
    aadhaar: string | null;
    pan: string | null;
    dateOfBirth: string | null;
    addressStreet: string | null;
    addressCity: string | null;
    addressState: string | null;
    addressPincode: string | null;
    employmentType: string | null;
    companyName: string | null;
    designation: string | null;
    monthlyIncome: number | null;
    experience: number | null;
    creditScore: number | null;
    existingEmis: number | null;
    bankName: string | null;
    accountNumber: string | null;
    ifscCode: string | null;
  };
}

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'),
  aadhaar: z.string().regex(/^[0-9]{12}$/, 'Aadhaar must be 12 digits').optional().or(z.literal('')),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number').optional().or(z.literal('')),
  dateOfBirth: z.string().optional(),
  addressStreet: z.string().min(5, 'Address must be at least 5 characters').optional().or(z.literal('')),
  addressCity: z.string().min(2, 'City must be at least 2 characters').optional().or(z.literal('')),
  addressState: z.string().min(2, 'State must be at least 2 characters').optional().or(z.literal('')),
  addressPincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode').optional().or(z.literal('')),
  employmentType: z.enum(['SALARIED', 'SELF_EMPLOYED', 'BUSINESS_OWNER', 'FREELANCER', 'RETIRED', 'STUDENT']).optional(),
  companyName: z.string().min(2, 'Company name must be at least 2 characters').optional().or(z.literal('')),
  designation: z.string().min(2, 'Designation must be at least 2 characters').optional().or(z.literal('')),
  monthlyIncome: z.number().min(1000, 'Monthly income must be at least ₹1,000').optional(),
  experience: z.number().min(0, 'Experience cannot be negative').max(50, 'Experience cannot exceed 50 years').optional(),
  creditScore: z.number().min(300, 'Credit score must be at least 300').max(900, 'Credit score cannot exceed 900').optional(),
  existingEmis: z.number().min(0, 'Existing EMIs cannot be negative').optional(),
  bankName: z.string().min(2, 'Bank name must be at least 2 characters').optional().or(z.literal('')),
  accountNumber: z.string().min(10, 'Account number must be at least 10 digits').optional().or(z.literal('')),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // Pre-fill form with existing data
        reset({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.user.phone || '',
          aadhaar: data.user.profile?.aadhaar || '',
          pan: data.user.profile?.pan || '',
          dateOfBirth: data.user.profile?.dateOfBirth ? new Date(data.user.profile.dateOfBirth).toISOString().split('T')[0] : '',
          addressStreet: data.user.profile?.addressStreet || '',
          addressCity: data.user.profile?.addressCity || '',
          addressState: data.user.profile?.addressState || '',
          addressPincode: data.user.profile?.addressPincode || '',
          employmentType: data.user.profile?.employmentType || undefined,
          companyName: data.user.profile?.companyName || '',
          designation: data.user.profile?.designation || '',
          monthlyIncome: data.user.profile?.monthlyIncome || undefined,
          experience: data.user.profile?.experience || undefined,
          creditScore: data.user.profile?.creditScore || undefined,
          existingEmis: data.user.profile?.existingEmis || undefined,
          bankName: data.user.profile?.bankName || '',
          accountNumber: data.user.profile?.accountNumber || '',
          ifscCode: data.user.profile?.ifscCode || '',
        });
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        // Refresh user data
        await fetchUserData();
      } else {
        setError(result.error || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-2">
                Update your personal information and account details
              </p>
            </div>
            <div className="flex space-x-3">
              <a
                href="/dashboard"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">{success}</h3>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    {...register('firstName')}
                    type="text"
                    id="firstName"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    {...register('lastName')}
                    type="text"
                    id="lastName"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    disabled
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    id="phone"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Identity Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Identity Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700">
                    Aadhaar Number
                  </label>
                  <input
                    {...register('aadhaar')}
                    type="text"
                    id="aadhaar"
                    maxLength={12}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="12-digit Aadhaar number"
                  />
                  {errors.aadhaar && (
                    <p className="mt-1 text-sm text-red-600">{errors.aadhaar.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="pan" className="block text-sm font-medium text-gray-700">
                    PAN Number
                  </label>
                  <input
                    {...register('pan')}
                    type="text"
                    id="pan"
                    maxLength={10}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="ABCDE1234F"
                  />
                  {errors.pan && (
                    <p className="mt-1 text-sm text-red-600">{errors.pan.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    {...register('dateOfBirth')}
                    type="date"
                    id="dateOfBirth"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="addressStreet" className="block text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <input
                    {...register('addressStreet')}
                    type="text"
                    id="addressStreet"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.addressStreet && (
                    <p className="mt-1 text-sm text-red-600">{errors.addressStreet.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="addressCity" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    {...register('addressCity')}
                    type="text"
                    id="addressCity"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.addressCity && (
                    <p className="mt-1 text-sm text-red-600">{errors.addressCity.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="addressState" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    {...register('addressState')}
                    type="text"
                    id="addressState"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.addressState && (
                    <p className="mt-1 text-sm text-red-600">{errors.addressState.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="addressPincode" className="block text-sm font-medium text-gray-700">
                    Pincode
                  </label>
                  <input
                    {...register('addressPincode')}
                    type="text"
                    id="addressPincode"
                    maxLength={6}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.addressPincode && (
                    <p className="mt-1 text-sm text-red-600">{errors.addressPincode.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">
                    Employment Type
                  </label>
                  <select
                    {...register('employmentType')}
                    id="employmentType"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select employment type</option>
                    <option value="SALARIED">Salaried</option>
                    <option value="SELF_EMPLOYED">Self Employed</option>
                    <option value="BUSINESS_OWNER">Business Owner</option>
                    <option value="FREELANCER">Freelancer</option>
                    <option value="RETIRED">Retired</option>
                    <option value="STUDENT">Student</option>
                  </select>
                  {errors.employmentType && (
                    <p className="mt-1 text-sm text-red-600">{errors.employmentType.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    {...register('companyName')}
                    type="text"
                    id="companyName"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                    Designation
                  </label>
                  <input
                    {...register('designation')}
                    type="text"
                    id="designation"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.designation && (
                    <p className="mt-1 text-sm text-red-600">{errors.designation.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700">
                    Monthly Income (₹)
                  </label>
                  <input
                    {...register('monthlyIncome', { valueAsNumber: true })}
                    type="number"
                    id="monthlyIncome"
                    min="1000"
                    step="1000"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.monthlyIncome && (
                    <p className="mt-1 text-sm text-red-600">{errors.monthlyIncome.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Years of Experience
                  </label>
                  <input
                    {...register('experience', { valueAsNumber: true })}
                    type="number"
                    id="experience"
                    min="0"
                    max="50"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="creditScore" className="block text-sm font-medium text-gray-700">
                    Credit Score
                  </label>
                  <input
                    {...register('creditScore', { valueAsNumber: true })}
                    type="number"
                    id="creditScore"
                    min="300"
                    max="900"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.creditScore && (
                    <p className="mt-1 text-sm text-red-600">{errors.creditScore.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="existingEmis" className="block text-sm font-medium text-gray-700">
                    Existing EMIs (₹)
                  </label>
                  <input
                    {...register('existingEmis', { valueAsNumber: true })}
                    type="number"
                    id="existingEmis"
                    min="0"
                    step="1000"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.existingEmis && (
                    <p className="mt-1 text-sm text-red-600">{errors.existingEmis.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                    Bank Name
                  </label>
                  <input
                    {...register('bankName')}
                    type="text"
                    id="bankName"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.bankName && (
                    <p className="mt-1 text-sm text-red-600">{errors.bankName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                    Account Number
                  </label>
                  <input
                    {...register('accountNumber')}
                    type="text"
                    id="accountNumber"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.accountNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.accountNumber.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">
                    IFSC Code
                  </label>
                  <input
                    {...register('ifscCode')}
                    type="text"
                    id="ifscCode"
                    maxLength={11}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="ABCD0001234"
                  />
                  {errors.ifscCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.ifscCode.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving || !isDirty}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
} 