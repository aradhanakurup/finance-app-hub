'use client';

import React, { useState, useEffect } from 'react';
import { LenderApplication, ApplicationStatus } from '../../types/lender';

interface ApplicationStatusTrackerProps {
  applicationId: string;
  onStatusUpdate?: (applications: LenderApplication[]) => void;
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  PENDING: 'bg-gray-100 text-gray-800',
  SUBMITTED: 'bg-blue-100 text-blue-800',
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CONDITIONAL_APPROVAL: 'bg-orange-100 text-orange-800',
  COUNTER_OFFER: 'bg-purple-100 text-purple-800',
  DOCUMENTS_REQUIRED: 'bg-indigo-100 text-indigo-800',
  FAILED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
};

const STATUS_ICONS: Record<ApplicationStatus, string> = {
  PENDING: '⏳',
  SUBMITTED: '📤',
  UNDER_REVIEW: '🔍',
  APPROVED: '✅',
  REJECTED: '❌',
  CONDITIONAL_APPROVAL: '⚠️',
  COUNTER_OFFER: '💰',
  DOCUMENTS_REQUIRED: '📄',
  FAILED: '💥',
  EXPIRED: '⏰',
};

export default function ApplicationStatusTracker({
  applicationId,
  onStatusUpdate,
}: ApplicationStatusTrackerProps) {
  const [applications, setApplications] = useState<LenderApplication[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [offers, setOffers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    // Validate applicationId before making API calls
    if (!applicationId || !/^[A-Za-z0-9-_]+$/.test(applicationId.trim())) {
      setError('Invalid application ID format');
      setLoading(false);
      return;
    }
    
    fetchStatus();
    
    if (autoRefresh) {
      const interval = setInterval(fetchStatus, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [applicationId, autoRefresh]);

  const fetchStatus = async () => {
    // Additional validation before making the API call
    if (!applicationId || !/^[A-Za-z0-9-_]+$/.test(applicationId.trim())) {
      setError('Invalid application ID format');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/applications/${applicationId}/status`);
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.data.applications);
        setSummary(data.data.summary);
        setOffers(data.data.offers);
        onStatusUpdate?.(data.data.applications);
      } else {
        setError(data.message || 'Failed to fetch status');
      }
    } catch (error) {
      setError('Failed to fetch application status');
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (lenderId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'retry', lenderId }),
      });
      
      const data = await response.json();
      if (data.success) {
        fetchStatus(); // Refresh status
      }
    } catch (error) {
      console.error('Error retrying application:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatEMI = (principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / 12 / 100;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    return formatCurrency(Math.round(emi));
  };

  if (loading && applications.length === 0) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 h-24"></div>
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
          onClick={fetchStatus}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Application Status Tracker
          </h3>
          <p className="text-sm text-gray-600">
            Application ID: {applicationId}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">Auto-refresh</span>
          </label>
          <button
            onClick={fetchStatus}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{summary.totalLenders}</div>
            <div className="text-sm text-gray-600">Total Lenders</div>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{summary.approvedLenders}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{summary.pendingLenders}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{summary.rejectedLenders}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>
      )}

      {/* Best offers */}
      {offers?.bestOffer && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">🏆 Best Offer Available</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Lender</div>
              <div className="font-semibold">{offers.bestOffer.lenderName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Interest Rate</div>
              <div className="font-semibold text-green-600">{offers.bestOffer.interestRate}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Approved Amount</div>
              <div className="font-semibold">{formatCurrency(offers.bestOffer.approvedAmount || 0)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">EMI</div>
              <div className="font-semibold">
                {offers.bestOffer.emiAmount ? formatCurrency(offers.bestOffer.emiAmount) : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lender applications */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Lender Responses</h4>
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🏦</div>
                <div>
                  <h5 className="font-semibold text-gray-900">{app.lenderName}</h5>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(app.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[app.status]}`}>
                  {STATUS_ICONS[app.status]} {app.status.replace('_', ' ')}
                </span>
                {app.status === 'FAILED' && (
                  <button
                    onClick={() => handleRetry(app.lenderId)}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>

            {/* Application details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {app.interestRate && (
                <div>
                  <span className="text-gray-500">Interest Rate:</span>
                  <div className="font-semibold text-green-600">{app.interestRate}%</div>
                </div>
              )}
              {app.approvedAmount && (
                <div>
                  <span className="text-gray-500">Approved Amount:</span>
                  <div className="font-semibold">{formatCurrency(app.approvedAmount)}</div>
                </div>
              )}
              {app.emiAmount && (
                <div>
                  <span className="text-gray-500">EMI Amount:</span>
                  <div className="font-semibold">{formatCurrency(app.emiAmount)}</div>
                </div>
              )}
              {app.processingFee && (
                <div>
                  <span className="text-gray-500">Processing Fee:</span>
                  <div className="font-semibold">{formatCurrency(app.processingFee)}</div>
                </div>
              )}
              {app.responseTime && (
                <div>
                  <span className="text-gray-500">Response Time:</span>
                  <div className="font-semibold">{app.responseTime} min</div>
                </div>
              )}
              {app.retryCount > 0 && (
                <div>
                  <span className="text-gray-500">Retry Count:</span>
                  <div className="font-semibold">{app.retryCount}</div>
                </div>
              )}
            </div>

            {/* Additional information */}
            {app.rejectionReason && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                <div className="text-sm font-medium text-red-800">Rejection Reason:</div>
                <div className="text-sm text-red-700">{app.rejectionReason}</div>
              </div>
            )}

            {app.conditions && app.conditions.length > 0 && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <div className="text-sm font-medium text-yellow-800">Conditions:</div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {app.conditions.map((condition, index) => (
                    <li key={index}>• {condition}</li>
                  ))}
                </ul>
              </div>
            )}

            {app.counterOffer && (
              <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded">
                <div className="text-sm font-medium text-purple-800">Counter Offer:</div>
                <div className="grid grid-cols-3 gap-2 text-sm text-purple-700">
                  <div>Amount: {formatCurrency(app.counterOffer.amount)}</div>
                  <div>Tenure: {app.counterOffer.tenure} months</div>
                  <div>Rate: {app.counterOffer.rate}%</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No applications yet */}
      {applications.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">📋</div>
          <p className="text-gray-600">No lender responses yet. Applications are being processed.</p>
        </div>
      )}
    </div>
  );
} 