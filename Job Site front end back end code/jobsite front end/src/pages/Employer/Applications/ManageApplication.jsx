import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Loader from '../../../components/common/Loader';
import { applicationService } from '../../../services/application.service';
import { cvService } from '../../../services/cv.service';
import { 
  ArrowLeftIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  StarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const ManageApplication = () => {
  const { id } = useParams();
  const [status, setStatus] = useState('reviewing');
  const [note, setNote] = useState('');
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const data = await applicationService.getById(id);
        setApplication(data);
        setStatus(data?.status?.toLowerCase() || 'reviewing');
        setNote(data?.employerNotes || '');
      } catch (err) {
        setError(err?.message || 'Failed to load application details');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Change application status to "${newStatus.toUpperCase()}"?`)) return;
    
    try {
      setSaving(true);
      await applicationService.updateStatus(id, newStatus.toUpperCase());
      setStatus(newStatus);
      // Show success message
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNote = async () => {
    try {
      setSaving(true);
      await applicationService.saveNote(id, note);
      alert('Note saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      reviewing: { color: 'from-amber-100 to-orange-100', text: 'text-amber-800', label: 'Reviewing' },
      shortlisted: { color: 'from-blue-100 to-cyan-100', text: 'text-blue-800', label: 'Shortlisted' },
      interview: { color: 'from-violet-100 to-purple-100', text: 'text-violet-800', label: 'Interview' },
      hired: { color: 'from-emerald-100 to-green-100', text: 'text-emerald-800', label: 'Hired' },
      rejected: { color: 'from-red-100 to-red-50', text: 'text-red-800', label: 'Rejected' },
    };

    const config = statusConfig[status] || statusConfig.reviewing;
    return (
      <span className={`inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r ${config.color} ${config.text} text-sm font-bold rounded-xl border border-${config.text.split('-')[1]}-200`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-12 flex flex-col items-center justify-center">
          <Loader variant="brand" size="large" />
          <p className="mt-4 text-amber-700 font-medium">Loading application details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="py-12 text-center">
          <div className="inline-flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-2xl mb-4">
            <XCircleIcon className="w-6 h-6 text-red-600" />
            <p className="font-semibold text-red-800">{error}</p>
          </div>
          <Link to="/employer/applications">
            <Button variant="outline">Back to Applications</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Link 
                to="/employer/applications" 
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors group"
              >
                <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Applications
              </Link>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent">
                  Manage Application
                </h1>
                {getStatusBadge(status)}
              </div>
              <p className="text-neutral-600">
                Review candidate details and make decisions for the opportunity: <span className="font-semibold text-amber-800">{application?.job?.title}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                onClick={() => handleStatusChange('rejected')}
                disabled={saving}
                loading={saving && status === 'rejected'}
              >
                <XCircleIcon className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                variant="secondary"
                className="border-violet-300 text-violet-700 hover:bg-violet-50"
                onClick={() => handleStatusChange('interview')}
                disabled={saving}
                loading={saving && status === 'interview'}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
              <Button
                variant="primary"
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 border-0"
                onClick={() => handleStatusChange('hired')}
                disabled={saving}
                loading={saving && status === 'hired'}
              >
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Hire Candidate
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Profile */}
            <Card variant="elevated" padding="large" className="border-amber-100">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {application?.jobSeekerName?.split(' ').map(n => n[0]).join('') || 'C'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">{application?.jobSeekerName || 'Candidate'}</h2>
                    <p className="text-amber-700 font-medium">{application?.jobSeekerHeadline || 'Professional'}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 text-sm text-amber-600">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{application?.jobSeekerLocation || 'Location not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-amber-600">
                        <BriefcaseIcon className="w-4 h-4" />
                        <span>{application?.jobSeekerExperience || '0'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-amber-600">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Applied {formatDate(application?.appliedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                    <DocumentTextIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-800">Cover Letter</h3>
                </div>
                <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl p-6 border-2 border-amber-100">
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                    {application?.coverLetter || 'No cover letter provided.'}
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                    <StarIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-800">Skills & Expertise</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {(application?.jobSeekerSkills ? application.jobSeekerSkills.split(',').map(s => s.trim()) : []).map((skill, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 font-semibold rounded-xl border-2 border-amber-200 hover:border-amber-300 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                  {!application?.jobSeekerSkills && (
                    <p className="text-amber-700">No skills listed by candidate.</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Internal Notes */}
            <Card variant="elevated" padding="large" className="border-amber-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-amber-800">Internal Notes & Comments</h3>
              </div>
              
              <div className="space-y-4">
                <textarea
                  className="w-full px-5 py-4 rounded-2xl border-2 border-amber-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-300 bg-white transition-all duration-300 placeholder:text-amber-400"
                  rows={6}
                  placeholder="Add your notes about this candidate, interview feedback, or reasons for your decision..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-amber-700">
                    Notes are private and only visible to your team members.
                  </p>
                  <Button
                    variant="primary"
                    size="medium"
                    className="bg-gradient-to-r from-amber-600 to-amber-700"
                    onClick={handleSaveNote}
                    loading={saving && status !== 'rejected' && status !== 'interview' && status !== 'hired'}
                    disabled={saving}
                  >
                    Save Notes
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card variant="elevated" padding="large" className="border-amber-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                  <UserCircleIcon className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-amber-800">Contact Information</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl">
                      <EnvelopeIcon className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Email Address</p>
                      <p className="font-semibold text-neutral-900">{application?.jobSeekerEmail || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl">
                      <PhoneIcon className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Phone Number</p>
                      <p className="font-semibold text-neutral-900">{application?.jobSeekerPhone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {(application?.cvId) && (
                  <div className="pt-4 border-t-2 border-amber-100">
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={async () => {
                        try {
                          await cvService.download(application.cvId, `CV_${application.jobSeekerName || 'Applicant'}.pdf`);
                        } catch (err) {
                          alert('Failed to download CV');
                        }
                      }}
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                      Download Resume/CV
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Application Details */}
            <Card variant="elevated" padding="large" className="border-amber-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                  <AcademicCapIcon className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-amber-800">Application Details</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/30 rounded-2xl border-2 border-amber-100">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Opportunity</p>
                  <p className="font-semibold text-neutral-900">{application?.job?.title || 'N/A'}</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/30 rounded-2xl border-2 border-amber-100">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Applied Date</p>
                  <p className="font-semibold text-neutral-900">{formatDate(application?.appliedAt)}</p>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/30 rounded-2xl border-2 border-amber-100">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Last Updated</p>
                  <p className="font-semibold text-neutral-900">{formatDate(application?.updatedAt)}</p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card variant="elevated" padding="large" className="border-amber-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                  <ClockIcon className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-amber-800">Quick Actions</h3>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  className="justify-start border-amber-200 text-amber-800 hover:border-amber-300"
                  onClick={() => handleStatusChange('shortlisted')}
                >
                  <StarIcon className="w-4 h-4 mr-3" />
                  Shortlist Candidate
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  className="justify-start border-violet-200 text-violet-800 hover:border-violet-300"
                  onClick={() => window.open(`mailto:${application?.jobSeekerEmail}`, '_blank')}
                >
                  <EnvelopeIcon className="w-4 h-4 mr-3" />
                  Send Email
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  className="justify-start border-blue-200 text-blue-800 hover:border-blue-300"
                  onClick={() => navigator.clipboard.writeText(application?.jobSeekerPhone || '')}
                >
                  <PhoneIcon className="w-4 h-4 mr-3" />
                  Copy Phone Number
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageApplication;