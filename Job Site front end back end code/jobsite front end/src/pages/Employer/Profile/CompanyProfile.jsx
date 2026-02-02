import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Button from '../../../components/common/Button';
import { employerService } from '../../../services/employer.service';
import { 
  BuildingOfficeIcon, 
  GlobeAltIcon, 
  MapPinIcon, 
  UsersIcon, 
  CalendarIcon,
  PencilSquareIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await employerService.getProfile();
        setCompany(data);
      } catch (err) {
        setError(err?.message || 'Failed to load company profile');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  // Text gradient class
  const titleGradient = "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent";
  const accentGradient = "bg-gradient-to-r from-amber-500 to-amber-600";

  return (
    <DashboardLayout>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-amber-700 font-medium">Loading company profile…</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-gradient-to-br from-amber-50/80 to-amber-100/50 p-8 rounded-3xl border-2 border-amber-300 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-amber-900 mb-4">Unable to Load Profile</h3>
          <p className="text-amber-700/80 mb-8 max-w-md mx-auto">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg px-6 py-3 transition-all"
          >
            Try Again
          </Button>
        </div>
      ) : (
      <>
      {/* Banner Section */}
      <div className="relative mb-12 md:mb-16 overflow-hidden rounded-3xl">
        {/* Banner with gradient */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-amber-800/20"></div>
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        {/* Profile Header */}
        <div className="absolute -bottom-12 left-6 md:left-8 flex items-end">
          <div className="h-24 w-24 md:h-32 md:w-32 bg-gradient-to-br from-amber-400 to-amber-600 p-1.5 rounded-3xl shadow-2xl">
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shadow-inner">
                <span className="text-amber-800 font-bold text-3xl md:text-4xl">
                  {company.logo || (company.companyName ? company.companyName.charAt(0) : 'C')}
                </span>
              </div>
            </div>
          </div>
          <div className="mb-6 ml-6">
            <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">{company.companyName || 'Company Profile'}</h1>
            <div className="flex items-center mt-2">
              <BuildingOfficeIcon className="w-5 h-5 text-amber-200 mr-2" />
              <p className="text-amber-100 font-medium text-lg">{company.industry}</p>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="absolute top-6 right-6">
          <Link to="/employer/settings">
            <Button 
              variant="secondary" 
              size="small"
              className="rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-white/30 text-amber-700 hover:bg-white hover:border-amber-300 hover:shadow-lg px-6 py-2.5 transition-all"
            >
              <PencilSquareIcon className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-20 md:mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Us Card */}
          <div className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 p-6 md:p-8 rounded-3xl border-2 border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-4">
                <SparklesIcon className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className={`text-2xl font-bold ${titleGradient}`}>About Us</h2>
            </div>
            <p className="text-amber-800/80 leading-relaxed text-lg">
              {company.description || "We're a dynamic team passionate about innovation and creating meaningful impact in our industry."}
            </p>
          </div>

          {/* Company Culture Card */}
          <div className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 p-6 md:p-8 rounded-3xl border-2 border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-4">
                <UsersIcon className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className={`text-2xl font-bold ${titleGradient}`}>Company Culture</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Innovation', 'Collaboration', 'Growth Mindset', 'Work-Life Balance', 'Diversity & Inclusion', 'Customer Focus'].map((item, index) => (
                <div 
                  key={item} 
                  className="bg-gradient-to-br from-amber-50/50 to-amber-100/30 p-4 rounded-2xl border border-amber-200/50 hover:border-amber-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-4">
                      <span className="text-amber-700 font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-900">{item}</h4>
                      <div className="flex mt-2">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i} 
                            className="w-2 h-2 rounded-full bg-amber-400/50 mr-1"
                            style={{ opacity: i < (index % 5) + 1 ? 1 : 0.3 }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Company Details Card */}
          <div className="bg-gradient-to-br from-white via-amber-50/30 to-amber-100/10 p-6 md:p-8 rounded-3xl border-2 border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center mr-4">
                <BuildingOfficeIcon className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className={`text-xl font-bold ${titleGradient}`}>Company Details</h2>
            </div>
            
            <ul className="space-y-6">
              <li className="flex items-center justify-between border-b border-amber-200/50 pb-4">
                <div className="flex items-center">
                  <GlobeAltIcon className="w-5 h-5 text-amber-600 mr-3" />
                  <span className="text-amber-700/80">Website</span>
                </div>
                <a 
                  href={company.website} 
                  className="text-amber-700 font-semibold hover:text-amber-800 hover:underline truncate max-w-[140px] md:max-w-[160px]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company.website}
                </a>
              </li>
              
              <li className="flex items-center justify-between border-b border-amber-200/50 pb-4">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="w-5 h-5 text-amber-600 mr-3" />
                  <span className="text-amber-700/80">Industry</span>
                </div>
                <span className="text-amber-900 font-bold">{company.industry}</span>
              </li>
              
              <li className="flex items-center justify-between border-b border-amber-200/50 pb-4">
                <div className="flex items-center">
                  <UsersIcon className="w-5 h-5 text-amber-600 mr-3" />
                  <span className="text-amber-700/80">Company Size</span>
                </div>
                <span className="text-amber-900 font-bold">{company.companySize}</span>
              </li>
              
              <li className="flex items-center justify-between border-b border-amber-200/50 pb-4">
                <div className="flex items-center">
                  <CalendarIcon className="w-5 h-5 text-amber-600 mr-3" />
                  <span className="text-amber-700/80">Founded</span>
                </div>
                <span className="text-amber-900 font-bold">{company.founded}</span>
              </li>
              
              <li className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <MapPinIcon className="w-5 h-5 text-amber-600 mr-3" />
                  <span className="text-amber-700/80">Location</span>
                </div>
                <span className="text-amber-900 font-bold text-right">{company.location}</span>
              </li>
            </ul>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-amber-50/50 to-amber-100/30 border-2 border-amber-200/50 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-amber-900 mb-6">At a Glance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-amber-200/30">
                <span className="text-amber-700/80">Active Jobs</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                  {company.activeJobs || 12}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-amber-200/30">
                <span className="text-amber-700/80">Team Members</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                  {company.teamSize || 50}+
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-amber-200/30">
                <span className="text-amber-700/80">Avg. Response Time</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                  {company.responseTime || '24h'}
                </span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border-2 border-amber-300/30 rounded-3xl p-6 text-center">
            <h4 className="font-bold text-amber-900 mb-4">Looking for Talent?</h4>
            <p className="text-amber-700/80 text-sm mb-6">Post a job and reach qualified candidates</p>
            <Link to="/employer/jobs/post">
              <Button 
                variant="primary"
                className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 w-full py-3 transition-all"
              >
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </div>
      </>
      )}
    </DashboardLayout>
  );
};

export default CompanyProfile;