import React from 'react';
import { Link } from 'react-router-dom';
import { 
  RocketLaunchIcon,
  MapIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-white to-amber-50/30 border-t-2 border-amber-100 mt-auto">
      {/* Top Decorative Line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent"></div>
      
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Brand Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
                  <RocketLaunchIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 bg-clip-text text-transparent">
                    ETHIO-CAREER
                  </span>
                  <p className="text-sm font-medium text-amber-800 mt-1">
                    Elevating Ethiopian Careers
                  </p>
                </div>
              </Link>
              
              <p className="text-neutral-700 leading-relaxed max-w-md text-sm font-medium">
                Empowering Ethiopian professionals and businesses to connect, grow, and succeed. 
                Your premier platform for career advancement and talent acquisition in Ethiopia.
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/50 rounded-2xl p-6 border-2 border-amber-100 backdrop-blur-sm">
              <h4 className="font-bold text-amber-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapIcon className="w-4 h-4" />
                Ethiopian Headquarters
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-amber-800/90">
                  <BuildingOfficeIcon className="w-4 h-4 text-amber-600" />
                  <span>Addis Ababa, Ethiopia</span>
                </div>
                <div className="flex items-center gap-3 text-amber-800/90">
                  <PhoneIcon className="w-4 h-4 text-amber-600" />
                  <span>+251 XXX XX XX XX</span>
                </div>
                <div className="flex items-center gap-3 text-amber-800/90">
                  <EnvelopeIcon className="w-4 h-4 text-amber-600" />
                  <span>support@ethiocareer.et</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8">
            {/* Platform Links */}
            <div>
              <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-6 flex items-center gap-2">
                <RocketLaunchIcon className="w-4 h-4" />
                Platform
              </h3>
              <ul className="space-y-3">
                {[
                  { to: "/job-seeker/jobs", label: "Browse Opportunities" },
                  { to: "/employer/jobs", label: "Post Opportunities" },
                  { to: "/pricing", label: "Pricing Plans" },
                  { to: "/companies", label: "Featured Companies" },
                  { to: "/success-stories", label: "Success Stories" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-sm text-neutral-700 hover:text-amber-700 font-medium transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-300 rounded-full group-hover:bg-amber-500 transition-colors"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-6 flex items-center gap-2">
                <AcademicCapIcon className="w-4 h-4" />
                Resources
              </h3>
              <ul className="space-y-3">
                {[
                  { to: "/help", label: "Help Center" },
                  { to: "/blog", label: "Career Blog" },
                  { to: "/contact", label: "Contact Support" },
                  { to: "/terms", label: "Terms of Service" },
                  { to: "/privacy", label: "Privacy Policy" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-sm text-neutral-700 hover:text-amber-700 font-medium transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-300 rounded-full group-hover:bg-amber-500 transition-colors"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Section */}
            <div className="col-span-2">
              <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/50 rounded-2xl p-6 border-2 border-amber-100 backdrop-blur-sm">
                <h4 className="font-bold text-amber-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <UserGroupIcon className="w-4 h-4" />
                  Join Our Community
                </h4>
                <p className="text-sm text-amber-800/90 mb-4">
                  Connect with thousands of Ethiopian professionals and employers.
                </p>
                <div className="flex items-center gap-3">
                  {['LinkedIn', 'Telegram', 'Twitter'].map((platform) => (
                    <a 
                      key={platform}
                    
                      className="px-4 py-2 bg-white border-2 border-amber-200 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-50 hover:border-amber-300 transition-all duration-200"
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t-2 border-amber-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center">
              <span className="text-xs font-bold text-white">ET</span>
            </div>
            <p className="text-sm font-medium text-amber-800">
              Made in Ethiopia, for Ethiopian Professionals
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-neutral-500 font-medium">
              &copy; {currentYear} <span className="font-bold text-amber-800">Ethio-Career</span>. All rights reserved.
            </p>
            <p className="text-xs text-neutral-400 mt-2">
              Empowering Ethiopia's workforce since 2023
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        
      </div>
    </footer>
  );
};

export default Footer;