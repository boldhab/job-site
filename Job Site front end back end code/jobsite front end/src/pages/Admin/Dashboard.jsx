import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { 
  UserGroupIcon, 
  BriefcaseIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  UsersIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/admin.service';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ 
    totalUsers: 0, 
    jobSeekers: 0, 
    totalEmployers: 0, 
    totalJobs: 0, 
    totalApplications: 0,
    pendingJobs: 0,
    activeJobs: 0,
    newUsersThisMonth: 0,
    conversionRate: 8.7
  });
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);

  const handleApprove = async (id) => {
    setProcessing(id);
    try {
      await adminService.approveJob(id);
      setPendingJobs((p) => p.filter(j => j.id !== id));
      setStats((s) => ({ 
        ...s, 
        pendingJobs: Math.max(0, (s.pendingJobs || 1) - 1),
        totalJobs: (s.totalJobs || 0) + 1
      }));
    } catch (err) {
      console.error('Approve failed', err);
      setError(err?.message || 'Failed to approve opportunity');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id) => {
    setProcessing(id);
    try {
      const reason = window.prompt('Reason for rejection (optional):', '');
      if (reason === null) return;
      await adminService.rejectJob(id, reason || 'Rejected by administrator');
      setPendingJobs((p) => p.filter(j => j.id !== id));
      setStats((s) => ({ ...s, pendingJobs: Math.max(0, (s.pendingJobs || 1) - 1) }));
    } catch (err) {
      console.error('Reject failed', err);
      setError(err?.message || 'Failed to reject opportunity');
    } finally {
      setProcessing(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [data, pendingData] = await Promise.all([
          adminService.getStatistics(),
          adminService.getPendingJobs().catch(() => []),
        ]);

        setStats({
          totalUsers: data.totalUsers || 0,
          jobSeekers: data.jobSeekers || 0,
          totalEmployers: data.totalEmployers || 0,
          totalJobs: data.totalJobs || 0,
          totalApplications: data.totalApplications || 0,
          pendingJobs: data.pendingJobs || 0,
          activeJobs: data.activeJobs || 0,
          newUsersThisMonth: data.newUsersThisMonth || 0,
          conversionRate: data.conversionRate || 8.7
        });

        const mapped = (Array.isArray(pendingData) ? pendingData : pendingData?.content || []).map((j) => ({
          id: j.id,
          title: j.title,
          company: j.employerName ?? j.company ?? j.employer?.companyName ?? j.employer?.name,
          postedBy: j.postedBy ?? j.employerName ?? j.employer?.companyName ?? 'N/A',
          date: j.createdAt ? new Date(j.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A',
          location: j.location || 'Addis Ababa',
          jobType: j.jobType || 'Full Time'
        }));

        setPendingJobs(mapped);
      } catch (err) {
        console.error('Failed to load admin dashboard', err);
        setError(err?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color = 'amber', trend = null, loading }) => {
    const colorMap = {
      amber: 'from-amber-100 to-amber-50 text-amber-600',
      emerald: 'from-emerald-100 to-emerald-50 text-emerald-600',
      blue: 'from-blue-100 to-blue-50 text-blue-600',
      violet: 'from-violet-100 to-violet-50 text-violet-600',
      orange: 'from-orange-100 to-orange-50 text-orange-600'
    };

    return (
      <Card variant="gradient" padding="medium" className="border-amber-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">{title}</p>
            <p className="text-2xl font-bold text-neutral-900">
              {loading ? '—' : value}
            </p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">{trend}%</span>
                <span className="text-xs text-neutral-500 ml-1">growth</span>
              </div>
            )}
          </div>
          <div className={`p-3 bg-gradient-to-br ${colorMap[color]} rounded-xl`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </Card>
    );
  };

  const formatNumber = (num) => {
    if (typeof num !== 'number') return num;
    return new Intl.NumberFormat().format(num);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-neutral-600 mt-2">
                Welcome back! Here's your overview of Ethio-Career platform activity and moderation tasks.
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-100">
              <ShieldCheckIcon className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">
                System Administrator
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard 
              title="Total Users" 
              value={formatNumber(stats.totalUsers)}
              icon={UsersIcon}
              color="blue"
              trend={12.5}
              loading={loading}
            />
            <StatCard 
              title="Job Seekers" 
              value={formatNumber(stats.jobSeekers)}
              icon={AcademicCapIcon}
              color="violet"
              loading={loading}
            />
            <StatCard 
              title="Employers" 
              value={formatNumber(stats.totalEmployers)}
              icon={BuildingOfficeIcon}
              color="emerald"
              loading={loading}
            />
            <StatCard 
              title="Opportunities" 
              value={formatNumber(stats.totalJobs)}
              icon={BriefcaseIcon}
              color="orange"
              loading={loading}
            />
            <StatCard 
              title="Applications" 
              value={formatNumber(stats.totalApplications)}
              icon={ClipboardDocumentListIcon}
              color="amber"
              trend={18.0}
              loading={loading}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card variant="elevated" padding="large" className="border-amber-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                <RocketLaunchIcon className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-amber-800">Quick Actions</h2>
            </div>

            <div className="space-y-3">
              <button className="w-full p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/30 rounded-2xl border-2 border-amber-100 hover:border-amber-200 transition-all duration-300 text-left group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-100 to-green-50 rounded-xl">
                      <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">Review Employer Approvals</p>
                      <p className="text-sm text-amber-600">New companies pending</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl">12 new</span>
                </div>
              </button>

              <button className="w-full p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/30 rounded-2xl border-2 border-amber-100 hover:border-amber-200 transition-all duration-300 text-left group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-xl">
                      <ChartBarIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">View Analytics</p>
                      <p className="text-sm text-amber-600">Platform performance metrics</p>
                    </div>
                  </div>
                  <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600" />
                </div>
              </button>

              <button className="w-full p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/30 rounded-2xl border-2 border-amber-100 hover:border-amber-200 transition-all duration-300 text-left group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-violet-100 to-purple-50 rounded-xl">
                      <UsersIcon className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">Manage Users</p>
                      <p className="text-sm text-amber-600">User accounts & permissions</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-xl">{stats.totalUsers}</span>
                </div>
              </button>
            </div>
          </Card>

          {/* Pending Approvals */}
          <Card variant="elevated" padding="none" className="border-amber-100 lg:col-span-2">
            <div className="px-6 py-4 border-b-2 border-amber-100 bg-gradient-to-r from-amber-50/80 to-orange-50/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                    <ShieldCheckIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-amber-800">Pending Opportunity Approvals</h2>
                </div>
                <span className="text-sm font-bold text-amber-800 bg-white px-3 py-1 rounded-xl border-2 border-amber-100">
                  {pendingJobs.length} pending
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 flex items-center justify-center">
                  <Loader variant="dots" />
                  <span className="ml-3 text-amber-700">Loading pending opportunities...</span>
                </div>
              ) : pendingJobs.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-50 rounded-2xl border-2 border-emerald-200 mb-4">
                    <CheckCircleIcon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-800 mb-2">All Caught Up!</h3>
                  <p className="text-emerald-700 max-w-md mx-auto">
                    No pending opportunities requiring approval at the moment.
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y-2 divide-amber-100">
                  <thead>
                    <tr className="bg-gradient-to-r from-amber-50/50 to-orange-50/30">
                      <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                        Opportunity Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-amber-800 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-amber-800 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-amber-100">
                    {pendingJobs.map((job) => (
                      <tr 
                        key={job.id} 
                        className="hover:bg-gradient-to-r hover:from-amber-50/30 hover:to-orange-50/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-neutral-900 truncate">
                              {job.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-lg">
                                {job.jobType}
                              </span>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-lg">
                                {job.location}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg border-2 border-amber-200 flex items-center justify-center">
                              <BuildingOfficeIcon className="w-4 h-4 text-amber-600" />
                            </div>
                            <p className="text-sm font-medium text-neutral-900">{job.company}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-xs text-amber-700">Posted by: {job.postedBy}</p>
                            <p className="text-xs text-amber-600">Date: {job.date}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="small"
                              className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                              onClick={() => handleReject(job.id)}
                              disabled={processing === job.id}
                              loading={processing === job.id}
                            >
                              <XCircleIcon className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              variant="primary"
                              size="small"
                              className="bg-gradient-to-r from-emerald-600 to-emerald-700 border-0"
                              onClick={() => handleApprove(job.id)}
                              disabled={processing === job.id}
                              loading={processing === job.id}
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
              )}
            </div>
          </Card>
        </div>

        {/* Platform Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="gradient" padding="medium" className="border-amber-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">Active Opportunities</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatNumber(stats.activeJobs || 0)}
                </p>
                <p className="text-xs text-amber-600 mt-2">Currently live on platform</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-50 rounded-xl">
                <BriefcaseIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </Card>

          <Card variant="gradient" padding="medium" className="border-amber-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">New Users This Month</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatNumber(stats.newUsersThisMonth || 0)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">+8.2%</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-xl">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card variant="gradient" padding="medium" className="border-amber-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">Conversion Rate</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {stats.conversionRate || '—'}%
                </p>
                <p className="text-xs text-amber-600 mt-2">Views to applications</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-violet-100 to-purple-50 rounded-xl">
                <ChartBarIcon className="w-6 h-6 text-violet-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;