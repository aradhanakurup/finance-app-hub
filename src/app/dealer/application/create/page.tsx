'use client';

import React, { useState, useEffect } from 'react';
import { ApplicationWizard } from '@/components/ApplicationWizard';
import { Fin5Logo } from '@/components/Fin5Logo';

interface DealerSession {
  dealerId: string;
  email: string;
  businessName: string;
  loggedIn: boolean;
}

export default function DealerApplicationCreate() {
  const [applicationData, setApplicationData] = useState({
    personalInfo: {},
    employment: {},
    income: {},
    vehicle: {},
    documents: {},
    references: {},
    review: {},
    enhancedData: {},
  });
  const [dealerSession, setDealerSession] = useState<DealerSession | null>(null);

  useEffect(() => {
    // Check dealer session
    const session = localStorage.getItem('dealerSession');
    if (session) {
      const parsedSession = JSON.parse(session);
      if (parsedSession.loggedIn) {
        setDealerSession(parsedSession);
      } else {
        window.location.href = '/dealer/login';
      }
    } else {
      window.location.href = '/dealer/login';
    }
  }, []);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('dealerSession');
      window.location.href = '/dealer/login';
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this application? All entered data will be lost.')) {
      window.location.href = '/dealer/dashboard';
    }
  };

  if (!dealerSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Fin5Logo size="md" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Dealer Application Portal</h1>
                <p className="text-sm text-gray-600">Create comprehensive loan applications for your customers</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Dealer ID: {dealerSession.dealerId}</p>
                <p className="text-xs text-gray-500">Professional Plan</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Cancel Application
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Wizard */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a 
                    href="/dealer/dashboard" 
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    Dashboard
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">New Application</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">New Customer Application</h2>
                  <p className="text-gray-600">
                    Complete the full application process for your customer. This includes all verification steps and eligibility checks.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Welcome, {dealerSession.businessName}</p>
                  <p className="text-xs text-gray-400">Step-by-step application process</p>
                </div>
              </div>
            </div>
            
            <ApplicationWizard 
              applicationData={applicationData}
              setApplicationData={setApplicationData}
              isDealerMode={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 