'use client';

import React, { useState, useEffect } from 'react';
import { Fin5Logo } from '@/components/Fin5Logo';

export default function TrackerPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Application Tracker...</p>
        </div>
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
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  Track Your Applications
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Monitor the status of your loan applications and stay updated on your progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Tracking</h2>
            <p className="text-gray-600 mb-6">
              This feature is coming soon! You'll be able to track all your loan applications here.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-blue-600">0</p>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">0</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">0</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features Coming Soon:</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>✅ Track all your loan applications</li>
                <li>✅ Real-time status updates</li>
                <li>✅ Filter by application status</li>
                <li>✅ View free vs premium applications</li>
                <li>✅ Detailed application information</li>
                <li>✅ Lender assignment tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 