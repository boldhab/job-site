import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useJobs } from '../../../hooks/useJobs';
import Loader from '../../../components/common/Loader';
import Button from '../../../components/common/Button';
import JobCard from './components/JobCard';
import JobFilters from './components/JobFilters';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const useQuery = () => new URLSearchParams(useLocation().search);

const JobList = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const search = query.get('search') || '';
  const pageParam = parseInt(query.get('page') || '0', 10);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(search);
  const [filters, setFilters] = useState({
    jobType: [],
    location: '',
    salaryRange: { min: '', max: '' },
    experienceLevel: [],
    remote: false,
    postedWithin: '',
  });

  const params = useMemo(() => ({
    keyword: search || undefined,
    page: pageParam,
    size: 12,
    ...filters
  }), [search, pageParam, filters]);

  const { jobs, pagination, loading, error, refetch } = useJobs(params);

  const handlePrev = () => {
    if (pagination.page > 0) {
      const nextPage = pagination.page - 1;
      navigate(`?search=${encodeURIComponent(search)}&page=${nextPage}`);
    }
  };

  const handleNext = () => {
    if (pagination.page + 1 < pagination.totalPages) {
      const nextPage = pagination.page + 1;
      navigate(`?search=${encodeURIComponent(search)}&page=${nextPage}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`?search=${encodeURIComponent(searchInput)}&page=0`);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    navigate('?page=0');
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    navigate(`?search=${encodeURIComponent(search)}&page=0`);
  };

  const activeFilterCount = Object.values(filters).filter(val => {
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'object') return val.min || val.max;
    return Boolean(val);
  }).length;

  // Text gradient class
  const titleGradient = "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent";

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center">
              <BriefcaseIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className={`text-2xl lg:text-3xl font-bold ${titleGradient}`}>Find Your Dream Job</h1>
              <p className="text-amber-800/70 mt-2">Discover opportunities that match your skills and aspirations</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/job-seeker/dashboard')}
              className="inline-flex items-center px-6 py-3 rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg transition-all"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Home
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-6 py-3 rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg transition-all"
            >
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-amber-500" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search jobs, companies, or keywords..."
              className="w-full rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all pl-12 pr-12 py-4 text-amber-900 placeholder-amber-600/50"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <XMarkIcon className="h-5 w-5 text-amber-500 hover:text-amber-600" />
              </button>
            )}
          </div>
        </form>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-2xl p-4 border border-amber-200/50">
            <div className="flex items-center justify-between">
              <span className="text-amber-700/80 text-sm">Total Jobs</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                {pagination.totalElements || 0}
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 rounded-2xl p-4 border border-blue-200/50">
            <div className="flex items-center justify-between">
              <span className="text-blue-700/80 text-sm">Remote</span>
              <span className="text-2xl font-bold text-blue-700">
                {Math.floor(pagination.totalElements * 0.3) || 0}
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 rounded-2xl p-4 border border-emerald-200/50">
            <div className="flex items-center justify-between">
              <span className="text-emerald-700/80 text-sm">Featured</span>
              <span className="text-2xl font-bold text-emerald-700">
                {Math.floor(pagination.totalElements * 0.1) || 0}
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50/50 to-purple-100/30 rounded-2xl p-4 border border-purple-200/50">
            <div className="flex items-center justify-between">
              <span className="text-purple-700/80 text-sm">This Week</span>
              <span className="text-2xl font-bold text-purple-700">
                {Math.floor(pagination.totalElements * 0.2) || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1">
            <JobFilters 
              onFilterChange={handleFilterChange} 
              initialFilters={filters}
            />
          </div>
        )}

        {/* Jobs List */}
        <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-amber-700 font-medium">Searching for jobs...</p>
              <p className="text-amber-600/70 text-sm mt-2">Finding the best opportunities for you</p>
            </div>
          ) : error ? (
            <div className="bg-gradient-to-br from-amber-50/80 to-amber-100/50 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">Unable to Load Jobs</h3>
              <p className="text-amber-700/80 mb-8">{error}</p>
              <Button 
                onClick={refetch}
                className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 px-6 py-3 transition-all"
              >
                Try Again
              </Button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400/5 to-amber-600/5 flex items-center justify-center mx-auto mb-6">
                <DocumentTextIcon className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">No Jobs Found</h3>
              <p className="text-amber-700/80 mb-6 max-w-md mx-auto">
                {search || activeFilterCount > 0 
                  ? "We couldn't find any jobs matching your criteria. Try adjusting your search or filters."
                  : "No jobs available at the moment. Check back soon for new opportunities!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchInput('');
                    setFilters({
                      jobType: [],
                      location: '',
                      salaryRange: { min: '', max: '' },
                      experienceLevel: [],
                      remote: false,
                      postedWithin: '',
                    });
                  }}
                  className="rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg px-6 py-3 transition-all"
                >
                  Clear Search & Filters
                </Button>
                <Button 
                  onClick={() => navigate('/job-seeker/jobs')}
                  className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 px-6 py-3 transition-all"
                >
                  View Featured Jobs
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 p-4 bg-gradient-to-r from-amber-50/30 to-amber-100/10 rounded-3xl border border-amber-200/50">
                <div className="flex items-center gap-3">
                  <BuildingOfficeIcon className="w-5 h-5 text-amber-600" />
                  <span className="text-amber-900 font-medium">
                    Showing {jobs.length} of {pagination.totalElements} jobs
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <span className="text-sm text-amber-700/70">
                    Page {pagination.page + 1} of {Math.max(1, pagination.totalPages)}
                  </span>
                </div>
              </div>

              {/* Jobs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 pt-8 border-t border-amber-200/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="text-sm text-amber-700/70">
                      Showing {pagination.page * pagination.size + 1} to{' '}
                      {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
                      {pagination.totalElements} results
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        onClick={handlePrev} 
                        disabled={pagination.page === 0}
                        className="rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg px-6 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i;
                          } else if (pagination.page < 3) {
                            pageNum = i;
                          } else if (pagination.page > pagination.totalPages - 4) {
                            pageNum = pagination.totalPages - 5 + i;
                          } else {
                            pageNum = pagination.page - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => navigate(`?search=${encodeURIComponent(search)}&page=${pageNum}`)}
                              className={`w-10 h-10 rounded-2xl font-medium transition-all ${
                                pagination.page === pageNum
                                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                                  : 'bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-700 border border-amber-200/50 hover:border-amber-300 hover:shadow-md'
                              }`}
                            >
                              {pageNum + 1}
                            </button>
                          );
                        })}
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={handleNext} 
                        disabled={pagination.page + 1 >= pagination.totalPages}
                        className="rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg px-6 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Featured Jobs Banner */}
      {jobs.length > 0 && (
        <div className="mt-16 bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border-2 border-amber-300/30 rounded-3xl p-8 text-center">
          <h3 className="text-xl font-bold text-amber-900 mb-4">Looking for Premium Opportunities?</h3>
          <p className="text-amber-700/80 mb-8 max-w-2xl mx-auto">
            Explore our featured jobs with top companies and competitive benefits. These hand-picked opportunities offer exceptional growth potential.
          </p>
          <Button 
            onClick={() => navigate('/job-seeker/jobs')}
            className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 px-8 py-4 text-lg transition-all"
          >
            View Featured Jobs
          </Button>
        </div>
      )}
    </div>
  );
};

// Helper icon components
const BriefcaseIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default JobList;