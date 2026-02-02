import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Loader from '../../../components/common/Loader';
import { employerService } from '../../../services/employer.service';
import { 
  UserCircleIcon,
  BriefcaseIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const ReceivedApplications = () => {
  const [filter, setFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    shortlisted: 0,
    hired: 0,
    rejected: 0
  });

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employerService.getApplications();
      const apps = Array.isArray(data) ? data : [];
      
      setApplications(apps);
      
      // Calculate stats
      const statsData = {
        total: apps.length,
        pending: apps.filter(app => app.status?.toLowerCase() === 'pending').length,
        reviewing: apps.filter(app => app.status?.toLowerCase() === 'reviewing').length,
        shortlisted: apps.filter(app => app.status?.toLowerCase() === 'shortlisted').length,
        hired: apps.filter(app => app.status?.toLowerCase() === 'hired').length,
        rejected: apps.filter(app => app.status?.toLowerCase() === 'rejected').length
      };
      
      setStats(statsData);
    } catch (err) {
      setError(err?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const filteredApps = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status?.toLowerCase() === filter.toLowerCase());

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'from-amber-100 to-orange-100', text: 'text-amber-800', icon: ClockIcon },
      reviewing: { color: 'from-blue-100 to-cyan-100', text: 'text-blue-800', icon: EyeIcon },
      shortlisted: { color: 'from-emerald-100 to-green-100', text: 'text-emerald-800', icon: StarIcon },
      interview: { color: 'from-violet-100 to-purple-100', text: 'text-violet-800', icon: CalendarIcon },
      hired: { color: 'from-emerald-100 to-green-100', text: 'text-emerald-800', icon: CheckCircleIcon },
      rejected: { color: 'from-red-100 to-red-50', text: 'text-red-800', icon: XCircleIcon }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${config.color} ${config.text} text-xs font-bold rounded-xl border border-${config.text.split('-')[1]}-200`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const StatCard = ({ title, value, color = 'amber', icon: Icon }) => {
    const colorMap = {
      amber: 'from-amber-100 to-amber-50 text-amber-600',
      blue: 'from-blue-100 to-blue-50 text-blue-600',
      emerald: 'from-emerald-100 to-emerald-50 text-emerald-600',
      violet: 'from-violet-100 to-violet-50 text-violet-600',
      red: 'from-red-100 to-red-50 text-red-600'
    };

    return (
      <div className="p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/30 rounded-2xl border-2 border-amber-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">{title}</p>
            <p className="text-2xl font-bold text-neutral-900">{value}</p>
          </div>
          <div className={`p-3 bg-gradient-to-br ${colorMap[color]} rounded-xl`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent">
                Received Applications
              </h1>
              <p className="text-neutral-600 mt-2">
                Manage and review candidates for your Ethiopian opportunities.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-amber-200 text-amber-800 hover:border-amber-300"
              >
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard title="Total" value={stats.total} color="amber" icon={UsersIcon} />
            <StatCard title="Pending" value={stats.pending} color="amber" icon={ClockIcon} />
            <StatCard title="Reviewing" value={stats.reviewing} color="blue" icon={EyeIcon} />
            <StatCard title="Shortlisted" value={stats.shortlisted} color="emerald" icon={StarIcon} />
            <StatCard title="Hired" value={stats.hired} color="emerald" icon={CheckCircleIcon} />
            <StatCard title="Rejected" value={stats.rejected} color="red" icon={XCircleIcon} />
          </div>
        </div>

        {/* Filters */}
        <Card variant="gradient" padding="medium" className="border-amber-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                <FunnelIcon className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-amber-800">Filter Applications</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'all', label: 'All Applications' },
                { value: 'pending', label: 'Pending' },
                { value: 'reviewing', label: 'Reviewing' },
                { value: 'shortlisted', label: 'Shortlisted' },
                { value: 'interview', label: 'Interview' },
                { value: 'hired', label: 'Hired' },
                { value: 'rejected', label: 'Rejected' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    filter === option.value
                      ? 'bg-white text-amber-800 shadow-sm border-2 border-amber-200'
                      : 'text-amber-700 hover:text-amber-800 hover:bg-amber-50/50 border-2 border-transparent'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Applications Table */}
        <Card variant="elevated" padding="none" className="border-amber-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-amber-50/80 to-orange-50/50 border-b-2 border-amber-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                    Opportunity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-amber-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12">
                      <div className="flex flex-col items-center justify-center">
                        <Loader variant="dots" />
                        <p className="mt-3 text-amber-700 font-medium">Loading applications...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                          <XCircleIcon className="w-6 h-6 text-red-600" />
                          <p className="font-semibold text-red-800">{error}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={fetchApplications}
                          className="mt-4"
                        >
                          Try Again
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl border-2 border-amber-200 mb-4">
                          <UsersIcon className="w-8 h-8 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-amber-800 mb-2">No Applications Found</h3>
                        <p className="text-amber-700 max-w-md mx-auto mb-6">
                          {filter === 'all' 
                            ? "You haven't received any applications yet. Check back soon!"
                            : `No applications with "${filter}" status found. Try a different filter.`
                          }
                        </p>
                        {filter !== 'all' && (
                          <Button
                            variant="outline"
                            onClick={() => setFilter('all')}
                            className="border-amber-200 text-amber-800"
                          >
                            View All Applications
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr 
                      key={app.id} 
                      className="hover:bg-gradient-to-r hover:from-amber-50/30 hover:to-orange-50/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl border-2 border-amber-200 flex items-center justify-center">
                            <span className="text-lg font-bold text-amber-700">
                              {app.jobSeekerName?.split(' ').map(n => n[0]).join('').slice(0,2) || 'NA'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-900 group-hover:text-amber-800 transition-colors">
                              {app.jobSeekerName || 'Candidate'}
                            </p>
                            <p className="text-sm text-amber-600">{app.jobSeekerHeadline || 'Professional Profile'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-lg">
                            <BriefcaseIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">{app.jobTitle || app.role || 'Opportunity'}</p>
                            <p className="text-xs text-amber-600">View details</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-amber-600" />
                          <span className="text-sm text-neutral-700">{formatDate(app.appliedAt || app.date)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          to={`/employer/applications/${app.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 font-semibold rounded-xl border-2 border-amber-200 hover:border-amber-300 transition-all duration-200 group"
                        >
                          <EyeIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {filteredApps.length > 0 && (
            <div className="px-6 py-4 border-t-2 border-amber-100 bg-gradient-to-r from-amber-50/50 to-orange-50/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-sm text-amber-700 font-medium">
                  Showing <span className="font-bold">{filteredApps.length}</span> of <span className="font-bold">{applications.length}</span> applications
                </p>
                <div className="flex items-center gap-3">
                  <select 
                    className="px-4 py-2 rounded-xl border-2 border-amber-200 bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-300 transition-all duration-300"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview">Interview</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <Button
                    variant="outline"
                    className="border-amber-200 text-amber-800 hover:border-amber-300"
                    onClick={fetchApplications}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReceivedApplications;