'use client';

import React from 'react';
import { PAYMENT_CONFIG, formatCurrency } from '@/config/payments';

interface PlanSelectionProps {
  selectedPlan: string;
  onPlanSelect: (plan: string) => void;
}

export default function PlanSelection({ selectedPlan, onPlanSelect }: PlanSelectionProps) {
  const plans = PAYMENT_CONFIG.dealerRegistration;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h3>
        <p className="text-gray-600">Select the plan that best fits your dealership needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(plans).map(([planKey, plan]) => {
          const isSelected = selectedPlan === planKey;
          const paymentBreakdown = calculatePaymentBreakdown(plan.price);

          return (
            <div
              key={planKey}
              className={`relative border rounded-lg p-6 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => onPlanSelect(planKey)}
            >
              {isSelected && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Selected
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    {formatCurrency(plan.price)}
                  </span>
                  <span className="text-gray-500">/{plan.duration}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Fee:</span>
                    <span className="font-medium">{formatCurrency(plan.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%):</span>
                    <span className="font-medium">{formatCurrency(paymentBreakdown.gstAmount)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(paymentBreakdown.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Refund Policy */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <svg
            className="w-5 h-5 text-green-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium text-green-800">
            {PAYMENT_CONFIG.refundPolicy.description}
          </span>
        </div>
        <ul className="text-sm text-green-700 space-y-1">
          {PAYMENT_CONFIG.refundPolicy.terms.map((term, index) => (
            <li key={index} className="flex items-center">
              <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
              {term}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Helper function to calculate payment breakdown
function calculatePaymentBreakdown(baseAmount: number) {
  const gstAmount = Math.round(baseAmount * 0.18);
  const totalAmount = baseAmount + gstAmount;
  
  return {
    baseAmount,
    gstAmount,
    totalAmount,
  };
} 