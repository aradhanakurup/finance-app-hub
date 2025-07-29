'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { Fin5Logo } from '../../../components/Fin5Logo';
import { QuickEligibilityChecker } from '../../../components/dealer/QuickEligibilityChecker';

interface DealerSession {
  dealerId: string;
  email: string;
  businessName: string;
  loggedIn: boolean;
}

interface Application {
  id: string;
  customerName: string;
  customerPhone: string;
  vehicleModel: string;
  loanAmount: number;
  status: string;
  submittedAt: string;
  lenderName?: string;
  approvedAmount?: number;
  interestRate?: number;
  dealerId: string; // Add dealer tracking
  quickReference?: string; // Add quick reference for dealers
}

export default function DealerDashboardPage() {
  const [dealerSession, setDealerSession] = useState<DealerSession | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'performance' | 'create' | 'eligibility'>('overview');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    // Check if dealer is logged in
    const session = localStorage.getItem('dealerSession');
    if (session) {
      const parsedSession = JSON.parse(session);
      if (parsedSession.loggedIn) {
        setDealerSession(parsedSession);
        fetchApplications();
      } else {
        window.location.href = '/dealer/login';
      }
    } else {
      window.location.href = '/dealer/login';
    }
  }, []);

  const fetchApplications = async () => {
    // Mock data - in production, this would fetch from your API
    const mockApplications: Application[] = [
      {
        id: 'APP-001',
        customerName: 'Rahul Sharma',
        customerPhone: '+91 98765 43210',
        vehicleModel: 'Honda City',
        loanAmount: 850000,
        status: 'APPROVED',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        lenderName: 'HDFC Bank',
        approvedAmount: 850000,
        interestRate: 12.5,
        dealerId: 'DEALER-001',
        quickReference: 'RS-HC-001',
      },
      {
        id: 'APP-002',
        customerName: 'Priya Patel',
        customerPhone: '+91 98765 43211',
        vehicleModel: 'Maruti Swift',
        loanAmount: 650000,
        status: 'PENDING',
        submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        dealerId: 'DEALER-001',
        quickReference: 'PP-MS-002',
      },
      {
        id: 'APP-003',
        customerName: 'Amit Kumar',
        customerPhone: '+91 98765 43212',
        vehicleModel: 'Hyundai i20',
        loanAmount: 750000,
        status: 'UNDER_REVIEW',
        submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        dealerId: 'DEALER-001',
        quickReference: 'AK-HI-003',
      },
      {
        id: 'APP-004',
        customerName: 'Sneha Reddy',
        customerPhone: '+91 98765 43213',
        vehicleModel: 'Toyota Innova',
        loanAmount: 1200000,
        status: 'APPROVED',
        submittedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        lenderName: 'ICICI Bank',
        approvedAmount: 1200000,
        interestRate: 13.2,
        dealerId: 'DEALER-001',
        quickReference: 'SR-TI-004',
      },
    ];

    setApplications(mockApplications);
    setLoading(false);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('dealerSession');
      window.location.href = '/dealer/login';
    }
  };

  const handleCreateApplication = () => {
    window.location.href = '/dealer/application/create';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      APPROVED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      UNDER_REVIEW: 'bg-blue-100 text-blue-800',
      REJECTED: 'bg-red-100 text-red-800',
      DISBURSED: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      APPROVED: '✅',
      PENDING: '⏳',
      UNDER_REVIEW: '🔍',
      REJECTED: '❌',
      DISBURSED: '💰',
    };
    return icons[status] || '📝';
  };

  if (loading) {
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
                <h1 className="text-xl font-semibold text-gray-900">Dealer Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {dealerSession?.businessName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Dealer ID: {dealerSession?.dealerId}</span>
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'applications', label: 'Applications', icon: '📝' },
                { id: 'eligibility', label: 'Quick Check', icon: '⚡' },
                { id: 'performance', label: 'Performance', icon: '📈' },
                { id: 'create', label: 'Create App', icon: '➕' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Applications</p>
                        <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Approved</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {applications.filter(app => app.status === 'APPROVED').length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {applications.filter(app => app.status === 'PENDING').length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Value</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(applications.reduce((sum, app) => sum + app.loanAmount, 0))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{application.customerName}</p>
                          <p className="text-sm text-gray-600">{application.vehicleModel}</p>
                          <p className="text-xs text-gray-500">Ref: {application.quickReference}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(application.loanAmount)}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)} {application.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">All Applications</h3>
                  <button
                    onClick={handleCreateApplication}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Create New Application
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quick Ref
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vehicle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lender
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications.map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            {application.quickReference}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium text-gray-900">{application.customerName}</div>
                              <div className="text-sm text-gray-500">{application.customerPhone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {application.vehicleModel}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(application.loanAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                              {getStatusIcon(application.status)} {application.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {application.lenderName || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(application.submittedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quick Eligibility Checker Tab */}
            {activeTab === 'eligibility' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Eligibility Checker</h3>
                  <p className="text-gray-600">Instantly check customer eligibility for auto loans</p>
                </div>
                <QuickEligibilityChecker />
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Approval Rate</h4>
                    <div className="text-3xl font-bold text-green-600">
                      {applications.length > 0 
                        ? Math.round((applications.filter(app => app.status === 'APPROVED').length / applications.length) * 100)
                        : 0}%
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Applications approved</p>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Average Loan Amount</h4>
                    <div className="text-3xl font-bold text-blue-600">
                      {applications.length > 0 
                        ? formatCurrency(Math.round(applications.reduce((sum, app) => sum + app.loanAmount, 0) / applications.length))
                        : formatCurrency(0)}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Per application</p>
                  </div>
                </div>
              </div>
            )}

            {/* Create Application Tab */}
            {activeTab === 'create' && (
              <div className="text-center py-12">
                <div className="mb-6">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Application</h3>
                  <p className="text-gray-600 mb-6">Start a comprehensive loan application for your customer</p>
                </div>
                <button
                  onClick={handleCreateApplication}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg font-medium"
                >
                  Start Application
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 