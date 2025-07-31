'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Home, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Fin5Logo } from '@/components/Fin5Logo';

interface Application {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  loanAmount: number;
  vehicleMake: string;
  vehicleModel: string;
  status: 'DRAFT' | 'SUBMITTED' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'PAID' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  paidAt?: string;
  completedAt?: string;
  selectedLenders: string[];
  insurancePolicy?: {
    providerName: string;
    coverageType: string;
    premium: number;
    status: 'ACTIVE' | 'PENDING' | 'EXPIRED';
  };
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  applicationType: 'FREE' | 'PREMIUM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export default function TrackerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/applications/tracker');
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.data.applications || []);
      } else {
        console.error('Failed to load applications:', data.error);
        setApplications([]);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'PROCESSING':
      case 'SUBMITTED':
        return 'text-blue-600 bg-blue-100';
      case 'DRAFT':
        return 'text-gray-600 bg-gray-100';
      case 'REJECTED':
        return 'text-red-600 bg-red-100';
      case 'PAID':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    approved: applications.filter(app => app.status === 'APPROVED').length,
    processing: applications.filter(app => app.status === 'PROCESSING').length,
    pending: applications.filter(app => app.status === 'SUBMITTED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length,
    draft: applications.filter(app => app.status === 'DRAFT').length,
    paid: applications.filter(app => app.status === 'PAID').length,
    completed: applications.filter(app => app.status === 'COMPLETED').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
                <Fin5Logo size="md" showTagline={false} />
              </Link>
              <div className="hidden lg:block">
                <p className="text-sm text-blue-700 font-medium">Streamline your financing process with leading Indian banks and NBFCs</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium flex items-center">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
              <Link href="/prescreening" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Quick Check
              </Link>
              <Link href="/tracker" className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Track Applications
              </Link>
              <Link href="/about" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium">
                About
              </Link>
              <Link href="/contact" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Link href="/login" className="hidden sm:block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium">
                Login
              </Link>
              <Link href="/register" className="hidden sm:block px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium border border-blue-200 hover:border-blue-300">
                Register
              </Link>
              <Link href="/dealer/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                Dealer Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Tracker</h1>
                <p className="text-gray-600">Monitor the status of your loan applications.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/prescreening" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                New Application
              </Link>
              <button
                onClick={loadApplications}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-purple-600">{stats.paid}</p>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-4 border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or application ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="PROCESSING">Processing</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="PAID">Paid</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Applications ({filteredApplications.length})</h2>
          </div>
          
          {filteredApplications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-600">No applications found matching your criteria.</p>
              <p className="text-sm text-gray-500 mt-2">Try creating an application first to see it here.</p>
              <div className="mt-4">
                <Link href="/prescreening" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  <FileText className="w-5 h-5 mr-2" />
                  Start New Application
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredApplications.map((app) => (
                <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{app.customerName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                        {app.applicationType === 'PREMIUM' && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            Premium
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Application ID:</span> {app.id}
                        </div>
                        <div>
                          <span className="font-medium">Vehicle:</span> {app.vehicleMake} {app.vehicleModel}
                        </div>
                        <div>
                          <span className="font-medium">Loan Amount:</span> {formatCurrency(app.loanAmount)}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {app.email}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {app.phone}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {app.insurancePolicy && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="font-medium text-blue-800">Insurance:</span>
                            <span className="text-blue-700">{app.insurancePolicy.providerName} - {app.insurancePolicy.coverageType}</span>
                            <span className="text-blue-600">({formatCurrency(app.insurancePolicy.premium)})</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              app.insurancePolicy.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                              app.insurancePolicy.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {app.insurancePolicy.status}
                            </span>
                          </div>
                        </div>
                      )}

                      {app.selectedLenders.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm font-medium text-gray-700">Selected Lenders:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {app.selectedLenders.map((lender, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {lender}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 