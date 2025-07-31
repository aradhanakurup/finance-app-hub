'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '../../components/admin/AdminDashboard';
import AnalyticsDashboard from '../../components/analytics/AnalyticsDashboard';
import ApplicationStatusTracker from '../../components/lender-integration/ApplicationStatusTracker';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import Link from 'next/link';

export default function AdminPage() {
  const [activeView, setActiveView] = useState<'analytics' | 'dashboard' | 'tracker'>('analytics');
  const [applicationId, setApplicationId] = useState('');
  const [isValidApplicationId, setIsValidApplicationId] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Remove admin token cookie
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
  };

  const handleApplicationIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApplicationId(value);
    
    // Validate application ID format (should be alphanumeric with hyphens/underscores)
    const isValid = /^[A-Za-z0-9-_]+$/.test(value.trim()) && value.trim().length > 0;
    setIsValidApplicationId(isValid);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Top Navigation */}
      <div className="absolute top-20 left-4 z-10">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200 bg-white px-3 py-2 rounded-lg shadow-sm"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Back to Home
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveView('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeView === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Analytics Dashboard
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeView === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📈 Performance Overview
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
        {activeView === 'analytics' ? (
          <AnalyticsDashboard />
        ) : activeView === 'dashboard' ? (
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
                  onChange={handleApplicationIdChange}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    applicationId && !isValidApplicationId ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <button
                  onClick={() => {
                    if (isValidApplicationId) {
                      // The tracker will automatically fetch when applicationId changes
                    }
                  }}
                  disabled={!isValidApplicationId}
                  className={`px-6 py-2 rounded-lg ${
                    isValidApplicationId 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Track
                </button>
              </div>
              {applicationId && !isValidApplicationId && (
                <p className="text-sm text-red-600 mt-2">
                  Please enter a valid application ID (alphanumeric characters, hyphens, and underscores only)
                </p>
              )}
              <p className="text-sm text-gray-600 mt-2">
                Enter an application ID to track its status across all lenders
              </p>
            </div>

            {/* Application Status Tracker */}
            {isValidApplicationId && applicationId.trim() && (
              <ApplicationStatusTracker applicationId={applicationId.trim()} />
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
} 