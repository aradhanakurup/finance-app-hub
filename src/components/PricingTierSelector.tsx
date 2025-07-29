'use client';

import React, { useState } from 'react';
import { PRICING_CONFIG, calculateApplicationPrice, formatCurrency } from '@/config/pricing';

interface PricingTierSelectorProps {
  onTierSelect: (tier: 'free' | 'premium') => void;
  selectedTier: 'free' | 'premium';
  currentUsage?: number;
}

export function PricingTierSelector({ onTierSelect, selectedTier, currentUsage = 0 }: PricingTierSelectorProps) {
  const [showDetails, setShowDetails] = useState(false);

  const freeTier = PRICING_CONFIG.mainPageApplications.free;
  const premiumTier = PRICING_CONFIG.mainPageApplications.premium;

  const getUsageStatus = () => {
    if (selectedTier === 'premium') {
      return { canSubmit: true, remaining: 'Unlimited', percentage: 0 };
    }
    
    const remaining = Math.max(0, freeTier.applicationsPerMonth - currentUsage);
    const percentage = (currentUsage / freeTier.applicationsPerMonth) * 100;
    
    return {
      canSubmit: remaining > 0,
      remaining,
      percentage: Math.min(100, percentage),
    };
  };

  const usageStatus = getUsageStatus();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Your Plan</h3>
        <p className="text-gray-600">Select the plan that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Tier */}
        <div className={`border-2 rounded-lg p-6 transition-all ${
          selectedTier === 'free' 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}>
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{freeTier.name}</h4>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ₹{freeTier.price}
            </div>
            <p className="text-sm text-gray-600">per application</p>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Applications this month:</span>
              <span className="font-medium">{currentUsage}/{freeTier.applicationsPerMonth}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${usageStatus.percentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {usageStatus.remaining} applications remaining
            </p>
          </div>

          <ul className="space-y-2 mb-6">
            {freeTier.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => onTierSelect('free')}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              selectedTier === 'free'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {selectedTier === 'free' ? 'Selected' : 'Select Free Plan'}
          </button>
        </div>

        {/* Premium Tier */}
        <div className={`border-2 rounded-lg p-6 transition-all ${
          selectedTier === 'premium' 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}>
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-2">
              <h4 className="text-lg font-semibold text-gray-900">{premiumTier.name}</h4>
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Recommended</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ₹{premiumTier.price}
            </div>
            <p className="text-sm text-gray-600 mb-2">per application</p>
            <p className="text-sm text-blue-600 font-medium">or ₹{premiumTier.monthlyPrice}/month unlimited</p>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Applications:</span>
              <span className="font-medium text-green-600">Unlimited</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-full"></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">No limits on applications</p>
          </div>

          <ul className="space-y-2 mb-6">
            {premiumTier.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => onTierSelect('premium')}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              selectedTier === 'premium'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {selectedTier === 'premium' ? 'Selected' : 'Select Premium Plan'}
          </button>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="mt-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {showDetails ? 'Hide' : 'Show'} detailed comparison
        </button>

        {showDetails && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-3">Plan Comparison</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h6 className="font-medium text-gray-700 mb-2">Free Tier Limitations:</h6>
                <ul className="space-y-1 text-gray-600">
                  {freeTier.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-3 h-3 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      {limitation}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h6 className="font-medium text-gray-700 mb-2">Premium Benefits:</h6>
                <ul className="space-y-1 text-gray-600">
                  {premiumTier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h6 className="font-medium text-gray-700 mb-2">Dealer Alternative:</h6>
                <p className="text-gray-600 mb-2">
                  For high-volume users, consider our dealer plans starting at ₹9,999/year with up to 50 applications per month.
                </p>
                <a 
                  href="/dealer/register" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Learn more about dealer plans →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Selection Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="font-semibold text-gray-900">
              Selected: {selectedTier === 'free' ? freeTier.name : premiumTier.name}
            </h5>
            <p className="text-sm text-gray-600">
              {selectedTier === 'free' 
                ? `${usageStatus.remaining} applications remaining this month`
                : 'Unlimited applications with priority processing'
              }
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {selectedTier === 'free' ? 'Free' : `₹${premiumTier.price} per application`}
            </div>
            {selectedTier === 'premium' && (
              <div className="text-sm text-gray-600">
                or ₹{premiumTier.monthlyPrice}/month unlimited
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 