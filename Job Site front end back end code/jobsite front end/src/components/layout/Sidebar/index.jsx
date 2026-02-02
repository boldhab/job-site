import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  UserCircleIcon, 
  Cog6ToothIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
  StarIcon,
  MapIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
  CheckBadgeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role; // 'employer', 'job_seeker', 'admin'

  // Determine base path based on role
  const getBasePath = (role) => {
    switch (role) {
      case 'employer':
        return '/employer';
      case 'job_seeker':
        return '/job-seeker';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  };

  const basePath = getBasePath(role);

  const navItemClass = ({ isActive }) =>
    `flex items-center justify-between px-6 py-4 text-sm font-medium rounded-2xl transition-all duration-300 group ${
      isActive
        ? 'bg-gradient-to-r from-amber-50/90 to-orange-50/60 text-amber-800 border-2 border-amber-200 shadow-lg'
        : 'text-neutral-700 hover:text-amber-800 hover:bg-amber-50/60 border-2 border-transparent hover:border-amber-100'
    }`;

  return (
    <div className="fixed left-0 top-0 w-80 min-w-80 bg-gradient-to-b from-white to-amber-50/20 border-r-2 border-amber-100 h-screen overflow-y-auto z-40">
      {/* Top Decorative Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 to-orange-300"></div>
      
      <nav className="p-8 space-y-3 h-full">
        {/* Brand Section */}
        <div className="pb-8 mb-8 border-b-2 border-amber-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-lg">
              <RocketLaunchIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent">
                ETHIO-CAREER
              </div>
              <div className="text-sm text-amber-600 font-medium">Professional Dashboard</div>
            </div>
          </div>

          <div className="space-y-2">
            <NavLink to={`${basePath}/dashboard`} className={navItemClass}>
              <div className="flex items-center gap-4">
                <HomeIcon className="w-5 h-5 text-amber-600 group-hover:text-amber-700 flex-shrink-0" />
                <span>Overview</span>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </NavLink>
            
            {role === 'job_seeker' && (
              <NavLink to={`${basePath}/profile`} className={navItemClass}>
                <div className="flex items-center gap-4">
                  <UserCircleIcon className="w-5 h-5 text-amber-600 group-hover:text-amber-700 flex-shrink-0" />
                  <span>My Career Profile</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </NavLink>
            )}
            
            {role === 'employer' && (
              <NavLink to={`${basePath}/company-profile`} className={navItemClass}>
                <div className="flex items-center gap-4">
                  <BuildingOffice2Icon className="w-5 h-5 text-amber-600 group-hover:text-amber-700 flex-shrink-0" />
                  <span>Company Profile</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </NavLink>
            )}
            
            <NavLink to={`${basePath}/settings`} className={navItemClass}>
              <div className="flex items-center gap-4">
                <Cog6ToothIcon className="w-5 h-5 text-amber-600 group-hover:text-amber-700 flex-shrink-0" />
                <span>Account Settings</span>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </div>
        </div>

        {/* Role-Specific Navigation */}
        <div className="flex-1 overflow-y-auto pr-2">
          {role === 'employer' && (
            <div className="space-y-2 mb-8">
              <div className="flex items-center gap-3 px-6 mb-4">
                <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                  <StarIcon className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-sm font-bold text-amber-800 uppercase tracking-wider">
                  Employer Hub
                </p>
              </div>
              
              <div className="space-y-2 pl-4">
                <NavLink to={`${basePath}/jobs/post`} className={navItemClass}>
                  <div className="flex items-center gap-4">
                    <PlusCircleIcon className="w-5 h-5 text-amber-600 group-hover:text-amber-700 flex-shrink-0" />
                    <span>Post Opportunity</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </NavLink>
                
                <NavLink to={`${basePath}/jobs`} className={navItemClass}>
                  <div className="flex items-center gap-4">
                    <BriefcaseIcon className="w-5 h-5 text-amber-600 group-hover:text-amber-700 flex-shrink-0" />
                    <span>My Opportunities</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </NavLink>
                
                <NavLink to={`${basePath}/applications`} className={navItemClass}>
                  <div className="flex items-center gap-4">
                    <UsersIcon className="w-5 h-5 text-amber-600 group-hover:text-amber-700 flex-shrink-0" />
                    <span>Applicants</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </NavLink>
              </div>
            </div>
          )}

          {role === 'admin' && (
            <div className="space-y-2 mb-8">
              <div className="flex items-center gap-3 px-6 mb-4">
                <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                  <CheckBadgeIcon className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-sm font-bold text-amber-800 uppercase tracking-wider">
                  Admin Console
                </p>
              </div>
              
              <div className="space-y-2 pl-4">
                <NavLink to={`${basePath}/analytics`} className={navItemClass}>
                  <div className="flex items-center gap-4">
                    <ChartBarIcon className="w-5 h-5 text-amber-600 group-hover:text-amber-700 flex-shrink-0" />
                    <span>Platform Analytics</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </NavLink>
                
                <NavLink to={`${basePath}/jobs`} className={navItemClass}>
                  <div className="flex items-center gap-4">
                    <BriefcaseIcon className="w-5 h-5 text-amber-600 group-hover:text-amber-700 flex-shrink-0" />
                    <span>Manage Opportunities</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </NavLink>
                
                <NavLink to={`${basePath}/users`} className={navItemClass}>
                  <div className="flex items-center gap-4">
                    <UsersIcon className="w-5 h-5 text-amber-600 group-hover:text-amber-700 flex-shrink-0" />
                    <span>Manage Users</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </NavLink>
                
                <NavLink to={`${basePath}/employers`} className={navItemClass}>
                  <div className="flex items-center gap-4">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-amber-600 group-hover:text-amber-700 flex-shrink-0" />
                    <span>Employer Approvals</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </NavLink>
              </div>
            </div>
          )}

          {role === 'job_seeker' && (
            <div className="space-y-2 mb-8">
              <div className="flex items-center gap-3 px-6 mb-4">
                <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                  <AcademicCapIcon className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-sm font-bold text-amber-800 uppercase tracking-wider">
                  Career Tools
                </p>
              </div>
              
              <div className="space-y-2 pl-4">
                <NavLink to={`${basePath}/jobs`} className={navItemClass}>
                  <div className="flex items-center gap-4">
                    <BriefcaseIcon className="w-5 h-5 text-amber-600 group-hover:text-amber-700 flex-shrink-0" />
                    <span>Find Opportunities</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </NavLink>
                
                <NavLink to={`${basePath}/applications`} className={navItemClass}>
                  <div className="flex items-center gap-4">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-amber-600 group-hover:text-amber-700 flex-shrink-0" />
                    <span>My Applications</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </NavLink>
                
                <NavLink to={`${basePath}/cv-manager`} className={navItemClass}>
                  <div className="flex items-center gap-4">
                    <DocumentTextIcon className="w-5 h-5 text-amber-600 group-hover:text-amber-700 flex-shrink-0" />
                    <span>CV Manager</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </NavLink>
              </div>
            </div>
          )}

          {/* Ethiopian Context Section */}
          <div className="mt-6 pt-6 border-t-2 border-amber-100">
            <div className="px-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                  <MapIcon className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-sm font-bold text-amber-800 uppercase tracking-wider">
                  Ethiopian Network
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50/70 to-orange-50/40 rounded-2xl p-6 border-2 border-amber-100 mx-6">
              <p className="text-sm font-semibold text-amber-800 mb-4">
                Connect with Ethiopian Professionals
              </p>
              <div className="space-y-3 text-sm text-amber-700">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex-shrink-0"></div>
                  <span>Industry Networking Events</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex-shrink-0"></div>
                  <span>Career Development Workshops</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex-shrink-0"></div>
                  <span>Professional Groups & Forums</span>
                </div>
              </div>
              <button className="mt-6 w-full py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 text-amber-800 font-semibold rounded-xl hover:border-amber-300 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 transition-all duration-300">
                Explore Networking
              </button>
            </div>
          </div>
        </div>

        {/* User Info at Bottom - Fixed Position */}
        {user && (
          <div className="pt-8 border-t-2 border-amber-100 mx-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-200 rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-amber-700">
                  {user.name?.charAt(0) || user.email?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-neutral-900 truncate">{user.name || 'User'}</p>
                <p className="text-xs font-medium text-amber-700 uppercase tracking-wider truncate">
                  {user.role?.replace('_', ' ') || 'Member'}
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;