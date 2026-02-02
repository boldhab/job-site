import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Modal from '../../../components/common/Modal';
import Loader from '../../../components/common/Loader';
import { adminService } from '../../../services/admin.service';
import { 
  BuildingOfficeIcon, 
  EnvelopeIcon, 
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ShieldCheckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const EmployerApproval = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // 'approve' | 'reject' | id of row action

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getPendingEmployers();
      // Map backend Employer to UI model
      const mapped = (Array.isArray(data) ? data : []).map((e) => ({
        id: e.id,
        company: e.companyName || e.user?.companyName || '—',
        email: e.companyEmail || e.user?.email || e.user?.username || '—',
        phone: e.phoneNumber || e.user?.phone || '—',
        location: e.location || 'Addis Ababa',
        createdAt: e.createdAt,
        isApproved: !!e.isApproved,
        additionalInfo: e.additionalInfo || 'No additional information provided.',
      }));
      setEmployers(mapped);
    } catch (err) {
      setError(err.message || 'Failed to load pending employers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await adminService.approveEmployer(id);
      setEmployers((prev) => prev.filter((p) => p.id !== id));
      if (selectedEmployer?.id === id) {
        setIsModalOpen(false);
        setSelectedEmployer(null);
      }
      toast.success('Employer approved successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to approve employer');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id, reason = '') => {
    setActionLoading(id);
    try {
      await adminService.rejectEmployer(id, reason);
      setEmployers((prev) => prev.filter((p) => p.id !== id));
      if (selectedEmployer?.id === id) {
        setIsModalOpen(false);
        setSelectedEmployer(null);
      }
      toast.success('Employer rejected successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to reject employer');
    } finally {
      setActionLoading(null);
    }
  };

  const openEmployerDetails = (employer) => {
    setSelectedEmployer(employer);
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent">
                Employer Approvals
              </h1>
              <p className="text-neutral-600 mt-2">
                Review and approve new Ethiopian employer registrations for the Ethio-Career platform.
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-100">
              <ShieldCheckIcon className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">
                {employers.length} Pending Review
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card variant="elevated" padding="large" className="border-amber-100">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader variant="brand" size="large" />
              <p className="mt-4 text-amber-700 font-medium">Loading pending employers...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                <XCircleIcon className="w-6 h-6 text-red-600" />
                <div className="text-left">
                  <p className="font-semibold text-red-800">{error}</p>
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={fetchPending}
                    className="mt-3"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          ) : employers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-3 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-100">
                <CheckCircleIcon className="w-8 h-8 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-emerald-800">All Caught Up!</h3>
                  <p className="text-emerald-700 mt-1">No pending employer approvals at the moment.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border-2 border-amber-100">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-50/80 to-orange-50/50 border-b-2 border-amber-100">
                    <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {employers.map((emp) => (
                    <tr 
                      key={emp.id} 
                      className="hover:bg-amber-50/30 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl border-2 border-amber-200 flex items-center justify-center">
                            <BuildingOfficeIcon className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-900 group-hover:text-amber-800 transition-colors">
                              {emp.company}
                            </p>
                            <p className="text-xs text-amber-600 font-medium">{emp.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <EnvelopeIcon className="w-4 h-4 text-neutral-400" />
                          <span className="text-neutral-700">{emp.email}</span>
                        </div>
                        {emp.phone && emp.phone !== '—' && (
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <span className="text-xs text-neutral-500">Phone:</span>
                            <span className="text-neutral-600">{emp.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="w-4 h-4 text-neutral-400" />
                          <span className="text-neutral-700">{formatDate(emp.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-xs font-bold rounded-xl border border-amber-200">
                          <ShieldCheckIcon className="w-3 h-3" />
                          Pending Review
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => openEmployerDetails(emp)}
                            className="group/item"
                          >
                            <EyeIcon className="w-4 h-4 mr-1 group-hover/item:text-amber-700" />
                            Review
                          </Button>
                          <Button
                            variant="outline"
                            size="small"
                            className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                            onClick={() => {
                              const reason = window.prompt('Reason for rejection (optional):', '');
                              if (reason !== null) handleReject(emp.id, reason);
                            }}
                            loading={actionLoading === emp.id}
                            disabled={!!actionLoading}
                          >
                            <XCircleIcon className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            variant="primary"
                            size="small"
                            className="bg-gradient-to-r from-emerald-600 to-emerald-700 border-0"
                            onClick={() => handleApprove(emp.id)}
                            loading={actionLoading === emp.id}
                            disabled={!!actionLoading}
                          >
                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Employer Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Employer Details"
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-amber-700 font-medium">
                Review carefully before taking action
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                  onClick={() => {
                    const reason = window.prompt('Reason for rejection (optional):', '');
                    if (reason !== null) handleReject(selectedEmployer?.id, reason);
                  }}
                  loading={actionLoading === selectedEmployer?.id}
                  disabled={!!actionLoading}
                >
                  <XCircleIcon className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="primary"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700"
                  onClick={() => selectedEmployer && handleApprove(selectedEmployer.id)}
                  loading={actionLoading === selectedEmployer?.id}
                  disabled={!!actionLoading}
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Approve Employer
                </Button>
              </div>
            </div>
          }
        >
          {selectedEmployer && (
            <div className="space-y-6">
              {/* Company Header */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-100">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center">
                  <BuildingOfficeIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-900">{selectedEmployer.company}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <EnvelopeIcon className="w-4 h-4 text-amber-600" />
                      <span className="text-amber-800">{selectedEmployer.email}</span>
                    </div>
                    {selectedEmployer.phone && selectedEmployer.phone !== '—' && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-amber-800">{selectedEmployer.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl p-4 border-2 border-amber-100">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Registration Date</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-neutral-900">{formatDate(selectedEmployer.createdAt)}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl p-4 border-2 border-amber-100">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Location</p>
                  <span className="font-semibold text-neutral-900">{selectedEmployer.location}</span>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl p-4 border-2 border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <DocumentTextIcon className="w-5 h-5 text-amber-600" />
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Additional Information</p>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {selectedEmployer.additionalInfo}
                </p>
              </div>

              {/* Status Indicator */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                      <ShieldCheckIcon className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-amber-800">Status: Pending Approval</p>
                      <p className="text-sm text-amber-700">This employer is waiting for platform access approval.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Action Required</p>
                    <p className="text-sm text-neutral-700">Review and approve or reject</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default EmployerApproval;