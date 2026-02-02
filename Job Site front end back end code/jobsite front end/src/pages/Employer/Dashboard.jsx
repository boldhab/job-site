import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { 
  BriefcaseIcon, 
  UserGroupIcon, 
  PlusCircleIcon, 
  CheckBadgeIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { employerService } from '../../services/employer.service';
import { jobService } from '../../services/job.service';

const EmployerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const s = await employerService.getStatistics();
      setStats(s || {});
      const jobs = await jobService.getMyJobs();
      setRecentJobs(Array.isArray(jobs) ? jobs.slice(0, 5) : []);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Text gradient classes
  const titleGradient = "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent";
  const statGradient = "bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent";

  // Status colors
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200/50';
      case 'closed': return 'bg-gradient-to-r from-amber-100/50 to-amber-50/30 text-amber-700 border border-amber-200/50';
      case 'draft': return 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200';
      default: return 'bg-gradient-to-r from-amber-100/50 to-amber-50/30 text-amber-700 border border-amber-200/50';
    }
  };

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-12 gap-6">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center">
              <BriefcaseIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className={`text-2xl lg:text-3xl font-bold ${titleGradient}`}>Employer Dashboard</h1>
              <p className="text-amber-800/70 mt-2">Manage your jobs and track applicant analytics</p>
            </div>
          </div>
          
          {/* Stats Summary */}
          {!loading && stats && (
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-sm text-amber-700/80">
                  {stats?.activeJobs || 0} Active Jobs
                </span>
              </div>
              <div className="w-px h-4 bg-amber-300/50"></div>
              <div className="flex items-center gap-2">
                <ArrowTrendingUpIcon className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-700/80">
                  {stats?.totalApplications || 0} Total Applicants
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={fetchData}
            disabled={refreshing}
            className="rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg px-4 py-3 transition-all"
          >
            <ArrowPathIcon className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link to="/employer/jobs/post">
            <Button 
              variant="primary"
              className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 px-6 py-3 transition-all"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 lg:mb-12">
        {/* Active Jobs Card */}
        <Card className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 border-2 border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-400/10 to-amber-600/5 rounded-full -translate-y-4 translate-x-4"></div>
          <div className="p-6 md:p-8">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-6">
                <BriefcaseIcon className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-700/80 mb-2">Active Jobs</p>
                <h3 className={`text-3xl font-bold ${statGradient}`}>
                  {loading ? '—' : stats?.activeJobs ?? 0}
                </h3>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-amber-200/50">
              <div className="flex items-center text-sm text-amber-700/70">
                <EyeIcon className="w-4 h-4 mr-2" />
                <span>Currently visible to candidates</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Total Applicants Card */}
        <Card className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 border-2 border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-400/10 to-amber-600/5 rounded-full -translate-y-4 translate-x-4"></div>
          <div className="p-6 md:p-8">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-6">
                <UserGroupIcon className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-700/80 mb-2">Total Applicants</p>
                <h3 className={`text-3xl font-bold ${statGradient}`}>
                  {loading ? '—' : stats?.totalApplications ?? 0}
                </h3>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-amber-200/50">
              <div className="flex items-center text-sm text-amber-700/70">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-2" />
                <span>Across all job postings</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Jobs Filled Card */}
        <Card className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 border-2 border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-400/10 to-amber-600/5 rounded-full -translate-y-4 translate-x-4"></div>
          <div className="p-6 md:p-8">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-6">
                <CheckBadgeIcon className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-700/80 mb-2">Jobs Filled</p>
                <h3 className={`text-3xl font-bold ${statGradient}`}>
                  {loading ? '—' : stats?.hiredApplications ?? 0}
                </h3>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-amber-200/50">
              <div className="flex items-center text-sm text-amber-700/70">
                <CheckBadgeIcon className="w-4 h-4 mr-2" />
                <span>Successfully hired candidates</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Jobs Section */}
      <Card className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 border-2 border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-0 overflow-hidden">
        {/* Header */}
        <div className="border-b border-amber-200/50 px-6 md:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-4">
                <ClockIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${titleGradient}`}>Recent Job Postings</h2>
                <p className="text-amber-700/80 text-sm mt-1">Latest job listings and their applicant counts</p>
              </div>
            </div>
            <Link 
              to="/employer/jobs" 
              className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium hover:underline"
            >
              View All
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Jobs List */}
        <div className="px-6 md:px-8 py-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-amber-700 font-medium">Loading recent jobs…</p>
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/5 to-amber-600/5 flex items-center justify-center mx-auto mb-6">
                <BriefcaseIcon className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-amber-900 mb-2">No Recent Jobs</h3>
              <p className="text-amber-700/80 mb-6">Start by posting your first job opening</p>
              <Link to="/employer/jobs/post">
                <Button 
                  variant="primary"
                  className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 px-6 py-3 transition-all"
                >
                  Post Your First Job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="bg-gradient-to-br from-white to-amber-50/50 p-4 md:p-6 rounded-2xl border border-amber-200/50 hover:border-amber-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h4 className="text-lg font-bold text-amber-900">{job.title}</h4>
                        <span className={`px-3 py-1.5 rounded-2xl text-xs font-bold ${getStatusColor(job.status)}`}>
                          {job.status || 'Active'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-amber-700/80">
                        <span className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-2" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <BriefcaseIcon className="w-4 h-4 mr-2" />
                          {job.type || 'Full-time'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-2" />
                          Posted {job.posted || 'recently'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center px-4 border-l border-amber-200/50">
                        <span className="block text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                          {job.applicants ?? job.applicantCount ?? 0}
                        </span>
                        <span className="text-xs text-amber-600/70 font-medium">Applicants</span>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          size="small"
                          className="rounded-2xl border border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg px-4 py-2.5 transition-all"
                        >
                          <EyeIcon className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Link to={`/employer/jobs/${job.id}/analytics`}>
                          <Button 
                            variant="outline" 
                            size="small"
                            className="rounded-2xl border border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg px-4 py-2.5 transition-all"
                          >
                            Manage
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar for active jobs */}
                  {job.status?.toLowerCase() === 'active' && (
                    <div className="mt-6">
                      <div className="w-full bg-amber-100/50 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                          style={{ width: `${Math.min((job.applicants || 0) * 10, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-amber-600/70 mt-2">
                        <span>Application Progress</span>
                        <span>{Math.min((job.applicants || 0) * 10, 100)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border-2 border-amber-300/30 rounded-3xl p-6 text-center">
          <h4 className="font-bold text-amber-900 mb-4">Post a Job</h4>
          <p className="text-amber-700/80 text-sm mb-6">Reach qualified candidates quickly</p>
          <Link to="/employer/jobs/post">
            <Button 
              variant="primary"
              className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 w-full py-3 transition-all"
            >
              Post Job
            </Button>
          </Link>
        </div>
        
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border-2 border-amber-300/30 rounded-3xl p-6 text-center">
          <h4 className="font-bold text-amber-900 mb-4">View Applicants</h4>
          <p className="text-amber-700/80 text-sm mb-6">Manage and review candidate applications</p>
          <Link to="/employer/applications">
            <Button 
              variant="outline"
              className="rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg w-full py-3 transition-all"
            >
              View Applicants
            </Button>
          </Link>
        </div>
        
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border-2 border-amber-300/30 rounded-3xl p-6 text-center">
          <h4 className="font-bold text-amber-900 mb-4">Analytics</h4>
          <p className="text-amber-700/80 text-sm mb-6">Track job performance and insights</p>
          <Link to="/employer/analytics">
            <Button 
              variant="outline"
              className="rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg w-full py-3 transition-all"
            >
              View Analytics
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper icon component
const MapPinIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default EmployerDashboard;