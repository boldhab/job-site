import React from 'react';
import { Link } from 'react-router-dom';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';

const AuthLayout = ({ children, title, subtitle, logo }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-amber-200/10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none"></div>
      
      <div className="relative max-w-md w-full space-y-10">
        {/* Header Section */}
        <div className="text-center">
          {logo ? (
            logo
          ) : (
            <Link to="/" className="inline-flex items-center justify-center group">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <RocketLaunchIcon className="w-8 h-8 text-white" />
              </div>
            </Link>
          )}
          
          <h2 className="mt-8 text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          
          {subtitle && (
            <p className="mt-4 text-lg text-amber-800/90 font-medium leading-relaxed max-w-sm mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Card Container */}
        <div className="relative">
          {/* Card glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Main Card */}
          <div className="relative bg-white/90 backdrop-blur-sm py-10 px-6 shadow-2xl sm:rounded-3xl sm:px-10 border-2 border-amber-100">
            {/* Top accent line */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-1.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
            
            {children}
            
            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent"></div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-sm text-amber-800/70 font-medium">
            Need help?{' '}
            <Link to="/contact" className="font-semibold text-amber-700 hover:text-amber-800 transition-colors">
              Contact our Ethiopian support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;