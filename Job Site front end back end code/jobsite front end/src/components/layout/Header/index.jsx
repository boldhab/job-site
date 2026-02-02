import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { 
  BellIcon, 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon,
  RocketLaunchIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { getDashboardRoute } from '../../../utils/helpers';
import Button from '../../common/Button';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getBasePath = (role) => {
    switch (role?.toLowerCase()) {
      case 'employer': return '/employer';
      case 'job_seeker': return '/job-seeker';
      case 'admin': return '/admin';
      default: return '';
    }
  };

  const basePath = getBasePath(user?.role);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchPath = user?.role === 'job_seeker' ? '/job-seeker/jobs' : '/jobs';
      navigate(`${searchPath}?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b-2 border-amber-100 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
              <RocketLaunchIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 bg-clip-text text-transparent">
                ETHIO-CAREER
              </span>
              <span className="text-xs font-medium text-amber-800">
                Elevating Ethiopian Careers
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-amber-700/10 rounded-2xl transform scale-105 group-hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Ethiopian opportunities, companies..."
                className="relative w-80 pl-12 pr-6 py-3 bg-white border-2 border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-300 outline-none transition-all duration-300 hover:border-amber-300"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-amber-600 absolute left-4 top-1/2 transform -translate-y-1/2" />
            </form>

            {user ? (
              <div className="flex items-center space-x-8">
                {/* Notifications */}
                <button className="relative p-2 text-neutral-600 hover:text-amber-700 transition-colors duration-200 group">
                  <div className="relative">
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></span>
                  </div>
                </button>
                
                {/* User Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 focus:outline-none group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-200 rounded-xl flex items-center justify-center group-hover:border-amber-300 transition-all duration-300">
                      <span className="text-lg font-bold text-amber-700">
                        {user.name?.charAt(0) || user.email?.charAt(0)}
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-neutral-900 block">{user.name || 'User'}</span>
                      <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">
                        {user.role?.replace('_', ' ') || 'Member'}
                      </span>
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border-2 border-amber-100 backdrop-blur-sm animate-fade-in">
                      <div className="p-2">
                        <div className="px-4 py-3 border-b border-amber-100">
                          <p className="text-sm font-medium text-neutral-900">{user.name || user.email}</p>
                          <p className="text-xs text-amber-700 font-medium">{user.email}</p>
                        </div>
                        
                        <div className="py-2">
                          <Link 
                            to={getDashboardRoute(user.role)} 
                            className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-amber-50 rounded-xl transition-colors duration-200 group/item"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <HomeIcon className="w-4 h-4 text-amber-600 group-hover/item:text-amber-700" />
                            Dashboard
                          </Link>
                          
                          <Link 
                            to={`${basePath}/profile`} 
                            className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-amber-50 rounded-xl transition-colors duration-200 group/item"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <UserIcon className="w-4 h-4 text-amber-600 group-hover/item:text-amber-700" />
                            Profile
                          </Link>
                          
                          <Link 
                            to={`${basePath}/settings`} 
                            className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-amber-50 rounded-xl transition-colors duration-200 group/item"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Cog6ToothIcon className="w-4 h-4 text-amber-600 group-hover/item:text-amber-700" />
                            Settings
                          </Link>
                        </div>
                        
                        <hr className="my-2 border-amber-100" />
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 group/item"
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link 
                  to="/login" 
                  className="font-semibold text-amber-700 hover:text-amber-800 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <UserIcon className="w-5 h-5" />
                  Sign In
                </Link>
                <Link to="/register">
                  <Button 
                    variant="primary" 
                    size="medium"
                    className="group bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl hover:shadow-amber-500/25 transform hover:-translate-y-0.5 transition-all duration-300 border-0 px-6"
                  >
                    Create Account
                    <RocketLaunchIcon className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-2xl text-neutral-700 hover:text-amber-700 hover:bg-amber-50 transition-all duration-300"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-7 h-7" />
            ) : (
              <Bars3Icon className="w-7 h-7" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t-2 border-amber-100 bg-white/95 backdrop-blur-sm animate-slide-down rounded-b-2xl shadow-lg">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-6 px-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search opportunities..."
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-300 outline-none"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-amber-600 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
            </form>
            
            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              {user ? (
                <>
                  <Link 
                    to={getDashboardRoute(user.role)} 
                    className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:text-amber-700 hover:bg-amber-50 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <HomeIcon className="w-5 h-5" />
                    Dashboard
                  </Link>
                  
                  <Link 
                    to={`${basePath}/profile`} 
                    className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:text-amber-700 hover:bg-amber-50 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon className="w-5 h-5" />
                    Profile
                  </Link>
                  
                  <Link 
                    to={`${basePath}/settings`} 
                    className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:text-amber-700 hover:bg-amber-50 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                    Settings
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center gap-3 px-4 py-3 text-neutral-700 hover:text-amber-700 hover:bg-amber-50 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon className="w-5 h-5" />
                    Sign In
                  </Link>
                  
                  <Link 
                    to="/register" 
                    className="flex items-center gap-3 px-4 py-3 text-amber-700 hover:text-amber-800 hover:bg-amber-50 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <RocketLaunchIcon className="w-5 h-5" />
                    Create Account
                  </Link>
                </>
              )}
            </div>

            {/* User Info for Mobile */}
            {user && (
              <div className="mt-6 pt-6 border-t border-amber-100 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-200 rounded-xl flex items-center justify-center">
                    <span className="text-lg font-bold text-amber-700">
                      {user.name?.charAt(0) || user.email?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">{user.name || 'User'}</p>
                    <p className="text-xs text-amber-700 font-medium uppercase tracking-wider">
                      {user.role?.replace('_', ' ') || 'Member'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;