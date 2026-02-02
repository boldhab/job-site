import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Button from '../../../components/common/Button';
import { employerService } from '../../../services/employer.service';

// Enhanced Stat Card with amber palette
const StatCard = ({ title, value, subtext, accentColor = "amber" }) => {
  // Amber/Gold palette gradient for text
  const gradientTextClass = "bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 bg-clip-text text-transparent";
  
  return (
    <div className="bg-gradient-to-br from-white to-amber-50/50 p-6 rounded-3xl border-2 border-amber-200/50 shadow-lg hover:shadow-2xl transition-all duration-300">
      <h3 className="text-sm font-medium text-amber-800/80">{title}</h3>
      <div className="mt-4">
        <p className={`text-3xl font-bold ${gradientTextClass}`}>{value}</p>
        {subtext && (
          <p className="text-xs text-amber-700/70 mt-2 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
            {subtext}
          </p>
        )}
      </div>
      {/* Decorative amber accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-400/10 to-amber-600/5 rounded-full -translate-y-4 translate-x-4"></div>
    </div>
  );
};

const JobAnalytics = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await employerService.getAnalytics();
        setJobs(data?.jobs || []);
        setStats(data?.stats || { views: 0, applications: 0, conversionRate: '0%', rejected: 0 });
        setPipeline(data?.pipeline || []);
        setSelectedJob((data?.jobs && data.jobs[0]?.id) || null);
      } catch (err) {
        setError(err?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  // Amber color variations for pipeline
  const pipelineColors = [
    "bg-gradient-to-r from-amber-400 to-amber-500",
    "bg-gradient-to-r from-amber-500 to-amber-600",
    "bg-gradient-to-r from-amber-600 to-amber-700",
    "bg-gradient-to-r from-amber-700 to-amber-800",
    "bg-gradient-to-r from-amber-800 to-amber-900"
  ];

  // Text gradient class
  const titleGradient = "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent";

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12">
        <div className="mb-6 md:mb-0">
          <h1 className={`text-2xl lg:text-3xl font-bold ${titleGradient}`}>Job Analytics</h1>
          <p className="text-amber-800/70 mt-2">Track performance of your job postings</p>
        </div>
        <div className="mt-0">
          <select 
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="w-full md:w-auto min-w-[240px] px-4 py-3 rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
          >
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 lg:mb-12">
        <StatCard 
          title="Total Views" 
          value={stats?.views || 0} 
          subtext="+12% from last week" 
          accentColor="amber"
        />
        <StatCard 
          title="Total Applications" 
          value={stats?.applications || 0} 
          subtext="2 avg. per day" 
          accentColor="amber"
        />
        <StatCard 
          title="Conversion Rate" 
          value={stats?.conversionRate || '0%'} 
          subtext="Views to Application" 
          accentColor="amber"
        />
        <StatCard 
          title="Rejected" 
          value={stats?.rejected || 0} 
          subtext="Automated filters" 
          accentColor="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recruitment Pipeline Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white via-amber-50/30 to-amber-100/20 p-6 md:p-8 rounded-3xl border-2 border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center mb-8">
            <div className="w-2 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mr-4"></div>
            <h3 className="text-xl font-bold text-amber-900">Recruitment Funnel</h3>
          </div>
          
          <div className="space-y-8">
            {pipeline.map((item, index) => (
              <div key={item.stage} className="relative">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-2xl bg-amber-500/10 text-amber-700 font-bold text-sm mr-4">
                      {index + 1}
                    </span>
                    <span className="text-base font-semibold text-amber-800">{item.stage}</span>
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                    {item.count}
                  </span>
                </div>
                <div className="w-full bg-amber-100/50 rounded-full h-4 overflow-hidden border border-amber-200">
                  <div 
                    className={`h-4 rounded-full ${pipelineColors[index % pipelineColors.length]}`} 
                    style={{ width: `${Math.min((item.count / 86) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-right mt-2">
                  <span className="text-xs font-medium text-amber-600/80">
                    {Math.round((item.count / 86) * 100)}% of total
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Decorative background element */}
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-amber-600/5 rounded-full blur-xl"></div>
        </div>

        {/* Action Card with glass effect */}
        <div className="relative bg-gradient-to-br from-white/90 via-amber-50/40 to-amber-100/20 backdrop-blur-sm p-6 md:p-8 rounded-3xl border-2 border-amber-300/30 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-300/50 mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-3"></span>
              <span className="text-sm font-semibold text-amber-700">Performance Tip</span>
            </div>
            
            <h3 className="text-xl font-bold text-amber-900 mb-6">
              Improve Your Results
            </h3>
            
            <p className="text-amber-800/80 mb-8 leading-relaxed">
              This job posting is performing better than{' '}
              <span className="font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                75%
              </span>{' '}
              of similar roles. To get more qualified applicants, consider promoting it.
            </p>
            
            <div className="space-y-4">
              <Button 
                variant="outline" 
                fullWidth
                className="rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg transition-all"
              >
                Edit Job Details
              </Button>
              <Button 
                variant="primary" 
                fullWidth
                className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 transition-all"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Promote Job ($49)
                </div>
              </Button>
            </div>
          </div>
          
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full -translate-x-8 -translate-y-8"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-500/5 to-transparent rounded-full translate-x-8 translate-y-8"></div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-amber-50/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-amber-700 font-medium">Loading analytics...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-amber-100/50 border-2 border-amber-300">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-amber-900">Error Loading Data</h4>
              <p className="text-amber-700/80">{error}</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default JobAnalytics;