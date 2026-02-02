import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/common/Card';
import Loader from '../../../components/common/Loader';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Pagination from '../../../components/common/Pagination';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ShieldCheckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../../../services/admin.service';

const JobModeration = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await adminService.getJobsByStatus(statusFilter, {
        page: currentPage - 1, // backend is 0-indexed
        size: itemsPerPage
      });
      
      setJobs(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to load opportunities for moderation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, currentPage]);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this opportunity for publication?')) return;
    try {
      setProcessing(id);
      await adminService.approveJob(id);
      await fetchJobs();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to approve opportunity');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejection (optional):', '');
    if (reason === null) return; // cancelled
    try {
      setProcessing(id);
      await adminService.rejectJob(id, reason || 'No reason provided');
      await fetchJobs();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to reject opportunity');
    } finally {
      setProcessing(null);
    }
  };

  const openJobDetails = (job) => {
    setSelectedJob(job);
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

  const getJobTypeBadge = (type) => {
    const types = {
      FULL_TIME: 'Full Time',
      PART_TIME: 'Part Time',
      CONTRACT: 'Contract',
      INTERNSHIP: 'Internship',
      REMOTE: 'Remote',
    };
    return types[type] || type;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent">
                Opportunity Moderation
              </h1>
              <p className="text-neutral-600 mt-2">
                Review and approve Ethiopian job opportunities before they go live on the platform.
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-100">
              <ShieldCheckIcon className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">
                {jobs.length} Opportunities Pending
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/50 rounded-2xl p-1 border-2 border-amber-100">
              {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setStatusFilter(filter);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    statusFilter === filter
                      ? 'bg-white text-amber-800 shadow-sm'
                      : 'text-amber-700 hover:text-amber-800 hover:bg-amber-50/50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card variant="elevated" padding="large" className="border-amber-100">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader variant="brand" size="large" />
              <p className="mt-4 text-amber-700 font-medium">Loading opportunities for moderation...</p>
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
                    onClick={fetchJobs}
                    className="mt-3"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-3 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-100">
                <CheckCircleIcon className="w-8 h-8 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-emerald-800">All Caught Up!</h3>
                  <p className="text-emerald-700 mt-1">
                    No {statusFilter.toLowerCase()} opportunities at the moment.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card 
                  key={job.id} 
                  hover
                  className="border-amber-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      {/* Job Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl border-2 border-amber-200 flex items-center justify-center">
                              <BriefcaseIcon className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-neutral-900 group-hover:text-amber-800 transition-colors">
                                {job.title}
                              </h2>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-2">
                                  <BuildingOfficeIcon className="w-4 h-4 text-neutral-400" />
                                  <span className="text-sm text-neutral-700">{job.employer?.name || job.companyName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPinIcon className="w-4 h-4 text-neutral-400" />
                                  <span className="text-sm text-neutral-700">{job.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Status Badge */}
                          <div className="flex flex-col items-end gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border ${
                              job.status === 'PENDING'
                                ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200'
                                : job.status === 'APPROVED'
                                ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200'
                                : 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border-red-200'
                            }`}>
                              {job.status === 'PENDING' && <ShieldCheckIcon className="w-3 h-3" />}
                              {job.status === 'APPROVED' && <CheckCircleIcon className="w-3 h-3" />}
                              {job.status === 'REJECTED' && <XCircleIcon className="w-3 h-3" />}
                              {job.status}
                            </span>
                            {job.rejectionReason && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                                <ExclamationTriangleIcon className="w-3 h-3" />
                                {job.rejectionReason}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Job Details */}
                        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-amber-100">
                          <div className="flex items-center gap-2">
                            <CurrencyDollarIcon className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-neutral-700">
                              {job.salaryRange || 'Salary not disclosed'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-neutral-700">
                              {getJobTypeBadge(job.jobType)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-neutral-700">
                              Posted: {formatDate(job.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-3 lg:w-48">
                        <Button
                          variant="outline"
                          fullWidth
                          onClick={() => openJobDetails(job)}
                          className="group/item"
                        >
                          <DocumentTextIcon className="w-4 h-4 mr-2 group-hover/item:text-amber-700" />
                          View Details
                        </Button>
                        
                        {job.status === 'PENDING' && (
                          <>
                            <Button
                              variant="outline"
                              fullWidth
                              className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                              onClick={() => {
                                const reason = window.prompt('Reason for rejection (optional):', '');
                                if (reason !== null) handleReject(job.id, reason);
                              }}
                              disabled={processing === job.id}
                            >
                              <XCircleIcon className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                            <Button
                              variant="primary"
                              fullWidth
                              className="bg-gradient-to-r from-emerald-600 to-emerald-700 border-0"
                              onClick={() => handleApprove(job.id)}
                              disabled={processing === job.id}
                              loading={processing === job.id}
                            >
                              <CheckCircleIcon className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-6 border-t border-amber-100">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Job Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Opportunity Details"
          size="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-amber-700 font-medium">
                Review all details before taking action
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={processing === selectedJob?.id}
                >
                  Close
                </Button>
                {selectedJob?.status === 'PENDING' && (
                  <>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                      onClick={() => {
                        const reason = window.prompt('Reason for rejection (optional):', '');
                        if (reason !== null) handleReject(selectedJob.id, reason);
                      }}
                      disabled={processing === selectedJob.id}
                    >
                      <XCircleIcon className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      variant="primary"
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700"
                      onClick={() => handleApprove(selectedJob.id)}
                      loading={processing === selectedJob.id}
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Approve Opportunity
                    </Button>
                  </>
                )}
              </div>
            </div>
          }
        >
          {selectedJob && (
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center">
                    <BriefcaseIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-amber-900">{selectedJob.title}</h2>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <BuildingOfficeIcon className="w-5 h-5 text-amber-600" />
                        <span className="font-semibold text-amber-800">
                          {selectedJob.employer?.name || selectedJob.companyName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-amber-600" />
                        <span className="font-semibold text-amber-800">{selectedJob.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl p-4 border-2 border-amber-100">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Type</p>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-neutral-900">{getJobTypeBadge(selectedJob.jobType)}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl p-4 border-2 border-amber-100">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Salary Range</p>
                  <div className="flex items-center gap-2">
                    <CurrencyDollarIcon className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-neutral-900">{selectedJob.salaryRange || 'Not disclosed'}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl p-4 border-2 border-amber-100">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Posted Date</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-neutral-900">{formatDate(selectedJob.createdAt)}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl p-4 border-2 border-amber-100">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Status</p>
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-neutral-900">{selectedJob.status}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-bold text-amber-800">Opportunity Description</h3>
                </div>
                <div className="bg-gradient-to-br from-amber-50/30 to-orange-50/20 rounded-2xl p-6 border-2 border-amber-100">
                  <div className="prose prose-amber max-w-none">
                    {selectedJob.description?.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-neutral-700 mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Requirements (if available) */}
              {selectedJob.requirements && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-amber-800">Requirements</h3>
                  <div className="bg-gradient-to-br from-amber-50/30 to-orange-50/20 rounded-2xl p-6 border-2 border-amber-100">
                    <ul className="space-y-2">
                      {selectedJob.requirements.split('\n').map((req, index) => (
                        req.trim() && (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 mt-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex-shrink-0"></div>
                            <span className="text-neutral-700">{req}</span>
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default JobModeration;