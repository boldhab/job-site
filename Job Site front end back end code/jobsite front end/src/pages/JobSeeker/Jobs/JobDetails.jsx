import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Button from '../../../components/common/Button';
import { jobService } from '../../../services/job.service';
import { applicationService } from '../../../services/application.service';
import {
  ArrowLeftIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UsersIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  BookmarkIcon,
  ShareIcon,
  LightBulbIcon,
  ArrowRightIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const JobDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isApplying, setIsApplying] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [similarJobs, setSimilarJobs] = useState([]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await jobService.getById(id);
        setJobData(data);
      } catch (err) {
        setError(err?.message || 'Failed to load job');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    if (!jobData?.title) return;
    const fetchSimilar = async () => {
      try {
        const res = await jobService.search({ keyword: jobData.title, size: 3 });
        setSimilarJobs(Array.isArray(res?.content ? res.content : res) ? (res.content || res) : []);
      } catch (err) {
        console.error('Failed to load similar jobs', err);
      }
    };

    fetchSimilar();
  }, [jobData]);

  const handleApply = () => {
    navigate('apply');
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save job API call
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: jobData?.title,
        text: `Check out this job opportunity: ${jobData?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
    }
  };

  const displayJob = jobData || {};

  // Text gradient class
  const titleGradient = "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent";

  // Calculate time ago
  const getTimeAgo = (date) => {
    if (!date) return 'Recently';
    const now = new Date();
    const posted = new Date(date);
    const diffDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Format salary
  const formatSalary = (salary) => {
    if (!salary) return 'Competitive Salary';
    if (typeof salary === 'string') return salary;
    if (typeof salary === 'number') return `$${salary.toLocaleString()}/year`;
    return 'Competitive Salary';
  };

  // Format deadline date
  const formatDeadline = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-700 font-medium">Loading job details...</p>
        </div>
      </div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-amber-50/80 to-amber-100/50 rounded-3xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-amber-900 mb-4">Unable to Load Job</h3>
          <p className="text-amber-700/80 mb-8">{error}</p>
          <Link to="/job-seeker/jobs">
            <Button 
              variant="primary"
              className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 px-6 py-3 transition-all"
            >
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            to="/job-seeker/jobs" 
            className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium mb-6 group"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Jobs
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 border-2 border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-0 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center flex-shrink-0">
                        <BuildingOfficeIcon className="w-8 h-8 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h1 className={`text-2xl md:text-3xl font-bold ${titleGradient} mb-2`}>
                          {displayJob.title}
                        </h1>
                        <div className="flex items-center text-lg text-amber-800 font-medium mb-4">
                          <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                          {displayJob.company || displayJob.companyName || displayJob.employerName}
                        </div>
                      </div>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center p-4 rounded-2xl bg-gradient-to-br from-amber-50/50 to-amber-100/30 border border-amber-200/50">
                        <MapPinIcon className="w-5 h-5 text-amber-600 mr-3" />
                        <div>
                          <div className="text-sm text-amber-700/80">Location</div>
                          <div className="font-semibold text-amber-900">{displayJob.location || 'Remote'}</div>
                        </div>
                      </div>
                      <div className="flex items-center p-4 rounded-2xl bg-gradient-to-br from-amber-50/50 to-amber-100/30 border border-amber-200/50">
                        <BriefcaseIcon className="w-5 h-5 text-amber-600 mr-3" />
                        <div>
                          <div className="text-sm text-amber-700/80">Job Type</div>
                          <div className="font-semibold text-amber-900">{displayJob.type || 'Full-time'}</div>
                        </div>
                      </div>
                      <div className="flex items-center p-4 rounded-2xl bg-gradient-to-br from-amber-50/50 to-amber-100/30 border border-amber-200/50">
                        <CurrencyDollarIcon className="w-5 h-5 text-amber-600 mr-3" />
                        <div>
                          <div className="text-sm text-amber-700/80">Salary</div>
                          <div className="font-semibold text-amber-900">{formatSalary(displayJob.salary || displayJob.salaryRange)}</div>
                        </div>
                      </div>
                      <div className="flex items-center p-4 rounded-2xl bg-gradient-to-br from-amber-50/50 to-amber-100/30 border border-amber-200/50">
                        <ClockIcon className="w-5 h-5 text-amber-600 mr-3" />
                        <div>
                          <div className="text-sm text-amber-700/80">Posted</div>
                          <div className="font-semibold text-amber-900">{getTimeAgo(displayJob.posted || displayJob.createdAt)}</div>
                        </div>
                      </div>
                      {displayJob.deadline && (
                        <div className="flex items-center p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/30 border border-rose-200/50 md:col-span-2">
                          <CalendarDaysIcon className="w-5 h-5 text-rose-600 mr-3" />
                          <div>
                            <div className="text-sm text-rose-700/80">Application Deadline</div>
                            <div className="font-bold text-rose-900">{formatDeadline(displayJob.deadline)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-amber-200/50 pt-6 mt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Button 
                      onClick={handleApply} 
                      loading={isApplying} 
                      size="large"
                      className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 px-8 py-4 transition-all flex-1"
                    >
                      Apply Now
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="large"
                        onClick={handleSaveJob}
                        className="rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg px-6 py-4 transition-all"
                      >
                        <BookmarkIcon className={`w-5 h-5 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="large"
                        onClick={handleShare}
                        className="rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg px-6 py-4 transition-all"
                      >
                        <ShareIcon className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 border-2 border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-0 overflow-hidden">
              <div className="border-b border-amber-200/50 px-6 py-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-4">
                    <DocumentTextIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-amber-900">Job Description</h2>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                <div>
                  <p className="text-amber-800/80 leading-relaxed text-lg">
                    {displayJob.description || 'No description available.'}
                  </p>
                </div>

                {/* Key Responsibilities */}
                {(displayJob.responsibilities || []).length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center">
                      <LightBulbIcon className="w-5 h-5 mr-3 text-amber-600" />
                      Key Responsibilities
                    </h3>
                    <div className="space-y-3">
                      {displayJob.responsibilities.map((item, index) => (
                        <div key={index} className="flex items-start p-3 rounded-2xl bg-gradient-to-br from-amber-50/30 to-amber-100/10 border border-amber-200/30">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold text-xs mr-3 flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <span className="text-amber-800/80">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {(displayJob.requirements || []).length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center">
                      <CheckCircleIcon className="w-5 h-5 mr-3 text-amber-600" />
                      Requirements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {displayJob.requirements.map((item, index) => (
                        <div key={index} className="flex items-center p-3 rounded-2xl bg-gradient-to-br from-amber-50/30 to-amber-100/10 border border-amber-200/30">
                          <CheckCircleIcon className="w-4 h-4 text-amber-500 mr-3 flex-shrink-0" />
                          <span className="text-amber-800/80 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {(displayJob.benefits || []).length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center">
                      <StarIcon className="w-5 h-5 mr-3 text-amber-600" />
                      Benefits
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {displayJob.benefits.map((item, index) => (
                        <span key={index} className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200/50 text-sm font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Company Info Card */}
            <div className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 border-2 border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-0 overflow-hidden">
              <div className="border-b border-amber-200/50 px-6 py-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-4">
                    <BuildingOfficeIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-amber-900">About the Company</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-amber-800/80 mb-6">
                  {displayJob.companyDescription || displayJob.employerDescription || 'Company information not available.'}
                </p>
                
                {/* Company Stats */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-br from-amber-50/30 to-amber-100/10 border border-amber-200/30">
                    <span className="text-amber-700/80 text-sm">Company Size</span>
                    <span className="font-semibold text-amber-900">{displayJob.companySize || '51-200'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-br from-amber-50/30 to-amber-100/10 border border-amber-200/30">
                    <span className="text-amber-700/80 text-sm">Industry</span>
                    <span className="font-semibold text-amber-900">{displayJob.industry || 'Technology'}</span>
                  </div>
                </div>

                <button 
                  onClick={() => alert('Company profile coming soon!')}
                  className="inline-flex items-center justify-center w-full py-3 rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg transition-all"
                >
                  View Company Profile
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>

            {/* Similar Jobs Card */}
            <div className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 border-2 border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-0 overflow-hidden">
              <div className="border-b border-amber-200/50 px-6 py-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-4">
                    <BriefcaseIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-amber-900">Similar Jobs</h3>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {similarJobs.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/5 to-amber-600/5 flex items-center justify-center mx-auto mb-4">
                        <BriefcaseIcon className="w-8 h-8 text-amber-400" />
                      </div>
                      <p className="text-amber-700/80">No similar jobs found</p>
                    </div>
                  ) : (
                    similarJobs.map((s) => (
                      <Link 
                        key={s.id} 
                        to={`/job-seeker/jobs/${s.id}`}
                        className="block group"
                      >
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-amber-50/50 border border-amber-200/50 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/5 to-amber-600/5 flex items-center justify-center flex-shrink-0">
                              <BuildingOfficeIcon className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-amber-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                                {s.title}
                              </h4>
                              <p className="text-sm text-amber-700/80 mt-1">
                                {s.employerName ?? s.company}
                              </p>
                              <div className="flex items-center text-xs text-amber-600/70 mt-2">
                                <MapPinIcon className="w-3 h-3 mr-1" />
                                {s.location}
                              </div>
                            </div>
                            <ArrowRightIcon className="w-4 h-4 text-amber-500 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border-2 border-amber-300/30 rounded-3xl p-6">
              <h4 className="font-bold text-amber-900 mb-6">Job Insights</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-amber-700/80">Applications</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                    {displayJob.applicants || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-700/80">Views</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                    {displayJob.views || '1.2k'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-700/80">Apply Rate</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                    {displayJob.applyRate || '12%'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper icon components
const DocumentTextIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const StarIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

export default JobDetails;