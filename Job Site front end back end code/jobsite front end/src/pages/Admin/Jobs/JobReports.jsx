import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/common/Card';
import { ChartBarIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const JobReports = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent">
                Opportunity Analytics
              </h1>
              <p className="text-neutral-600 mt-2">
                Comprehensive insights and analytics for Ethiopian job opportunities on Ethio-Career.
              </p>
            </div>
            <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/50 rounded-2xl p-1 border-2 border-amber-100">
              <button className="px-4 py-2 text-sm font-semibold text-amber-700 hover:text-amber-800 hover:bg-amber-50/50 rounded-xl transition-all duration-200 flex items-center gap-2">
                <DocumentArrowDownIcon className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Summary Stats Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <Card 
                key={item} 
                variant="gradient" 
                padding="medium" 
                className="border-amber-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-800 mb-1">Loading...</p>
                    <div className="h-8 bg-amber-100/50 rounded-xl w-24"></div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl">
                    <div className="w-6 h-6 bg-amber-200 rounded-lg"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content - Empty State */}
        <Card 
          variant="gradient" 
          padding="large" 
          className="border-amber-100 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl border-2 border-amber-200 mb-6">
            <ChartBarIcon className="w-10 h-10 text-amber-600" />
          </div>
          
          <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent mb-3">
            Analytics Dashboard Coming Soon
          </h3>
          
          <p className="text-lg text-amber-700 max-w-2xl mx-auto mb-8 leading-relaxed">
            We're building a comprehensive analytics dashboard to provide detailed insights 
            into Ethiopian job opportunities, application trends, and platform performance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl p-5 border-2 border-amber-100">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl border-2 border-amber-200 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-amber-700">📊</span>
              </div>
              <h4 className="font-semibold text-amber-800 mb-2">Trend Analytics</h4>
              <p className="text-sm text-amber-700/90">
                Track growth patterns and application trends over time
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl p-5 border-2 border-amber-100">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl border-2 border-amber-200 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-amber-700">📍</span>
              </div>
              <h4 className="font-semibold text-amber-800 mb-2">Regional Insights</h4>
              <p className="text-sm text-amber-700/90">
                Analyze opportunity distribution across Ethiopian regions
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl p-5 border-2 border-amber-100">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl border-2 border-amber-200 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-amber-700">📈</span>
              </div>
              <h4 className="font-semibold text-amber-800 mb-2">Performance Metrics</h4>
              <p className="text-sm text-amber-700/90">
                Monitor platform health and opportunity success rates
              </p>
            </div>
          </div>

          {/* Action Section */}
          <div className="mt-10 pt-8 border-t-2 border-amber-100">
            <p className="text-amber-700 font-medium mb-6">
              Check back soon for comprehensive analytics!
            </p>
            <div className="flex items-center justify-center gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-2xl border-0 shadow-lg hover:shadow-xl hover:shadow-amber-500/25 hover:-translate-y-0.5 transition-all duration-300">
                Notify Me
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 font-semibold rounded-2xl border-2 border-amber-200 hover:border-amber-300 transition-all duration-300">
                View Demo
              </button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JobReports;