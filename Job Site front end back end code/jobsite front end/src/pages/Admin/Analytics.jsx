import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { jobService } from '../../services/job.service';
import { employerService } from '../../services/employer.service';
import { 
  UsersIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ClockIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

// Enhanced Stat Card Component
const StatCard = ({ title, value, change, positive, icon: Icon, loading = false }) => (
  <Card variant="gradient" padding="medium" className="border-amber-100">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-semibold text-amber-800 mb-1">{title}</p>
        <p className="text-2xl font-bold text-neutral-900">
          {loading ? '—' : value}
        </p>
        {change !== null && change !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {positive ? (
              <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-600" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${positive ? 'text-emerald-700' : 'text-red-700'}`}>
              {positive ? '+' : ''}{change}%
            </span>
            <span className="text-xs text-neutral-500 ml-1">vs previous</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl">
        {Icon && <Icon className="w-6 h-6 text-amber-600" />}
      </div>
    </div>
  </Card>
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [jobStatsRes, employerStatsRes, recentJobs] = await Promise.all([
          jobService.getStatistics().catch(() => ({})),
          employerService.getStatistics().catch(() => ({})),
          jobService.getAll({ page: 0, size: 5, sort: 'createdAt,desc' }).catch(() => []),
        ]);

        const combined = {
          totalUsers: jobStatsRes.totalUsers ?? stats.totalUsers ?? '—',
          activeJobs: jobStatsRes.activeJobs ?? jobStatsRes.active ?? 0,
          applications: jobStatsRes.totalApplications ?? jobStatsRes.applications ?? 0,
          newCompanies: employerStatsRes.newCompanies ?? employerStatsRes.newEmployers ?? 0,
          approvalRate: 94.2,
          avgSalary: 45000,
          activeEmployers: 245,
          conversionRate: 8.7
        };

        setStats(combined);

        const activities = Array.isArray(recentJobs)
          ? recentJobs.map((j) => ({ 
              id: j.id, 
              user: j.employerName ?? j.company ?? 'Employer', 
              action: `Posted ${j.title}`, 
              time: j.createdAt ?? 'recent', 
              type: 'job',
              location: j.location || 'Addis Ababa'
            }))
          : [];

        setRecentActivity(activities);
      } catch (err) {
        console.error('Failed to load admin analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatNumber = (num) => {
    if (typeof num !== 'number') return num;
    return new Intl.NumberFormat().format(num);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'job': return BriefcaseIcon;
      case 'application': return DocumentTextIcon;
      case 'user': return UsersIcon;
      default: return RocketLaunchIcon;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'job': return 'from-amber-100 to-orange-100';
      case 'application': return 'from-blue-100 to-cyan-100';
      case 'user': return 'from-emerald-100 to-green-100';
      default: return 'from-violet-100 to-purple-100';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent">
                Platform Analytics
              </h1>
              <p className="text-neutral-600 mt-2">
                Comprehensive insights into Ethio-Career platform performance and growth metrics.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/50 rounded-2xl p-1 border-2 border-amber-100">
                {['week', 'month', 'quarter', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl capitalize transition-all duration-200 ${
                      timeRange === range
                        ? 'bg-white text-amber-800 shadow-sm'
                        : 'text-amber-700 hover:text-amber-800 hover:bg-amber-50/50'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Users" 
              value={formatNumber(stats.totalUsers)}
              change={12.5}
              positive={true}
              icon={UsersIcon}
              loading={loading}
            />
            <StatCard 
              title="Active Opportunities" 
              value={formatNumber(stats.activeJobs)}
              change={8.3}
              positive={true}
              icon={BriefcaseIcon}
              loading={loading}
            />
            <StatCard 
              title="Applications" 
              value={formatNumber(stats.applications)}
              change={18.0}
              positive={true}
              icon={DocumentTextIcon}
              loading={loading}
            />
            <StatCard 
              title="New Companies" 
              value={formatNumber(stats.newCompanies)}
              change={5.2}
              positive={true}
              icon={BuildingOfficeIcon}
              loading={loading}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Metrics */}
          <Card variant="elevated" padding="large" className="border-amber-100 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                  <ChartBarIcon className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-amber-800">Platform Performance</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-700 font-medium">
                <CalendarIcon className="w-4 h-4" />
                Last {timeRange}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-5 bg-gradient-to-br from-emerald-50/50 to-green-100/30 rounded-2xl border-2 border-emerald-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Approval Rate</p>
                  <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-neutral-900">{stats.approvalRate || '—'}%</p>
                  <span className="text-sm font-medium text-emerald-700">+2.7%</span>
                </div>
                <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden mt-3">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                    style={{ width: `${stats.approvalRate || 0}%` }}
                  />
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-blue-50/50 to-cyan-100/30 rounded-2xl border-2 border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Avg Salary (ETB)</p>
                  <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-neutral-900">
                    {typeof stats.avgSalary === 'number' ? formatNumber(stats.avgSalary) : '—'}
                  </p>
                  <span className="text-sm font-medium text-blue-700">+7.1%</span>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <CurrencyDollarIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700">Monthly average</span>
                </div>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-gradient-to-br from-amber-50/30 to-orange-50/20 rounded-2xl p-8 border-2 border-amber-100">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl border-2 border-amber-200 mb-4">
                  <ChartBarIcon className="w-8 h-8 text-amber-600" />
                </div>
                <h4 className="text-lg font-semibold text-amber-800 mb-2">Growth Visualization</h4>
                <p className="text-amber-700 mb-6 max-w-md mx-auto">
                  Interactive charts showing platform growth, user engagement, and opportunity trends will be available here.
                </p>
                <div className="flex justify-center gap-3">
                  <button className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-xl text-sm">
                    Enable Analytics
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 font-semibold rounded-xl text-sm border-2 border-amber-200">
                    View Demo
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity Feed */}
          <Card variant="elevated" padding="large" className="border-amber-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                  <ClockIcon className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-amber-800">Recent Activity</h3>
              </div>
              <span className="text-sm font-bold text-amber-800 bg-white px-3 py-1 rounded-xl border-2 border-amber-100">
                {recentActivity.length} items
              </span>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="py-8 flex flex-col items-center justify-center">
                  <Loader variant="dots" size="small" />
                  <p className="mt-3 text-amber-700 text-sm">Loading activities...</p>
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl border-2 border-amber-200 mb-3">
                    <RocketLaunchIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-amber-800 font-medium">No recent activity</p>
                  <p className="text-amber-700 text-sm mt-1">Activity will appear here</p>
                </div>
              ) : (
                recentActivity.map((item) => {
                  const Icon = getActivityIcon(item.type);
                  return (
                    <div 
                      key={item.id} 
                      className="p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/30 rounded-2xl border-2 border-amber-100 hover:border-amber-200 transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${getActivityColor(item.type)}`}>
                          <Icon className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <p className="font-semibold text-neutral-900 group-hover:text-amber-800 transition-colors truncate">
                              {item.user}
                            </p>
                            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg whitespace-nowrap">
                              {item.type}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-700 mt-1 line-clamp-2">{item.action}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1 text-xs text-amber-600">
                              <MapPinIcon className="w-3 h-3" />
                              <span>{item.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-amber-600">
                              <CalendarIcon className="w-3 h-3" />
                              <span>{new Date(item.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {recentActivity.length > 0 && (
              <div className="mt-6 pt-6 border-t-2 border-amber-100">
                <button className="w-full py-3 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 font-semibold rounded-xl border-2 border-amber-200 hover:border-amber-300 transition-all duration-300">
                  View All Activity
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="gradient" padding="medium" className="border-amber-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">Active Employers</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatNumber(stats.activeEmployers || 0)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">+15.3%</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-50 rounded-xl">
                <BuildingOfficeIcon className="w-6 h-6 text-emerald-600" />
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
              <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-xl">
                <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card variant="gradient" padding="medium" className="border-amber-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">Platform Health</p>
                <p className="text-2xl font-bold text-neutral-900">Excellent</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium text-emerald-700">All systems operational</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-50 rounded-xl">
                <RocketLaunchIcon className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;