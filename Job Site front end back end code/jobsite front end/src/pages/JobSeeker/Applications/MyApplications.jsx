import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/common/Card';
import { applicationService } from '../../../services/application.service';
import {
  ClockIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  EyeIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplications = async () => {
    try {
      setRefreshing(true);
      const data = await applicationService.getByJobSeeker();
      setApplications(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s?.includes('review') || s?.includes('submit')) 
      return 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200/50';
    if (s?.includes('interview') || s?.includes('shortlist')) 
      return 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border border-purple-200/50';
    if (s?.includes('reject')) 
      return 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200/50';
    if (s?.includes('offer') || s?.includes('hire') || s?.includes('accept')) 
      return 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200/50';
    return 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200/50';
  };

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase();
    if (s?.includes('review') || s?.includes('submit')) return ClockIcon;
    if (s?.includes('interview') || s?.includes('shortlist')) return UserGroupIcon;
    if (s?.includes('reject')) return XCircleIcon;
    if (s?.includes('offer') || s?.includes('hire') || s?.includes('accept')) return CheckCircleIcon;
    return ClockIcon;
  };

  // Text gradient class
  const titleGradient = "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent";

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="mb-8 md:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className={`text-2xl lg:text-3xl font-bold ${titleGradient}`}>My Applications</h1>
              <p className="text-amber-800/70 mt-2">Track and manage your job applications</p>
            </div>
          </div>
          
          <button
            onClick={fetchApplications}
            disabled={refreshing}
            className="inline-flex items-center px-6 py-3 rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-2xl p-4 border border-amber-200/50">
            <div className="flex items-center justify-between">
              <span className="text-amber-700/80 text-sm">Total</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                {applications.length}
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 rounded-2xl p-4 border border-blue-200/50">
            <div className="flex items-center justify-between">
              <span className="text-blue-700/80 text-sm">Under Review</span>
              <span className="text-2xl font-bold text-blue-700">
                {applications.filter(app => app.status?.toLowerCase().includes('review')).length}
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50/50 to-purple-100/30 rounded-2xl p-4 border border-purple-200/50">
            <div className="flex items-center justify-between">
              <span className="text-purple-700/80 text-sm">Interview</span>
              <span className="text-2xl font-bold text-purple-700">
                {applications.filter(app => app.status?.toLowerCase().includes('interview')).length}
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 rounded-2xl p-4 border border-emerald-200/50">
            <div className="flex items-center justify-between">
              <span className="text-emerald-700/80 text-sm">Accepted</span>
              <span className="text-2xl font-bold text-emerald-700">
                {applications.filter(app => app.status?.toLowerCase().includes('accept') || app.status?.toLowerCase().includes('hire')).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Card */}
      <Card className="bg-gradient-to-br from-white via-amber-50/20 to-amber-100/10 border-2 border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-0 overflow-hidden">
        {/* Table Header */}
        <div className="border-b border-amber-200/50 px-6 py-4 bg-gradient-to-r from-amber-50/30 to-amber-100/10">
          <div className="flex items-center">
            <DocumentTextIcon className="w-5 h-5 text-amber-600 mr-3" />
            <h2 className="text-lg font-bold text-amber-900">Application History</h2>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-amber-700 font-medium">Loading your applications...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <div className="bg-gradient-to-br from-amber-50/80 to-amber-100/50 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">Unable to Load Applications</h3>
              <p className="text-amber-700/80 mb-8">{error}</p>
              <button
                onClick={fetchApplications}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400/5 to-amber-600/5 flex items-center justify-center mx-auto mb-6">
              <DocumentTextIcon className="w-10 h-10 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-amber-900 mb-4">No Applications Yet</h3>
            <p className="text-amber-700/80 mb-8 max-w-md mx-auto">
              Start applying to jobs to track your progress here. Your application history will appear in this dashboard.
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 transition-all"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-amber-200/50">
              <thead>
                <tr className="bg-gradient-to-r from-amber-50/30 to-amber-100/10">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <BriefcaseIcon className="w-4 h-4 mr-2" />
                      Job Title
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                      Company
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Applied Date
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      Status
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-amber-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-200/30">
                {applications.map((app) => {
                  const StatusIcon = getStatusIcon(app.status);
                  return (
                    <tr 
                      key={app.id} 
                      className="hover:bg-gradient-to-r hover:from-amber-50/20 hover:to-amber-100/10 transition-all duration-300 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/5 to-amber-600/5 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                            <BriefcaseIcon className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-amber-900">{app.job?.title || 'Unknown Job'}</div>
                            <div className="text-xs text-amber-600/70 flex items-center mt-1">
                              <MapPinIcon className="w-3 h-3 mr-1" />
                              {app.job?.location || 'Remote'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/5 to-amber-600/5 flex items-center justify-center mr-3">
                            <BuildingOfficeIcon className="w-4 h-4 text-amber-600" />
                          </div>
                          <div className="text-sm text-amber-800">{app.job?.companyName || app.job?.employer?.name || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-amber-700/80">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          }) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-xs font-semibold ${getStatusColor(app.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1.5" />
                            {app.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => navigate(`/job-seeker/applications/${app.id}`)}
                          className="inline-flex items-center px-4 py-2 rounded-2xl border border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg transition-all duration-300"
                        >
                          <EyeIcon className="w-4 h-4 mr-2" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Stats */}
        {applications.length > 0 && (
          <div className="border-t border-amber-200/50 px-6 py-4 bg-gradient-to-r from-amber-50/20 to-amber-100/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-amber-700/80">
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
                Showing {applications.length} application{applications.length !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span>Under Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  <span>Interview</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span>Accepted</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Quick Tips */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border-2 border-amber-300/30 rounded-3xl p-6">
          <h4 className="font-bold text-amber-900 mb-4 flex items-center">
            <ClockIcon className="w-5 h-5 mr-2 text-amber-600" />
            Application Tips
          </h4>
          <ul className="space-y-3 text-sm text-amber-700/80">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mt-2 mr-3 flex-shrink-0"></span>
              Follow up after 7-10 days if you haven't heard back
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mt-2 mr-3 flex-shrink-0"></span>
              Prepare for interviews even before you're contacted
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mt-2 mr-3 flex-shrink-0"></span>
              Keep your resume updated for new opportunities
            </li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border-2 border-amber-300/30 rounded-3xl p-6">
          <h4 className="font-bold text-amber-900 mb-4 flex items-center">
            <ArrowPathIcon className="w-5 h-5 mr-2 text-amber-600" />
            Keep Applying
          </h4>
          <p className="text-amber-700/80 text-sm mb-6">
            Don't stop at one application. Increase your chances by applying to multiple relevant positions.
          </p>
          <button
            onClick={() => navigate('/jobs')}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 transition-all"
          >
            Find More Jobs
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper icon components
const BriefcaseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default MyApplications;