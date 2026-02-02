import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { 
  BuildingOfficeIcon, 
  GlobeAltIcon, 
  MapPinIcon, 
  DocumentTextIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { employerService } from '../../services/employer.service';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [generalInfo, setGeneralInfo] = useState({
    companyName: '',
    website: '',
    location: '',
    description: '',
    industry: 'Technology',
    companySize: '51-200 employees',
    founded: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await employerService.getProfile();
        setGeneralInfo({
          companyName: data.companyName || '',
          website: data.website || '',
          location: data.location || '',
          description: data.description || '',
          industry: data.industry || 'Technology',
          companySize: data.companySize || '51-200 employees',
          founded: data.founded || ''
        });
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    applicationUpdates: true,
    newsletter: false,
    marketingEmails: false,
  });

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await employerService.updateProfile(generalInfo);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1000);
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  // Text gradient class
  const titleGradient = "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent";

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center">
            <BuildingOfficeIcon className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className={`text-2xl lg:text-3xl font-bold ${titleGradient}`}>Settings</h1>
            <p className="text-amber-800/70 mt-2">Manage your company profile and account preferences</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white via-amber-50/20 to-amber-100/10 rounded-3xl border-2 border-amber-200/50 shadow-xl overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-amber-200/50 px-6">
          <nav className="flex flex-wrap -mb-px">
            {[
              { id: 'general', label: 'Company Profile', icon: BuildingOfficeIcon },
              { id: 'security', label: 'Security', icon: LockClosedIcon },
              { id: 'notifications', label: 'Notifications', icon: ShieldCheckIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 font-medium text-sm border-b-2 transition-all duration-300 flex items-center ${
                    activeTab === tab.id
                      ? 'border-amber-600 text-amber-700 bg-gradient-to-r from-amber-50/50 to-amber-100/30'
                      : 'border-transparent text-amber-600/70 hover:text-amber-700 hover:bg-amber-50/30'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 md:p-8">
          {/* Company Profile Tab */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveGeneral} className="max-w-3xl space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-3 flex items-center">
                    <BuildingOfficeIcon className="w-4 h-4 mr-2 text-amber-600" />
                    Company Name
                  </label>
                  <Input
                    name="companyName"
                    value={generalInfo.companyName}
                    onChange={handleGeneralChange}
                    placeholder="Enter company name"
                    className="rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-3 flex items-center">
                    <GlobeAltIcon className="w-4 h-4 mr-2 text-amber-600" />
                    Website
                  </label>
                  <Input
                    name="website"
                    value={generalInfo.website}
                    onChange={handleGeneralChange}
                    placeholder="https://example.com"
                    type="url"
                    className="rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-3 flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-2 text-amber-600" />
                    Location
                  </label>
                  <Input
                    name="location"
                    value={generalInfo.location}
                    onChange={handleGeneralChange}
                    placeholder="City, Country"
                    className="rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-3">Industry</label>
                  <div className="relative">
                    <select
                      name="industry"
                      value={generalInfo.industry}
                      onChange={handleGeneralChange}
                      className="w-full rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3 appearance-none"
                    >
                      <option>Technology</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                      <option>Retail</option>
                      <option>Manufacturing</option>
                      <option>Education</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-3">Company Size</label>
                  <div className="relative">
                    <select
                      name="companySize"
                      value={generalInfo.companySize}
                      onChange={handleGeneralChange}
                      className="w-full rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3 appearance-none"
                    >
                      <option>1-10 employees</option>
                      <option>11-50 employees</option>
                      <option>51-200 employees</option>
                      <option>201-500 employees</option>
                      <option>501-1000 employees</option>
                      <option>1000+ employees</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-3 flex items-center">
                  <DocumentTextIcon className="w-4 h-4 mr-2 text-amber-600" />
                  Company Description
                </label>
                <div className="relative">
                  <textarea
                    name="description"
                    rows={4}
                    value={generalInfo.description}
                    onChange={handleGeneralChange}
                    className="w-full rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3 resize-none"
                    placeholder="Tell us about your company culture, mission, and values..."
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-amber-600/70">
                    {(generalInfo.description || '').length}/500
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-amber-200/50">
                <Button 
                  type="submit" 
                  variant="primary" 
                  loading={loading}
                  className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 px-8 py-3 transition-all"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Saving Changes...
                    </div>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Save Company Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handleSaveSecurity} className="max-w-2xl space-y-8">
              <div className="bg-gradient-to-br from-amber-50/50 to-amber-100/30 border-2 border-amber-200/50 rounded-3xl p-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center">
                    <ShieldCheckIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 mb-1">Account Security</h3>
                    <p className="text-amber-700/80 text-sm">Keep your account secure with a strong password</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-amber-900 mb-3">Current Password</label>
                  <Input
                    name="currentPassword"
                    type="password"
                    value={security.currentPassword}
                    onChange={handleSecurityChange}
                    placeholder="Enter current password"
                    className="rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-amber-900 mb-3">New Password</label>
                    <Input
                      name="newPassword"
                      type="password"
                      value={security.newPassword}
                      onChange={handleSecurityChange}
                      placeholder="Enter new password"
                      className="rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-amber-900 mb-3">Confirm Password</label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={security.confirmPassword}
                      onChange={handleSecurityChange}
                      placeholder="Confirm new password"
                      className="rounded-2xl border-2 border-amber-300 bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all px-4 py-3"
                    />
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-gradient-to-br from-amber-50/30 to-amber-100/10 border border-amber-200/50 rounded-2xl p-6">
                  <h4 className="font-bold text-amber-900 mb-4">Password Requirements</h4>
                  <ul className="space-y-2 text-sm text-amber-700/80">
                    <li className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mr-3">
                        {security.newPassword.length >= 8 ? (
                          <CheckCircleIcon className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                        )}
                      </div>
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mr-3">
                        {/[A-Z]/.test(security.newPassword) ? (
                          <CheckCircleIcon className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                        )}
                      </div>
                      One uppercase letter
                    </li>
                    <li className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mr-3">
                        {/\d/.test(security.newPassword) ? (
                          <CheckCircleIcon className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                        )}
                      </div>
                      One number
                    </li>
                    <li className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mr-3">
                        {/[!@#$%^&*]/.test(security.newPassword) ? (
                          <CheckCircleIcon className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                        )}
                      </div>
                      One special character
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-amber-200/50">
                <Button 
                  type="submit" 
                  variant="primary" 
                  loading={loading}
                  disabled={security.newPassword !== security.confirmPassword || security.newPassword.length < 8}
                  className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 px-8 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Updating Password...
                    </div>
                  ) : (
                    <>
                      <LockClosedIcon className="w-5 h-5 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSaveNotifications} className="max-w-2xl space-y-8">
              <div className="bg-gradient-to-br from-amber-50/50 to-amber-100/30 border-2 border-amber-200/50 rounded-3xl p-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/5 flex items-center justify-center">
                    <ShieldCheckIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 mb-1">Notification Preferences</h3>
                    <p className="text-amber-700/80 text-sm">Choose what updates you want to receive</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { name: 'emailAlerts', label: 'Email Alerts', description: 'Receive important account notifications and security alerts' },
                  { name: 'applicationUpdates', label: 'Application Updates', description: 'Get notified when candidates apply to your jobs' },
                  { name: 'newsletter', label: 'Weekly Newsletter', description: 'Receive tips, industry insights, and platform updates' },
                  { name: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional offers and product announcements' },
                ].map((item) => (
                  <div 
                    key={item.name} 
                    className="bg-gradient-to-br from-white to-amber-50/50 p-6 rounded-2xl border border-amber-200/50 hover:border-amber-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-amber-900 mb-2">{item.label}</h4>
                        <p className="text-amber-700/80 text-sm">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name={item.name}
                          checked={notifications[item.name]}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-amber-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-amber-500 to-amber-600"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-amber-200/50">
                <Button 
                  type="submit" 
                  variant="primary" 
                  loading={loading}
                  className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 px-8 py-3 transition-all"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Updating Preferences...
                    </div>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Save Notification Settings
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border-2 border-amber-300/30 rounded-3xl p-6">
          <h4 className="font-bold text-amber-900 mb-4 flex items-center">
            <ExclamationCircleIcon className="w-5 h-5 mr-2 text-amber-600" />
            Need Help?
          </h4>
          <p className="text-amber-700/80 text-sm mb-6">Contact our support team for assistance with your account settings</p>
          <Button 
            variant="outline"
            className="rounded-2xl border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 hover:shadow-lg w-full py-3 transition-all"
          >
            Contact Support
          </Button>
        </div>
        
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border-2 border-amber-300/30 rounded-3xl p-6">
          <h4 className="font-bold text-amber-900 mb-4 flex items-center">
            <ShieldCheckIcon className="w-5 h-5 mr-2 text-amber-600" />
            Account Verification
          </h4>
          <p className="text-amber-700/80 text-sm mb-6">Complete verification to unlock all employer features</p>
          <Button 
            variant="primary"
            className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-2xl border-0 w-full py-3 transition-all"
          >
            Verify Account
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;