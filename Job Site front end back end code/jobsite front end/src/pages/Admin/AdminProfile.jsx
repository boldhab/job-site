import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import api from '../../api/axios.config';
import { 
  UserCircleIcon, 
  MapPinIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  StarIcon,
  RocketLaunchIcon,
  KeyIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalApprovals: 0,
    totalRejections: 0,
    recentActivity: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, logsRes] = await Promise.all([
          api.get('/profile'),
          api.get('/admin/moderation-logs')
        ]);
        
        setAdmin(profileRes.data);
        const logsData = Array.isArray(logsRes.data) ? logsRes.data : [];
        setLogs(logsData);
        
        // Calculate stats
        const approvals = logsData.filter(log => log.action === 'APPROVED').length;
        const rejections = logsData.filter(log => log.action === 'REJECTED').length;
        setStats({
          totalApprovals: approvals,
          totalRejections: rejections,
          recentActivity: logsData.length
        });
      } catch (err) {
        console.error('Failed to load profile', err);
        setError(err?.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="py-12 flex flex-col items-center justify-center">
        <Loader variant="brand" size="large" />
        <p className="mt-4 text-amber-700 font-medium">Loading admin profile...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent">
                Admin Profile
              </h1>
              <p className="text-neutral-600 mt-2">
                System administrator profile and moderation activity overview.
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-100">
              <KeyIcon className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800 uppercase tracking-wider">
                System Administrator
              </span>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="gradient" padding="medium" className="border-amber-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-1">Total Approvals</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalApprovals}</p>
                  <p className="text-xs text-amber-600 mt-2">Opportunities approved</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-50 rounded-xl">
                  <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </Card>

            <Card variant="gradient" padding="medium" className="border-amber-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-1">Total Rejections</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalRejections}</p>
                  <p className="text-xs text-amber-600 mt-2">Opportunities rejected</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-red-100 to-red-50 rounded-xl">
                  <XCircleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </Card>

            <Card variant="gradient" padding="medium" className="border-amber-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-1">Recent Activity</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.recentActivity}</p>
                  <p className="text-xs text-amber-600 mt-2">Actions in last 30 days</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-50 rounded-xl">
                  <ArrowPathIcon className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card variant="elevated" padding="large" className="border-amber-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl border-4 border-white shadow-xl mb-6">
                  <span className="text-4xl font-bold text-white">
                    {admin?.name?.split(' ').map(n => n[0]).join('') || 'A'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent">
                  {admin?.name || 'Administrator'}
                </h2>
                <p className="text-amber-700 font-medium text-sm mt-2">Ethio-Career System Administrator</p>
              </div>

              <div className="space-y-5 border-t-2 border-amber-100 pt-6">
                <div className="flex items-center text-amber-800 group">
                  <div className="p-2 bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl mr-3 group-hover:scale-110 transition-transform">
                    <EnvelopeIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{admin?.email}</p>
                    <p className="text-xs text-amber-600">Primary Email</p>
                  </div>
                </div>

                <div className="flex items-center text-amber-800 group">
                  <div className="p-2 bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl mr-3 group-hover:scale-110 transition-transform">
                    <ShieldCheckIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Full System Access</p>
                    <p className="text-xs text-amber-600">All permissions granted</p>
                  </div>
                </div>

                <div className="flex items-center text-amber-800 group">
                  <div className="p-2 bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl mr-3 group-hover:scale-110 transition-transform">
                    <CalendarIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Active since Dec 2025</p>
                    <p className="text-xs text-amber-600">Platform administrator</p>
                  </div>
                </div>
              </div>

              {/* Admin Badge */}
              <div className="mt-8 pt-6 border-t-2 border-amber-100">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border-2 border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl">
                      <StarIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-amber-800">Verified Administrator</p>
                      <p className="text-xs text-amber-700">Full access to all system features</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Activity Logs */}
          <div className="lg:col-span-2">
            <Card variant="elevated" padding="none" className="border-amber-100 h-full">
              <div className="px-6 py-4 border-b-2 border-amber-100 bg-gradient-to-r from-amber-50/80 to-orange-50/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                      <ArrowPathIcon className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold text-amber-800">Recent Activity Logs</h3>
                  </div>
                  <span className="text-sm font-bold text-amber-800 bg-white px-3 py-1 rounded-xl border-2 border-amber-100">
                    {logs.length} Actions
                  </span>
                </div>
              </div>
              
              <div className="divide-y-2 divide-amber-100 max-h-[600px] overflow-y-auto">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <div 
                      key={log.id} 
                      className="p-5 hover:bg-gradient-to-r hover:from-amber-50/30 hover:to-orange-50/20 transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 p-2.5 rounded-xl ${
                          log.action === 'APPROVED' 
                            ? 'bg-gradient-to-br from-emerald-100 to-green-50 border-2 border-emerald-200' 
                            : 'bg-gradient-to-br from-red-100 to-red-50 border-2 border-red-200'
                        }`}>
                          {log.action === 'APPROVED' ? 
                            <CheckCircleIcon className="w-5 h-5 text-emerald-600" /> : 
                            <XCircleIcon className="w-5 h-5 text-red-600" />
                          }
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-base font-semibold text-neutral-900 group-hover:text-amber-800 transition-colors">
                              {log.action === 'APPROVED' ? 'Approved ' : 'Rejected '} 
                              <span className="font-bold">opportunity #{log.jobId || log.job?.id}</span>
                            </p>
                            <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                              log.action === 'APPROVED'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {log.action}
                            </span>
                          </div>
                          
                          {log.reason && (
                            <div className="mt-2 p-3 bg-gradient-to-r from-amber-50/50 to-orange-50/30 rounded-xl border border-amber-100">
                              <p className="text-sm text-amber-800 font-medium">Reason:</p>
                              <p className="text-sm text-neutral-700 mt-1">{log.reason}</p>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mt-4">
                            <ClockIcon className="w-4 h-4 text-amber-500" />
                            <p className="text-xs text-amber-600 font-medium">
                              {new Date(log.createdAt).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl border-2 border-amber-200 mb-4">
                      <ArrowPathIcon className="w-8 h-8 text-amber-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-amber-800 mb-2">No Activity Yet</h4>
                    <p className="text-amber-700 max-w-md mx-auto">
                      Start moderating opportunities to see activity logs appear here.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfile;