'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface Dealer {
  id: string;
  businessName: string;
  gstNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType: string;
  dealershipType: string[];
  brands: string[];
  status: string;
  createdAt: string;
  documents: DealerDocument[];
}

interface DealerDocument {
  id: string;
  type: string;
  fileName: string;
  fileUrl: string;
  verified: boolean;
}

export default function DealerApprovalDashboard() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [approvalReason, setApprovalReason] = useState('');

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      const response = await fetch('/api/admin/dealers');
      if (response.ok) {
        const data = await response.json();
        setDealers(data.dealers);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch dealers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (dealerId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/admin/dealers/${dealerId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          reason: approvalReason,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Dealer ${status.toLowerCase()} successfully`,
        });
        fetchDealers();
        setSelectedDealer(null);
        setApprovalReason('');
      } else {
        throw new Error('Approval failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update dealer status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
      APPROVED: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      REJECTED: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      SUSPENDED: { color: 'bg-gray-100 text-gray-800', label: 'Suspended' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dealers...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dealer Approval Dashboard
        </h1>
        <p className="text-gray-600">
          Review and approve dealer registrations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dealer List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Pending Approvals</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {dealers
                .filter(dealer => dealer.status === 'PENDING')
                .map(dealer => (
                  <div
                    key={dealer.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedDealer(dealer)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {dealer.businessName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          GST: {dealer.gstNumber} | Contact: {dealer.contactPerson}
                        </p>
                        <p className="text-sm text-gray-600">
                          {dealer.dealershipType.join(', ')} | {dealer.brands.slice(0, 3).join(', ')}
                          {dealer.brands.length > 3 && '...'}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(dealer.status)}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(dealer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              {dealers.filter(dealer => dealer.status === 'PENDING').length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No pending dealer approvals
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dealer Details */}
        <div className="lg:col-span-1">
          {selectedDealer ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Dealer Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <p className="text-sm text-gray-900">{selectedDealer.businessName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">GST Number</label>
                  <p className="text-sm text-gray-900">{selectedDealer.gstNumber}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                  <p className="text-sm text-gray-900">{selectedDealer.contactPerson}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedDealer.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{selectedDealer.phone}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Type</label>
                  <p className="text-sm text-gray-900">{selectedDealer.businessType}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Dealership Types</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedDealer.dealershipType.map(type => (
                      <span
                        key={type}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Supported Brands</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedDealer.brands.map(brand => (
                      <span
                        key={brand}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedDealer.documents && selectedDealer.documents.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Documents</label>
                    <div className="space-y-2 mt-1">
                      {selectedDealer.documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{doc.type}</span>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Approval Reason (Optional)
                  </label>
                  <textarea
                    value={approvalReason}
                    onChange={(e) => setApprovalReason(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Reason for approval or rejection..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={() => handleApproval(selectedDealer.id, 'APPROVED')}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleApproval(selectedDealer.id, 'REJECTED')}
                    className="bg-red-600 hover:bg-red-700 flex-1"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500 text-center">
                Select a dealer to view details and approve/reject
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 