import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { applicationService } from '../../../services/application.service';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import Button from '../../../components/common/Button';

const ApplicationStatus = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await applicationService.getById(id);
        setApplication(data);
      } catch (err) {
        setError(err?.message || 'Failed to load application');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  const getTimeline = (status) => {
    const steps = [
      { 
        status: 'Application Submitted', 
        icon: DocumentTextIcon,
        date: application?.createdAt ? new Date(application.createdAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }) : 'Pending', 
        completed: true,
        description: 'Your application has been successfully submitted'
      },
      { 
        status: 'Under Review', 
        icon: ClockIcon,
        date: 'In Progress', 
        description: 'Employer is reviewing your profile and qualifications',
        current: status?.toLowerCase().includes('review') || status?.toLowerCase().includes('submit')
      },
      { 
        status: 'Interview', 
        icon: UserIcon,
        date: 'Upcoming', 
        description: 'Schedule and prepare for the interview process',
        current: status?.toLowerCase().includes('interview') || status?.toLowerCase().includes('shortlist')
      },
      { 
        status: 'Final Decision', 
        icon: CheckCircleIcon,
        date: 'TBD', 
        description: 'Final evaluation and hiring decision',
        current: status?.toLowerCase().includes('reject') || status?.toLowerCase().includes('offer') || status?.toLowerCase().includes('hire')
      }
    ];

    // Mark as completed based on current status
    const statusMap = {
      'submitted': 0,
      'review': 1,
      'interview': 2,
      'shortlisted': 2,
      'offered': 3,
      'rejected': 3,
      'hired': 3
    };

    let currentIndex = -1;
    const lowerStatus = status?.toLowerCase() || '';
    Object.keys(statusMap).forEach(key => {
      if (lowerStatus.includes(key)) currentIndex = statusMap[key];
    });

    return steps.map((step, index) => ({
      ...step,
      completed: index < currentIndex || (index === 0),
      current: index === currentIndex
    }));
  };

  // Text gradient class
  const titleGradient = "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent";
  const statusColors = {
    'Submitted': 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200/50',
    'Under Review': 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200/50',
    'Interview': 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border border-purple-200/50',
    'Shortlisted': 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200/50',
    'Hired': 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200/50',
    'Rejected': 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200/50',
    'Offered': 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200/50'
  };

  const getStatusColor = (status) => {
    return statusColors[status] || 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200/50';
  };

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="mb-8 md:mb-12">
        <Link 
          to="/job-seeker/applications" 
          className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium mb-6 group"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to My Applications
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center">
            <ClockIcon className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className={`text-2xl lg:text-3xl font-bold ${titleGradient}`}>Application Status</h1>
            <p className="text-amber-800/70 mt-2">
              Track your application progress with{' '}
              <span className="font-semibold text-amber-900">
                {application?.job?.companyName || application?.job?.employer?.name || 'the company'}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 border-2 border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-0 overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-amber-700 font-medium">Loading application details...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <div className="bg-gradient-to-br from-amber-50/80 to-amber-100/50 rounded-2xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-4">Unable to Load Application</h3>
                <p className="text-amber-700/80 mb-8">{error}</p>
                <Link to="/job-seeker/applications">
                  <Button 
                    variant="outline"
                    className="rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg px-6 py-3 transition-all"
                  >
                    View All Applications
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Job Header */}
              <div className="border-b border-amber-200/50 px-6 md:px-8 py-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center">
                        <BuildingOfficeIcon className="w-7 h-7 text-amber-600" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-amber-900">{application?.job?.title}</h2>
                        <p className="text-amber-700/80 flex items-center mt-2">
                          <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                          {application?.job?.companyName || application?.job?.employer?.name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-amber-700/80 mt-6">
                      <span className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        {application?.job?.location || 'Remote'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <BriefcaseIcon className="w-4 h-4 mr-2" />
                        {application?.job?.type || 'Full-time'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Applied on {application?.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center lg:text-right">
                    <span className="block text-sm text-amber-700/80 mb-3">Current Status</span>
                    <span className={`inline-flex items-center px-6 py-3 rounded-2xl text-lg font-bold ${getStatusColor(application?.status)}`}>
                      <ClockIcon className="w-5 h-5 mr-2" />
                      {application?.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="px-6 md:px-8 py-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-4">
                    <ClockIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className={`text-xl font-bold ${titleGradient}`}>Application Timeline</h3>
                </div>

                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-amber-400/20 via-amber-500/30 to-amber-600/20"></div>

                  <div className="space-y-8 md:space-y-10">
                    {getTimeline(application?.status).map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <div key={index} className="relative flex items-start ml-12">
                          {/* Circle Indicator */}
                          <div className={`absolute -left-12 flex items-center justify-center h-10 w-10 rounded-full border-2 z-10 transition-all duration-300 ${
                            step.completed 
                              ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-400 shadow-lg shadow-emerald-200/50' 
                              : step.current 
                              ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-400 shadow-lg shadow-amber-200/50 animate-pulse'
                              : 'bg-white border-amber-200/50'
                          }`}>
                            {step.completed ? (
                              <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Icon className={`w-5 h-5 ${step.current ? 'text-amber-500' : 'text-amber-400'}`} />
                            )}
                          </div>

                          <div className={`flex-1 p-4 md:p-6 rounded-2xl border transition-all duration-300 ${
                            step.completed 
                              ? 'bg-gradient-to-br from-emerald-50/30 to-emerald-100/10 border-emerald-200/50 shadow-sm' 
                              : step.current 
                              ? 'bg-gradient-to-br from-amber-50/30 to-amber-100/10 border-amber-200/50 shadow-sm'
                              : 'bg-white/50 border-amber-200/30'
                          }`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                              <h3 className={`text-lg font-bold ${
                                step.completed || step.current ? 'text-amber-900' : 'text-amber-700/60'
                              }`}>
                                {step.status}
                              </h3>
                              <span className={`px-4 py-2 rounded-2xl text-sm font-medium ${
                                step.completed 
                                  ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200/50'
                                  : step.current 
                                  ? 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200/50'
                                  : 'bg-amber-50/50 text-amber-600/70 border border-amber-200/30'
                              }`}>
                                {step.date}
                              </span>
                            </div>
                            <p className="text-amber-700/70">{step.description}</p>
                            
                            {step.current && step.status === 'Under Review' && (
                              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-blue-100/30 border border-blue-200/50">
                                <div className="flex items-start">
                                  <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center mr-3 mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                  </div>
                                  <p className="text-sm text-blue-800/80">
                                    The employer is currently reviewing your profile and qualifications. 
                                    This process typically takes 3-7 business days. We'll notify you as soon as there are updates.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="border-t border-amber-200/50 px-6 md:px-8 py-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-4">
                    <DocumentTextIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className={`text-xl font-bold ${titleGradient}`}>Application Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white to-amber-50/50 p-6 rounded-2xl border border-amber-200/50">
                    <h4 className="font-bold text-amber-900 mb-4 flex items-center">
                      <DocumentTextIcon className="w-5 h-5 mr-2 text-amber-600" />
                      Documents Submitted
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/30 border border-amber-200/30">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-3">
                            <DocumentTextIcon className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium text-amber-900">{application?.cv?.fileName || 'Resume.pdf'}</p>
                            <p className="text-xs text-amber-600/70">Updated recently</p>
                          </div>
                        </div>
                        <button className="text-amber-700 hover:text-amber-800 hover:underline text-sm font-medium">
                          View
                        </button>
                      </div>
                    </div>
                  </div>

                  {application?.coverLetter && (
                    <div className="bg-gradient-to-br from-white to-amber-50/50 p-6 rounded-2xl border border-amber-200/50">
                      <h4 className="font-bold text-amber-900 mb-4 flex items-center">
                        <EnvelopeIcon className="w-5 h-5 mr-2 text-amber-600" />
                        Cover Letter
                      </h4>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/30 to-amber-100/10 border border-amber-200/30">
                        <p className="text-amber-800/80 italic leading-relaxed text-sm">
                          "{application.coverLetter}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Section */}
              <div className="bg-gradient-to-r from-amber-500/5 via-amber-400/10 to-amber-500/5 border-t border-amber-200/50 px-6 md:px-8 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-amber-900 mb-2">Need to update your application?</h4>
                    <p className="text-amber-700/80 text-sm">Contact the employer or update your resume</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-3 rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg transition-all">
                      Contact Employer
                    </button>
                    <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 transition-all">
                      Update Resume
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};



export default ApplicationStatus;
