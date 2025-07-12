'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const dealerSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format'),
  contactPerson: z.string().min(2, 'Contact person name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  addressStreet: z.string().min(5, 'Address must be at least 5 characters'),
  addressCity: z.string().min(2, 'City must be at least 2 characters'),
  addressState: z.string().min(2, 'State must be at least 2 characters'),
  addressPincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid pincode'),
  businessType: z.enum(['INDIVIDUAL', 'PARTNERSHIP', 'COMPANY']),
  registrationDate: z.string(),
  dealershipType: z.array(z.enum(['CAR', 'BIKE', 'COMMERCIAL', 'MULTI_BRAND'])).min(1, 'Select at least one dealership type'),
  brands: z.array(z.string()).min(1, 'Select at least one brand'),
});

type DealerFormData = z.infer<typeof dealerSchema>;

const businessTypes = [
  { value: 'INDIVIDUAL', label: 'Individual Proprietorship' },
  { value: 'PARTNERSHIP', label: 'Partnership Firm' },
  { value: 'COMPANY', label: 'Private Limited Company' },
];

const dealershipTypes = [
  { value: 'CAR', label: 'Car Dealership' },
  { value: 'BIKE', label: 'Bike Dealership' },
  { value: 'COMMERCIAL', label: 'Commercial Vehicle' },
  { value: 'MULTI_BRAND', label: 'Multi-Brand' },
];

const popularBrands = [
  'Maruti Suzuki', 'Hyundai', 'Honda', 'Tata', 'Mahindra',
  'Toyota', 'Kia', 'MG', 'Skoda', 'Volkswagen',
  'BMW', 'Mercedes-Benz', 'Audi', 'Jaguar', 'Land Rover',
  'Bajaj', 'Hero', 'TVS', 'Royal Enfield', 'Yamaha',
];

export default function DealerRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DealerFormData>({
    resolver: zodResolver(dealerSchema),
  });

  const selectedDealershipTypes = watch('dealershipType') || [];

  const onSubmit = async (data: DealerFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/dealers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          brands: selectedBrands,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      toast({
        title: 'Registration Submitted',
        description: 'Your dealer registration has been submitted successfully. We will review and get back to you within 24-48 hours.',
      });

      // Reset form
      setSelectedBrands([]);
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'There was an error submitting your registration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDealershipTypeChange = (type: string) => {
    const current = selectedDealershipTypes;
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    setValue('dealershipType', updated);
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dealer Registration
        </h1>
        <p className="text-gray-600">
          Join our network of trusted dealers and streamline your vehicle financing process.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Business Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Business Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <Input
                {...register('businessName')}
                placeholder="Enter business name"
                className={errors.businessName ? 'border-red-500' : ''}
              />
              {errors.businessName && (
                <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Number *
              </label>
              <Input
                {...register('gstNumber')}
                placeholder="22AAAAA0000A1Z5"
                className={errors.gstNumber ? 'border-red-500' : ''}
              />
              {errors.gstNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.gstNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN Number *
              </label>
              <Input
                {...register('panNumber')}
                placeholder="ABCDE1234F"
                className={errors.panNumber ? 'border-red-500' : ''}
              />
              {errors.panNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.panNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Type *
              </label>
              <select
                {...register('businessType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select business type</option>
                {businessTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.businessType && (
                <p className="text-red-500 text-sm mt-1">{errors.businessType.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person *
              </label>
              <Input
                {...register('contactPerson')}
                placeholder="Full name"
                className={errors.contactPerson ? 'border-red-500' : ''}
              />
              {errors.contactPerson && (
                <p className="text-red-500 text-sm mt-1">{errors.contactPerson.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <Input
                {...register('email')}
                type="email"
                placeholder="contact@dealership.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <Input
                {...register('phone')}
                placeholder="9876543210"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Date *
              </label>
              <Input
                {...register('registrationDate')}
                type="date"
                className={errors.registrationDate ? 'border-red-500' : ''}
              />
              {errors.registrationDate && (
                <p className="text-red-500 text-sm mt-1">{errors.registrationDate.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Business Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <Input
                {...register('addressStreet')}
                placeholder="Complete street address"
                className={errors.addressStreet ? 'border-red-500' : ''}
              />
              {errors.addressStreet && (
                <p className="text-red-500 text-sm mt-1">{errors.addressStreet.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <Input
                {...register('addressCity')}
                placeholder="City"
                className={errors.addressCity ? 'border-red-500' : ''}
              />
              {errors.addressCity && (
                <p className="text-red-500 text-sm mt-1">{errors.addressCity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <Input
                {...register('addressState')}
                placeholder="State"
                className={errors.addressState ? 'border-red-500' : ''}
              />
              {errors.addressState && (
                <p className="text-red-500 text-sm mt-1">{errors.addressState.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode *
              </label>
              <Input
                {...register('addressPincode')}
                placeholder="123456"
                className={errors.addressPincode ? 'border-red-500' : ''}
              />
              {errors.addressPincode && (
                <p className="text-red-500 text-sm mt-1">{errors.addressPincode.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Dealership Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Dealership Information</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dealership Type * (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {dealershipTypes.map(type => (
                <label key={type.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedDealershipTypes.includes(type.value)}
                    onChange={() => handleDealershipTypeChange(type.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </div>
            {errors.dealershipType && (
              <p className="text-red-500 text-sm mt-1">{errors.dealershipType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Supported Brands * (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-4">
              {popularBrands.map(brand => (
                <label key={brand} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{brand}</span>
                </label>
              ))}
            </div>
            {selectedBrands.length === 0 && (
              <p className="text-red-500 text-sm mt-1">Please select at least one brand</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || selectedBrands.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </Button>
        </div>
      </form>
    </div>
  );
} 