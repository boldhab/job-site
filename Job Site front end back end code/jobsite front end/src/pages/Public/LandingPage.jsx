import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import { 
  MagnifyingGlassIcon, 
  BriefcaseIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  CheckCircleIcon,
  RocketLaunchIcon,
  MapIcon,
  StarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const [authMode, setAuthMode] = useState(null); // 'login', 'register', or null

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50/30 min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-grid-neutral-200/20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <div className="container-custom py-20 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Column: Content */}
            <div className={`flex-1 space-y-10 transition-all duration-500 ${authMode ? 'lg:max-w-xl text-left' : 'max-w-5xl mx-auto text-center'}`}>
              <div className="space-y-6">
                <div className={`inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-2xl border border-amber-200/50 mb-4 transition-all duration-500 ${!authMode && 'mx-auto'}`}>
                  <RocketLaunchIcon className="w-5 h-5 text-amber-600" />
                  <span className="text-amber-800 font-semibold text-sm uppercase tracking-wider">Ethio-Career Platform</span>
                </div>
                
                <h1 className={`${authMode ? 'text-4xl md:text-6xl' : 'text-5xl md:text-7xl'} font-bold tracking-tight text-neutral-900 leading-tight transition-all duration-500`}>
                  <span className="relative">
                    <span className="relative z-10 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent">
                      Ethiopian Career
                    </span>
                    <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-amber-200/50 to-amber-300/30 -rotate-1"></span>
                  </span>
                </h1>
                
                <p className={`${authMode ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'} text-neutral-700 leading-relaxed font-medium transition-all duration-500 ${!authMode && 'max-w-3xl mx-auto'}`}>
                  Connect with Ethiopia's top employers and discover opportunities that align with your professional journey. 
                  Our platform bridges talent with visionary companies across industries.
                </p>
              </div>
              
              {!authMode && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-5 pt-4">
                  <Button 
                    variant="primary" 
                    size="large" 
                    onClick={() => setAuthMode('login')}
                    className="w-full sm:w-auto px-10 py-4 text-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-amber-500/25 hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300 border-0"
                  >
                    <BriefcaseIcon className="w-5 h-5 mr-2 inline-block" />
                    Sign in
                  </Button>
                  <Button 
                    variant="outline" 
                    size="large" 
                    onClick={() => setAuthMode('register')}
                    className="w-full sm:w-auto px-10 py-4 text-lg border-2 border-amber-200 bg-white/50 hover:bg-amber-50/80 hover:border-amber-300 text-amber-800 transition-all duration-300"
                  >
                    <StarIcon className="w-5 h-5 mr-2 inline-block" />
                    Sign up
                  </Button>
                </div>
              )}
              
              {!authMode && (
                <div className="pt-12">
                  <div className="inline-flex items-center justify-center gap-8 flex-wrap">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-white shadow-sm"></div>
                        <div className="text-left">
                          <p className="font-bold text-neutral-800"></p>
                          <p className="text-xs text-neutral-500">Professional</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Auth Form */}
            {authMode && (
              <div className="flex-1 w-full max-w-xl mx-auto animate-fadeIn relative">
                <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border-2 border-amber-100 shadow-2xl relative">
                  <button 
                    onClick={() => setAuthMode(null)}
                    className="absolute top-6 right-6 p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>

                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-neutral-900">
                      {authMode === 'login' ? 'Welcome Back' : 'Create Profile'}
                    </h2>
                    <p className="text-neutral-600 mt-2">
                      {authMode === 'login' 
                        ? 'Sign in to access your Ethiopian career dashboard' 
                        : 'Join Ethiopia\'s fastest growing professional network'}
                    </p>
                  </div>

                  {authMode === 'login' ? (
                    <LoginForm 
                      onSwitchToRegister={() => setAuthMode('register')}
                    />
                  ) : (
                    <RegisterForm 
                      onSwitchToLogin={() => setAuthMode('login')}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 bg-gradient-to-b from-white to-neutral-50/30 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/50 to-transparent" />
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-20">
            <div className="inline-flex items-center gap-3 text-amber-800">
              <MapIcon className="w-6 h-6" />
              <span className="font-semibold text-sm uppercase tracking-wider">Ethio-Career Advantage</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900">
              Navigate Your <span className="text-amber-700">Career Path</span> with Confidence
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              Designed for Ethiopian professionals, our platform combines local insight with global standards 
              to help you achieve career excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                icon: MagnifyingGlassIcon,
                title: "Smart Career Mapping",
                description: "AI-powered insights tailored to Ethiopia's growing market sectors and emerging industries.",
                gradient: "from-amber-50/80 to-orange-50/50",
                iconColor: "text-amber-600",
                borderColor: "border-amber-100"
              },
              {
                icon: CheckCircleIcon,
                title: "Streamlined Applications",
                description: "Quick-apply features and profile optimization for Ethiopia's competitive job market.",
                gradient: "from-emerald-50/80 to-green-50/50",
                iconColor: "text-emerald-600",
                borderColor: "border-emerald-100"
              },
              {
                icon: UserGroupIcon,
                title: "Network & Connect",
                description: "Direct access to hiring managers and industry leaders across Ethiopia.",
                gradient: "from-blue-50/80 to-cyan-50/50",
                iconColor: "text-blue-600",
                borderColor: "border-blue-100"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group relative p-8 bg-white/80 backdrop-blur-sm rounded-3xl border-2 hover:border-amber-300/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-white border-2 ${feature.borderColor} flex items-center justify-center ${feature.iconColor} mb-8 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4 group-hover:text-neutral-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed group-hover:text-neutral-700 transition-colors">
                    {feature.description}
                  </p>
                  <div className="mt-8 pt-6 border-t border-neutral-100 group-hover:border-amber-200/50 transition-colors">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-amber-700">
                      Learn more
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-amber-900/30">
        <div className="container-custom py-24 relative">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-2xl border border-amber-400/30 backdrop-blur-sm">
                <RocketLaunchIcon className="w-6 h-6 text-amber-300" />
                <span className="text-amber-100 font-bold text-sm uppercase tracking-widest">Ethio-Career Exclusive</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Launch Your <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                  Professional Ascent
                </span>
              </h2>
              
              <p className="text-xl text-neutral-200/90 leading-relaxed max-w-2xl mx-auto font-medium">
                Join Ethiopia's fastest-growing community of professionals and forward-thinking companies 
                shaping the nation's economic future.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">
              <Button 
                variant="primary"
                size="large"
                onClick={() => {
                  setAuthMode('register');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-12 py-5 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold shadow-2xl hover:shadow-amber-500/30 hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 border-0"
              >
                <StarIcon className="w-5 h-5 mr-2 inline-block group-hover:rotate-180 transition-all duration-500" />
                Get Started
              </Button>
            </div>
            
            <div className="pt-12 border-t border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { label: "No fees", value: "100% Free" },
                  { label: "Success Rate", value: "92%" },
                  { label: "Support", value: "24/7" }
                ].map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <p className="text-2xl font-bold text-amber-300">{stat.value}</p>
                    <p className="text-sm text-amber-100/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default LandingPage;
