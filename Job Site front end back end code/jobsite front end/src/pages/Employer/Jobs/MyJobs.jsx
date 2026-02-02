import React, { useEffect, useState } from 'react';
import { jobService } from '../../../services/job.service';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import { PencilSquareIcon, TrashIcon, EyeIcon, PlusIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getMyJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleDelete = async (jobId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await jobService.delete(jobId);
      // Refresh the jobs list
      fetch();
      alert('Job deleted successfully!');
    } catch (err) {
      console.error('Failed to delete job', err);
      alert(err?.message || 'Failed to delete job. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200/50';
      case 'Closed': return 'bg-gradient-to-r from-amber-100/50 to-amber-50/30 text-amber-700 border border-amber-200/50';
      case 'Draft': return 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200';
      default: return 'bg-gradient-to-r from-amber-100/50 to-amber-50/30 text-amber-700 border border-amber-200/50';
    }
  };

  // Text gradient class
  const titleGradient = "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent";

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-12 gap-6">
        <div className="mb-4 sm:mb-0">
          <h1 className={`text-2xl lg:text-3xl font-bold ${titleGradient}`}>My Jobs</h1>
          <p className="text-amber-800/70 mt-2">Manage your posted jobs and track applicants</p>
        </div>
        <Link to="/employer/jobs/post">
          <Button 
            variant="primary" 
            className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 px-6 py-3 transition-all duration-300"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-amber-700 font-medium">Loading your jobs...</p>
          </div>
        </div>
      ) : error ? (
        /* Error State */
        <div className="bg-gradient-to-br from-amber-50/80 to-amber-100/50 p-8 rounded-3xl border-2 border-amber-300 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-amber-900 mb-4">Unable to Load Jobs</h3>
          <p className="text-amber-700/80 mb-8 max-w-md mx-auto">{error}</p>
          <Button 
            onClick={fetch} 
            variant="outline"
            className="rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg px-6 py-3 transition-all"
          >
            Try Again
          </Button>
        </div>
      ) : jobs.length === 0 ? (
        /* Empty State */
        <Card className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/20 border-2 border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className={`text-2xl font-bold ${titleGradient} mb-4`}>No Jobs Posted Yet</h3>
            <p className="text-amber-800/70 mb-8 max-w-md mx-auto">Start building your team by posting your first job opening and attract top talent.</p>
            <Link to="/employer/jobs/post">
              <Button 
                variant="primary"
                className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 px-8 py-4 transition-all duration-300"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Post Your First Job
              </Button>
            </Link>
            <div className="mt-12 pt-8 border-t border-amber-200/50">
              <p className="text-sm text-amber-600/70">Get started with our guided job posting process</p>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
        </Card>
      ) : (
        /* Jobs List */
        <div className="space-y-6">
          {jobs.map((job) => (
            <Card 
              key={job.id} 
              className="bg-gradient-to-br from-white via-amber-50/20 to-amber-100/10 border-2 border-amber-200/50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1 p-0"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h2 className="text-xl lg:text-2xl font-bold text-amber-900">{job.title}</h2>
                      <span className={`px-4 py-2 rounded-2xl text-sm font-semibold ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-amber-800/80 mb-6">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium">{job.location}</span>
                      </div>
                      <div className="w-px h-4 bg-amber-300/50"></div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium">Posted {job.posted}</span>
                      </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="flex items-center gap-2">
                          <ArrowTrendingUpIcon className="w-4 h-4 text-amber-500" />
                          <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                            {job.applicantCount || 0}
                          </span>
                        </div>
                        <span className="text-xs text-amber-600/70 font-medium">Applicants</span>
                      </div>
                      
                      {job.views && (
                        <div className="text-center">
                          <span className="text-xl font-bold text-amber-800">{job.views}</span>
                          <span className="text-xs text-amber-600/70 block">Views</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                    <Link to={`/employer/jobs/${job.id}/analytics`}>
                      <Button 
                        variant="outline" 
                        size="small"
                        className="rounded-2xl border border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg px-4 py-2.5 transition-all"
                      >
                        <EyeIcon className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Link to="/employer/jobs/post"> {/* TODO: Edit logic */}
                      <Button 
                        variant="outline" 
                        size="small"
                        className="rounded-2xl border border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg px-4 py-2.5 transition-all"
                      >
                        <PencilSquareIcon className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="small"
                      onClick={() => handleDelete(job.id, job.title)}
                      className="rounded-2xl border border-amber-300 text-amber-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 hover:shadow-lg px-4 py-2.5 transition-all"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Progress Indicator for Active Jobs */}
              {job.status === 'Active' && (
                <div className="px-8 pb-6">
                  <div className="w-full bg-amber-100/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                      style={{ width: `${Math.min((job.applicantCount || 0) * 10, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-amber-600/70 mt-2">
                    <span>Application Progress</span>
                    <span>{Math.min((job.applicantCount || 0) * 10, 100)}%</span>
                  </div>
                </div>
              )}

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-400/10 to-amber-600/5 rounded-full -translate-y-4 translate-x-4"></div>
            </Card>
          ))}

          {/* Summary Stats */}
          <div className="mt-12 p-8 bg-gradient-to-br from-amber-50/50 to-amber-100/30 border-2 border-amber-200/50 rounded-3xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">Job Posting Summary</h3>
                <p className="text-amber-800/70">
                  Total {jobs.length} jobs • {jobs.filter(j => j.status === 'Active').length} active • {jobs.filter(j => j.status === 'Draft').length} drafts
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                  {jobs.reduce((sum, job) => sum + (job.applicantCount || 0), 0)}
                </span>
                <span className="text-amber-700 font-medium">Total Applicants</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyJobs;