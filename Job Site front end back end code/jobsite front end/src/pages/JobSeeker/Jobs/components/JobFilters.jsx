import React, { useState } from 'react';
import {
  FunnelIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ClockIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  CheckIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

// Job Filters component
const JobFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    jobType: initialFilters.jobType || [],
    location: initialFilters.location || '',
    salaryRange: initialFilters.salaryRange || { min: '', max: '' },
    experienceLevel: initialFilters.experienceLevel || [],
    remote: initialFilters.remote || false,
    postedWithin: initialFilters.postedWithin || '',
    ...initialFilters
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // Filter options
  const jobTypes = [
    { id: 'full-time', label: 'Full Time', icon: BriefcaseIcon },
    { id: 'part-time', label: 'Part Time', icon: ClockIcon },
    { id: 'contract', label: 'Contract', icon: DocumentIcon },
    { id: 'internship', label: 'Internship', icon: AcademicCapIcon },
    { id: 'remote', label: 'Remote', icon: MapPinIcon },
  ];

  const experienceLevels = [
    { id: 'entry', label: 'Entry Level' },
    { id: 'mid', label: 'Mid Level' },
    { id: 'senior', label: 'Senior Level' },
    { id: 'lead', label: 'Lead / Manager' },
  ];

  const timeOptions = [
    { id: '1', label: 'Last 24 hours' },
    { id: '3', label: 'Last 3 days' },
    { id: '7', label: 'Last week' },
    { id: '30', label: 'Last month' },
  ];

  const salaryRanges = [
    { id: '0-50', label: 'Under $50k' },
    { id: '50-100', label: '$50k - $100k' },
    { id: '100-150', label: '$100k - $150k' },
    { id: '150-200', label: '$150k - $200k' },
    { id: '200+', label: '$200k+' },
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleJobTypeToggle = (typeId) => {
    const currentTypes = filters.jobType || [];
    const newTypes = currentTypes.includes(typeId)
      ? currentTypes.filter(t => t !== typeId)
      : [...currentTypes, typeId];
    handleFilterChange('jobType', newTypes);
  };

  const handleExperienceToggle = (level) => {
    const currentLevels = filters.experienceLevel || [];
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter(l => l !== level)
      : [...currentLevels, level];
    handleFilterChange('experienceLevel', newLevels);
  };

  const handleSalarySelect = (range) => {
    const [min, max] = range.split('-').map(val => val === '+' ? '' : val);
    handleFilterChange('salaryRange', { min, max });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      jobType: [],
      location: '',
      salaryRange: { min: '', max: '' },
      experienceLevel: [],
      remote: false,
      postedWithin: '',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
    setActiveCategory(null);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.jobType?.length) count += filters.jobType.length;
    if (filters.location) count += 1;
    if (filters.salaryRange.min || filters.salaryRange.max) count += 1;
    if (filters.experienceLevel?.length) count += filters.experienceLevel.length;
    if (filters.remote) count += 1;
    if (filters.postedWithin) count += 1;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 border-2 border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="border-b border-amber-200/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-3">
              <FunnelIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900">Filter Jobs</h3>
              <p className="text-amber-700/70 text-sm">Narrow down your search</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <span className="px-3 py-1 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium">
                {activeFilterCount} active
              </span>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-2xl border border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 transition-all"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filter Bar (Always Visible) */}
      <div className="px-6 py-4 border-b border-amber-200/50">
        <div className="flex flex-wrap gap-3">
          {/* Job Type Quick Filters */}
          {jobTypes.map((type) => {
            const Icon = type.icon;
            const isActive = filters.jobType?.includes(type.id);
            return (
              <button
                key={type.id}
                onClick={() => handleJobTypeToggle(type.id)}
                className={`inline-flex items-center px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                    : 'bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-700 border border-amber-200/50 hover:border-amber-300 hover:shadow-md'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {type.label}
                {isActive && <CheckIcon className="w-4 h-4 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Location Filter */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-amber-900 flex items-center">
                <MapPinIcon className="w-4 h-4 mr-2 text-amber-600" />
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="City, State, or Remote"
                  className="w-full rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3 pl-11"
                />
                <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
              </div>
            </div>

            {/* Salary Filter */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-amber-900 flex items-center">
                <CurrencyDollarIcon className="w-4 h-4 mr-2 text-amber-600" />
                Salary Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={filters.salaryRange.min}
                  onChange={(e) => handleFilterChange('salaryRange', { 
                    ...filters.salaryRange, 
                    min: e.target.value 
                  })}
                  placeholder="Min"
                  className="rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3"
                />
                <input
                  type="number"
                  value={filters.salaryRange.max}
                  onChange={(e) => handleFilterChange('salaryRange', { 
                    ...filters.salaryRange, 
                    max: e.target.value 
                  })}
                  placeholder="Max"
                  className="rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {salaryRanges.map((range) => {
                  const isActive = 
                    (range.id === '200+' && !filters.salaryRange.max && filters.salaryRange.min >= 200) ||
                    (range.id.includes('-') && 
                      parseInt(range.id.split('-')[0]) === parseInt(filters.salaryRange.min) &&
                      parseInt(range.id.split('-')[1]) === parseInt(filters.salaryRange.max));
                  
                  return (
                    <button
                      key={range.id}
                      onClick={() => handleSalarySelect(range.id)}
                      className={`px-3 py-1.5 rounded-2xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                          : 'bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-700 border border-amber-200/50 hover:border-amber-300'
                      }`}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-amber-900 flex items-center">
                <AcademicCapIcon className="w-4 h-4 mr-2 text-amber-600" />
                Experience Level
              </label>
              <div className="space-y-2">
                {experienceLevels.map((level) => {
                  const isActive = filters.experienceLevel?.includes(level.id);
                  return (
                    <button
                      key={level.id}
                      onClick={() => handleExperienceToggle(level.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-amber-300'
                          : 'bg-gradient-to-br from-white to-amber-50/50 border border-amber-200/50 hover:border-amber-300'
                      }`}
                    >
                      <span className={`font-medium ${isActive ? 'text-amber-900' : 'text-amber-700'}`}>
                        {level.label}
                      </span>
                      {isActive && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                          <CheckIcon className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Posted Within */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-amber-900 flex items-center">
                <ClockIcon className="w-4 h-4 mr-2 text-amber-600" />
                Posted Within
              </label>
              <div className="relative">
                <select
                  value={filters.postedWithin}
                  onChange={(e) => handleFilterChange('postedWithin', e.target.value)}
                  className="w-full rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3 appearance-none"
                >
                  <option value="">Any time</option>
                  {timeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <ArrowDownIcon className="w-4 h-4 text-amber-500" />
                </div>
              </div>
            </div>

            {/* Remote Work */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-amber-900">
                Work Arrangement
              </label>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-white to-amber-50/50 border border-amber-200/50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-3">
                    <MapPinIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <span className="font-medium text-amber-900">Remote Only</span>
                    <p className="text-xs text-amber-700/70">Work from anywhere</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.remote}
                    onChange={(e) => handleFilterChange('remote', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-amber-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-amber-500 to-amber-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="mt-8 pt-6 border-t border-amber-200/50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-amber-900">Active Filters</h4>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-amber-700 hover:text-amber-800 hover:underline flex items-center"
                >
                  <XMarkIcon className="w-4 h-4 mr-1" />
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.jobType?.map((typeId) => {
                  const type = jobTypes.find(t => t.id === typeId);
                  return type && (
                    <span 
                      key={typeId}
                      className="inline-flex items-center px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-sm border border-amber-200/50"
                    >
                      {type.label}
                      <button
                        onClick={() => handleJobTypeToggle(typeId)}
                        className="ml-2 text-amber-600 hover:text-amber-800"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                
                {filters.location && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-sm border border-amber-200/50">
                    <MapPinIcon className="w-3 h-3 mr-1" />
                    {filters.location}
                    <button
                      onClick={() => handleFilterChange('location', '')}
                      className="ml-2 text-amber-600 hover:text-amber-800"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {filters.remote && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-sm border border-amber-200/50">
                    Remote Only
                    <button
                      onClick={() => handleFilterChange('remote', false)}
                      className="ml-2 text-amber-600 hover:text-amber-800"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg transition-all"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper icon component
const DocumentIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default JobFilters;