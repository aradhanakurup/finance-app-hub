'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/config/commission';

interface CommissionData {
  id: string;
  applicationId: string;
  customerName: string;
  loanAmount: number;
  lenderName: string;
  commissionAmount: number;
  bonusAmount: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'paid';
  date: string;
  vehicleDetails: {
    make: string;
    model: string;
    variant: string;
  };
}

interface CommissionStats {
  totalEarnings: number;
  pendingAmount: number;
  paidAmount: number;
  thisMonth: number;
  lastMonth: number;
  totalApplications: number;
  approvalRate: number;
  averageCommission: number;
}

export function CommissionDashboard() {
  const [commissionData, setCommissionData] = useState<CommissionData[]>([]);
  const [stats, setStats] = useState<CommissionStats>({
    totalEarnings: 0,
    pendingAmount: 0,
    paidAmount: 0,
    thisMonth: 0,
    lastMonth: 0,
    totalApplications: 0,
    approvalRate: 0,
    averageCommission: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'analytics'>('overview');

  useEffect(() => {
    fetchCommissionData();
  }, []);

  const fetchCommissionData = async () => {
    // Mock data - in production, this would fetch from your API
    const mockCommissionData: CommissionData[] = [
      {
        id: 'COM-001',
        applicationId: 'APP-001',
        customerName: 'Rahul Sharma',
        loanAmount: 850000,
        lenderName: 'HDFC Bank',
        commissionAmount: 3825, // 1.5% of 850000 * 30%
        bonusAmount: 191, // 5% bonus
        totalAmount: 4016,
        status: 'paid',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        vehicleDetails: {
          make: 'Honda',
          model: 'City',
          variant: 'ZX',
        },
      },
      {
        id: 'COM-002',
        applicationId: 'APP-002',
        customerName: 'Priya Patel',
        loanAmount: 650000,
        lenderName: 'ICICI Bank',
        commissionAmount: 2730, // 1.4% of 650000 * 30%
        bonusAmount: 136, // 5% bonus
        totalAmount: 2866,
        status: 'approved',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        vehicleDetails: {
          make: 'Maruti',
          model: 'Swift',
          variant: 'VXI',
        },
      },
      {
        id: 'COM-003',
        applicationId: 'APP-003',
        customerName: 'Amit Kumar',
        loanAmount: 750000,
        lenderName: 'SBI',
        commissionAmount: 2700, // 1.2% of 750000 * 30%
        bonusAmount: 135, // 5% bonus
        totalAmount: 2835,
        status: 'pending',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        vehicleDetails: {
          make: 'Hyundai',
          model: 'i20',
          variant: 'Sportz',
        },
      },
      {
        id: 'COM-004',
        applicationId: 'APP-004',
        customerName: 'Sneha Reddy',
        loanAmount: 1200000,
        lenderName: 'Axis Bank',
        commissionAmount: 5760, // 1.6% of 1200000 * 30%
        bonusAmount: 288, // 5% bonus
        totalAmount: 6048,
        status: 'paid',
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        vehicleDetails: {
          make: 'Toyota',
          model: 'Innova',
          variant: 'GX',
        },
      },
    ];

    setCommissionData(mockCommissionData);

    // Calculate stats
    const totalEarnings = mockCommissionData.reduce((sum, item) => sum + item.totalAmount, 0);
    const pendingAmount = mockCommissionData
      .filter(item => item.status === 'pending')
      .reduce((sum, item) => sum + item.totalAmount, 0);
    const paidAmount = mockCommissionData
      .filter(item => item.status === 'paid')
      .reduce((sum, item) => sum + item.totalAmount, 0);

    setStats({
      totalEarnings,
      pendingAmount,
      paidAmount,
      thisMonth: totalEarnings * 0.4, // Mock calculation
      lastMonth: totalEarnings * 0.6, // Mock calculation
      totalApplications: mockCommissionData.length,
      approvalRate: 0.85, // Mock data
      averageCommission: totalEarnings / mockCommissionData.length,
    });

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: '⏳',
      approved: '✅',
      paid: '💰',
    };
    return icons[status] || '📝';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Commission Dashboard</h2>
          <p className="text-gray-600">Track your earnings and performance</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Next Payout</p>
          <p className="text-lg font-semibold text-blue-600">₹{formatCurrency(stats.pendingAmount)}</p>
          <p className="text-xs text-gray-500">Expected: 15th Dec 2024</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.pendingAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.thisMonth)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approval Rate</p>
              <p className="text-2xl font-bold text-gray-900">{(stats.approvalRate * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'transactions', label: 'Transactions', icon: '💰' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Commissions</h4>
                  <div className="space-y-3">
                    {commissionData.slice(0, 5).map((commission) => (
                      <div key={commission.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{commission.customerName}</p>
                          <p className="text-sm text-gray-600">{commission.lenderName}</p>
                          <p className="text-xs text-gray-500">{commission.vehicleDetails.make} {commission.vehicleDetails.model}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{formatCurrency(commission.totalAmount)}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(commission.status)}`}>
                            {getStatusIcon(commission.status)} {commission.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Applications</span>
                      <span className="font-semibold">{stats.totalApplications}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Commission</span>
                      <span className="font-semibold">{formatCurrency(stats.averageCommission)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Paid Amount</span>
                      <span className="font-semibold text-green-600">{formatCurrency(stats.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pending Amount</span>
                      <span className="font-semibold text-yellow-600">{formatCurrency(stats.pendingAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">All Commission Transactions</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Application
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loan Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bonus
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {commissionData.map((commission) => (
                      <tr key={commission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {commission.applicationId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">{commission.customerName}</div>
                            <div className="text-sm text-gray-500">{commission.vehicleDetails.make} {commission.vehicleDetails.model}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {commission.lenderName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(commission.loanAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(commission.commissionAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          +{formatCurrency(commission.bonusAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(commission.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(commission.status)}`}>
                            {getStatusIcon(commission.status)} {commission.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(commission.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">This Month</span>
                      <span className="font-semibold text-green-600">{formatCurrency(stats.thisMonth)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Month</span>
                      <span className="font-semibold">{formatCurrency(stats.lastMonth)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Growth</span>
                      <span className="font-semibold text-green-600">+15.2%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Lenders</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="font-medium">HDFC Bank</span>
                      <span className="text-green-600">{formatCurrency(4016)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="font-medium">Axis Bank</span>
                      <span className="text-green-600">{formatCurrency(6048)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="font-medium">ICICI Bank</span>
                      <span className="text-green-600">{formatCurrency(2866)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 