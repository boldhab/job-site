import React, { useState, useEffect } from 'react';
import { 
  MapPinIcon, 
  BriefcaseIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { aiService } from '../../../../services/ai.service';
import { SparklesIcon } from '@heroicons/react/24/outline';

// Job Card component
const JobCard = ({ job }) => {
  const [matchScore, setMatchScore] = useState(null);

  useEffect(() => {
    const fetchMatchScore = async () => {
      try {
        const res = await aiService.getMatchScore(job.id);
        setMatchScore(res.matchScore);
      } catch (err) {
        console.error('Failed to fetch match score', err);
      }
    };
    fetchMatchScore();
  }, [job.id]);
  // Text gradient class
  const titleGradient = "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent";
  const accentGradient = "bg-gradient-to-r from-amber-500 to-amber-600";

  // Determine job type color
  const getTypeColor = (type) => {
    const typeLower = type?.toLowerCase() || '';
    if (typeLower.includes('remote')) return 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200/50';
    if (typeLower.includes('full')) return 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200/50';
    if (typeLower.includes('part')) return 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border border-purple-200/50';
    if (typeLower.includes('contract')) return 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200/50';
    return 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200/50';
  };

  // Format salary display
  const formatSalary = (salary) => {
    if (!salary) return 'Competitive Salary';
    if (typeof salary === 'string') return salary;
    if (typeof salary === 'number') return `$${salary.toLocaleString()}/year`;
    return 'Competitive Salary';
  };

  // Calculate time ago
  const getTimeAgo = (date) => {
    if (!date) return 'Recently';
    const now = new Date();
    const posted = new Date(date);
    const diffDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Format deadline date
  const formatDeadline = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 border-2 border-amber-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1 group p-0">
      {/* Job Header */}
      <div className="p-6 md:p-8 border-b border-amber-200/50">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              {/* Company Logo */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center flex-shrink-0 relative">
                <BuildingOfficeIcon className="w-7 h-7 text-amber-600" />
                {matchScore !== null && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg shadow-lg border-2 border-white flex items-center gap-0.5 animate-pulse">
                    <SparklesIcon className="w-2.5 h-2.5" />
                    {matchScore}%
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${titleGradient} group-hover:text-amber-700 transition-colors line-clamp-2`}>
                  {job.title}
                </h3>
                <div className="flex items-center mt-2">
                  <BuildingOfficeIcon className="w-4 h-4 text-amber-600 mr-2" />
                  <span className="text-amber-800 font-medium">{job.company}</span>
                </div>
              </div>
            </div>

            {/* Job Type Badge */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold ${getTypeColor(job.type)}`}>
                <BriefcaseIcon className="w-4 h-4 mr-2" />
                {job.type || 'Full-time'}
              </span>
              {job.isRemote && (
                <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200/50">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  Remote
                </span>
              )}
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center text-amber-800/80">
                <MapPinIcon className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" />
                <span className="text-sm truncate">{job.location || 'Remote'}</span>
              </div>
              <div className="flex items-center text-amber-800/80">
                <CurrencyDollarIcon className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" />
                <span className="text-sm">{formatSalary(job.salary)}</span>
              </div>
              {job.deadline && (
                <div className="flex items-center text-rose-600 mt-2 col-span-2">
                  <CalendarDaysIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm font-semibold">Deadline: {formatDeadline(job.deadline)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Posted Time */}
          <div className="flex flex-col items-end flex-shrink-0">
            <div className="flex items-center px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-100/50 to-amber-50/30 text-amber-700/80 text-xs font-medium border border-amber-200/30">
              <ClockIcon className="w-3 h-3 mr-1.5" />
              {getTimeAgo(job.postedAt || job.createdAt)}
            </div>
          </div>
        </div>

        {/* Job Description Preview */}
        {job.description && (
          <div className="mt-6">
            <p className="text-amber-800/70 text-sm line-clamp-3 leading-relaxed">
              {typeof job.description === 'string' 
                ? job.description.length > 150 
                  ? `${job.description.substring(0, 150)}...`
                  : job.description
                : 'Exciting opportunity with a great team...'
              }
            </p>
          </div>
        )}
      </div>

      {/* Skills/Requirements */}
      {job.skills && job.skills.length > 0 && (
        <div className="px-6 md:px-8 py-4 bg-gradient-to-r from-amber-50/20 to-amber-100/5 border-b border-amber-200/30">
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 4).map((skill, index) => (
              <span 
                key={index} 
                className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-100/30 to-amber-50/20 text-amber-700 text-xs font-medium border border-amber-200/30"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-100/50 to-amber-50/30 text-amber-600 text-xs font-medium border border-amber-200/30">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="px-6 md:px-8 py-4 bg-gradient-to-r from-amber-50/10 to-amber-100/5">
        <div className="flex items-center justify-between">
          <div className="text-sm text-amber-700/70">
            <span className="font-medium text-amber-800">{job.applicants || 0}</span> applicants
          </div>
          <Link 
            to={`/job-seeker/jobs/${job.id}`}
            className="inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium shadow-lg hover:shadow-2xl border-0 transition-all group-hover:scale-105"
          >
            View Details
            <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-400/5 to-transparent rounded-full -translate-y-4 translate-x-4"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-amber-500/3 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
    </div>
  );
};

// Featured Job Card Variant
const FeaturedJobCard = ({ job }) => {
  const titleGradient = "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent";

  return (
    <div className="relative bg-gradient-to-br from-amber-50/40 via-white to-amber-100/20 border-2 border-amber-300/50 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden hover:-translate-y-1 group p-0">
      {/* Featured Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className="inline-flex items-center px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shadow-lg">
          <StarIcon className="w-3 h-3 mr-1.5" />
          Featured
        </span>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center flex-shrink-0">
            <BuildingOfficeIcon className="w-8 h-8 text-amber-600" />
          </div>
          
          <div className="flex-1">
            <h3 className={`text-xl md:text-2xl font-bold ${titleGradient} mb-2`}>
              {job.title}
            </h3>
            <div className="flex items-center text-amber-800 font-medium">
              <BuildingOfficeIcon className="w-4 h-4 mr-2" />
              {job.company}
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <MapPinIcon className="w-5 h-5 text-amber-600 mr-3" />
            <span className="text-amber-800">{job.location}</span>
          </div>
          <div className="flex items-center">
            <CurrencyDollarIcon className="w-5 h-5 text-amber-600 mr-3" />
            <span className="text-amber-800 font-semibold">
              {job.salary || 'Competitive'}
            </span>
          </div>
          {job.deadline && (
            <div className="col-span-2 flex items-center text-rose-600">
              <CalendarDaysIcon className="w-5 h-5 mr-3" />
              <span className="font-bold">Apply by: {formatDeadline(job.deadline)}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-amber-800/70 mb-8 line-clamp-3">
          {job.description?.substring(0, 120)}...
        </p>

        {/* Apply Button */}
        <Link 
          to={`/job-seeker/jobs/${job.id}`}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl border-0 transition-all flex items-center justify-center group-hover:scale-105"
        >
          Apply Now
          <ArrowRightIcon className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-amber-600/5 pointer-events-none"></div>
    </div>
  );
};

// Compact Job Card Variant
const CompactJobCard = ({ job }) => {
  return (
    <div className="bg-gradient-to-br from-white to-amber-50/30 border-2 border-amber-200/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-amber-300 p-4 group">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center flex-shrink-0">
          <BriefcaseIcon className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-amber-900 truncate">{job.title}</h4>
          <div className="flex items-center text-sm text-amber-700/80 mt-1">
            <BuildingOfficeIcon className="w-3 h-3 mr-1" />
            <span className="truncate">{job.company}</span>
          </div>
        </div>
        <ArrowRightIcon className="w-5 h-5 text-amber-500 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

// Helper icon component
const StarIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default JobCard;
export { FeaturedJobCard, CompactJobCard };