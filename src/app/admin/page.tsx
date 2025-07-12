'use client';

import React, { useState } from 'react';
import AdminDashboard from '../../components/admin/AdminDashboard';
import ApplicationStatusTracker from '../../components/lender-integration/ApplicationStatusTracker';

export default function AdminPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'tracker'>('dashboard');
  const [applicationId, setApplicationId] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor lender performance, track applications, and manage the auto finance platform
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeView === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Analytics Dashboard
            </button>
            <button
              onClick={() => setActiveView('tracker')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeView === 'tracker'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Application Tracker
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeView === 'dashboard' ? (
          <AdminDashboard />
        ) : (
          <div className="space-y-6">
            {/* Application ID Input */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Track Application Status
              </h3>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Enter Application ID (e.g., APP-1234567890-abc123)"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => {
                    if (applicationId.trim()) {
                      // The tracker will automatically fetch when applicationId changes
                    }
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Track
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Enter an application ID to track its status across all lenders
              </p>
            </div>

            {/* Application Status Tracker */}
            {applicationId.trim() && (
              <ApplicationStatusTracker applicationId={applicationId.trim()} />
            )}
          </div>
        )}
      </div>
    </div>
  );
} 