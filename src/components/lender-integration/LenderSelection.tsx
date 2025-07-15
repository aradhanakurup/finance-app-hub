'use client';

import React, { useState, useEffect } from 'react';
import { Lender } from '../../types/lender';

interface LenderSelectionProps {
  selectedLenders: string[];
  onLenderSelectionChange: (lenderIds: string[]) => void;
  customerData?: any;
  vehicleData?: any;
  financialData?: any;
}

export default function LenderSelection({
  selectedLenders,
  onLenderSelectionChange,
  customerData,
  vehicleData,
  financialData,
}: LenderSelectionProps) {
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchLenders();
  }, []);

  const fetchLenders = async (isRetry = false) => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      const response = await fetch('/api/lenders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setLenders(data.data);
        setRetryCount(0); // Reset retry count on success
      } else {
        setError(data.message || 'Failed to fetch lenders');
      }
    } catch (error) {
      console.error('Error fetching lenders:', error);
      
      // Retry logic with exponential backoff
      if (!isRetry && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchLenders(true);
        }, delay);
        return;
      }
      
      setError('Failed to fetch lenders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLenderToggle = (lenderId: string) => {
    const newSelection = selectedLenders.includes(lenderId)
      ? selectedLenders.filter(id => id !== lenderId)
      : [...selectedLenders, lenderId];
    
    onLenderSelectionChange(newSelection);
  };

  const isLenderCompatible = (lender: Lender): { compatible: boolean; reasons: string[] } => {
    const reasons: string[] = [];
    let compatible = true;

    if (customerData?.financialInfo?.creditScore) {
      if (customerData.financialInfo.creditScore < lender.minCreditScore) {
        reasons.push(`Credit score too low (${customerData.financialInfo.creditScore} < ${lender.minCreditScore})`);
        compatible = false;
      }
    }

    if (financialData?.requestedAmount) {
      if (financialData.requestedAmount < lender.minLoanAmount) {
        reasons.push(`Loan amount too low (₹${financialData.requestedAmount.toLocaleString()} < ₹${lender.minLoanAmount.toLocaleString()})`);
        compatible = false;
      }
      if (financialData.requestedAmount > lender.maxLoanAmount) {
        reasons.push(`Loan amount too high (₹${financialData.requestedAmount.toLocaleString()} > ₹${lender.maxLoanAmount.toLocaleString()})`);
        compatible = false;
      }
    }

    if (vehicleData?.make && !lender.supportedVehicleTypes.includes(vehicleData.make.toLowerCase())) {
      reasons.push(`Vehicle type ${vehicleData.make} not supported`);
      compatible = false;
    }

    if (customerData?.employmentInfo?.employmentType && 
        !lender.supportedEmploymentTypes.includes(customerData.employmentInfo.employmentType)) {
      reasons.push(`Employment type ${customerData.employmentInfo.employmentType} not supported`);
      compatible = false;
    }

    return { compatible, reasons };
  };

  const getLenderLogo = (lenderId: string): string => {
    const logoMap: Record<string, string> = {
      'hdfc-bank': '🏦',
      'icici-bank': '🏛️',
      'bajaj-finserv': '🏢',
      'mahindra-finance': '🚗',
      'sbi': '🏦',
    };
    return logoMap[lenderId] || '🏦';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">⚠️</div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => fetchLenders()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Select Lenders for Application
        </h3>
        <p className="text-gray-600 text-sm">
          Choose the lenders you want to submit your application to. We&apos;ll automatically select the best matches based on your profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lenders.map((lender) => {
          const compatibility = isLenderCompatible(lender);
          const isSelected = selectedLenders.includes(lender.id);
          const isDisabled = !compatibility.compatible;

          return (
            <div
              key={lender.id}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-green-500 bg-green-50'
                  : isDisabled
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }`}
              onClick={() => !isDisabled && handleLenderToggle(lender.id)}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Lender header */}
              <div className="flex items-center mb-3">
                <div className="text-2xl mr-3">{getLenderLogo(lender.id)}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{lender.name}</h4>
                  <p className="text-xs text-gray-500">
                    {lender.isActive ? '🟢 Active' : '🔴 Inactive'}
                  </p>
                </div>
              </div>

              {/* Performance metrics */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div>
                  <span className="text-gray-500">Approval Rate:</span>
                  <div className="font-semibold text-green-600">
                    {(lender.approvalRate * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Avg Response:</span>
                  <div className="font-semibold text-blue-600">
                    {lender.avgResponseTime} min
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Min Credit:</span>
                  <div className="font-semibold">{lender.minCreditScore}</div>
                </div>
                <div>
                  <span className="text-gray-500">Processing Fee:</span>
                  <div className="font-semibold">₹{lender.processingFee.toLocaleString()}</div>
                </div>
              </div>

              {/* Loan amount range */}
              <div className="mb-3 text-xs">
                <span className="text-gray-500">Loan Range:</span>
                <div className="font-semibold">
                  ₹{lender.minLoanAmount.toLocaleString()} - ₹{lender.maxLoanAmount.toLocaleString()}
                </div>
              </div>

              {/* Compatibility status */}
              {!compatibility.compatible && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs">
                  <div className="font-semibold text-red-700 mb-1">Not Compatible:</div>
                  <ul className="text-red-600 space-y-1">
                    {compatibility.reasons.map((reason, index) => (
                      <li key={index}>• {reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Supported types */}
              <div className="mt-3 text-xs">
                <div className="text-gray-500 mb-1">Supported:</div>
                <div className="flex flex-wrap gap-1">
                  {lender.supportedVehicleTypes.slice(0, 3).map((type) => (
                    <span key={type} className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {type}
                    </span>
                  ))}
                  {lender.supportedVehicleTypes.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      +{lender.supportedVehicleTypes.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-blue-900">
              Selected Lenders: {selectedLenders.length}
            </h4>
            <p className="text-sm text-blue-700">
              {selectedLenders.length > 0
                ? `Applications will be submitted to ${selectedLenders.length} lender(s)`
                : 'No lenders selected. We&apos;ll auto-select the best matches.'}
            </p>
          </div>
          {selectedLenders.length > 0 && (
            <button
              onClick={() => onLenderSelectionChange([])}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 