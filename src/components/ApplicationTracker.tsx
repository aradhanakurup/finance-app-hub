'use client';

import React, { useState, useEffect } from 'react';
import { Fin5Logo } from './Fin5Logo';

interface Application {
  id: string;
  customerName: string;
  customerPhone: string;
  vehicleModel: string;
  loanAmount: number;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
  submittedAt: string;
  lenderName?: string;
  approvedAmount?: number;
  interestRate?: number;
  dealerId?: string;
  quickReference?: string;
  isPaidApplication?: boolean;
  subscriptionTier?: 'free' | 'premium';
}

interface UserSession {
  userId: string;
  email: string;
  name: string;
  subscriptionTier: 'free' | 'premium';
  loggedIn: boolean;
}

export function ApplicationTracker() {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = () => {
    // Check if user is logged in
    const session = localStorage.getItem('userSession');
    if (session) {
      const parsedSession = JSON.parse(session);
      if (parsedSession.loggedIn) {
        setUserSession(parsedSession);
        fetchApplications(parsedSession.userId);
      } else {
        setShowLoginModal(true);
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const fetchApplications = async (userId: string) => {
    // Mock data - in production, this would fetch from your API
    const mockApplications: Application[] = [
      {
        id: 'APP-001',
        customerName: 'Rahul Sharma',
        customerPhone: '+91 98765 43210',
        vehicleModel: 'Honda City',
        loanAmount: 850000,
        status: 'APPROVED',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        lenderName: 'HDFC Bank',
        approvedAmount: 850000,
        interestRate: 12.5,
        isPaidApplication: true,
        subscriptionTier: 'premium',
      },
      {
        id: 'APP-002',
        customerName: 'Priya Patel',
        customerPhone: '+91 98765 43211',
        vehicleModel: 'Maruti Swift',
        loanAmount: 650000,
        status: 'PENDING',
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        isPaidApplication: false,
        subscriptionTier: 'free',
      },
      {
        id: 'APP-003',
        customerName: 'Amit Kumar',
        customerPhone: '+91 98765 43212',
        vehicleModel: 'Hyundai i20',
        loanAmount: 750000,
        status: 'UNDER_REVIEW',
        submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        isPaidApplication: true,
        subscriptionTier: 'premium',
      },
      {
        id: 'APP-004',
        customerName: 'Sneha Reddy',
        customerPhone: '+91 98765 43213',
        vehicleModel: 'Toyota Innova',
        loanAmount: 1200000,
        status: 'REJECTED',
        submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        isPaidApplication: false,
        subscriptionTier: 'free',
      },
    ];

    setApplications(mockApplications);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    setUserSession(null);
    setShowLoginModal(true);
  };

  const handleLogin = (email: string, password: string) => {
    // Mock login - in production, this would validate with your API
    const mockUserSession: UserSession = {
      userId: 'USER-001',
      email: email,
      name: 'John Doe',
      subscriptionTier: 'premium',
      loggedIn: true,
    };

    localStorage.setItem('userSession', JSON.stringify(mockUserSession));
    setUserSession(mockUserSession);
    setShowLoginModal(false);
    fetchApplications(mockUserSession.userId);
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
      PENDING: 'bg-yellow-100 text-yellow-800',
      UNDER_REVIEW: 'bg-blue-100 text-blue-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      DISBURSED: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      PENDING: '⏳',
      UNDER_REVIEW: '🔍',
      APPROVED: '✅',
      REJECTED: '❌',
      DISBURSED: '💰',
    };
    return icons[status] || '📝';
  };

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab.toUpperCase();
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'PENDING').length,
    approved: applications.filter(app => app.status === 'APPROVED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length,
    free: applications.filter(app => app.subscriptionTier === 'free').length,
    premium: applications.filter(app => app.subscriptionTier === 'premium').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showLoginModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Fin5Logo size="lg" />
            <h2 className="text-2xl font-bold text-gray-900 mt-4">Track Your Applications</h2>
            <p className="text-gray-600">Login to view your loan application status</p>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleLogin(formData.get('email') as string, formData.get('password') as string);
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button className="text-blue-600 hover:text-blue-700">
                Create one
              </button>
            </p>
          </div>
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
                <h1 className="text-xl font-semibold text-gray-900">Application Tracker</h1>
                <p className="text-sm text-gray-600">Track your loan applications</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {userSession?.name} ({userSession?.subscriptionTier})
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Free</p>
              <p className="text-2xl font-bold text-blue-600">{stats.free}</p>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Premium</p>
              <p className="text-2xl font-bold text-purple-600">{stats.premium}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'all', label: 'All Applications', icon: '📋' },
                { id: 'pending', label: 'Pending', icon: '⏳' },
                { id: 'approved', label: 'Approved', icon: '✅' },
                { id: 'rejected', label: 'Rejected', icon: '❌' },
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
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-600">No applications found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Application ID
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
                        Type
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
                    {filteredApplications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {application.id}
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            application.subscriptionTier === 'premium' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {application.subscriptionTier === 'premium' ? '💎 Premium' : '🆓 Free'}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 