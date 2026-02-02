import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { profileService } from '../../services/profile.service';
import { authService } from '../../services/auth.service';
import { userService } from '../../services/user.service';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Account Preferences State
  const [account, setAccount] = useState({
    email: '',
    phone: '',
    profileVisibility: 'public', // public, private
  });

  // Security State
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setFetching(true);
        const profile = await profileService.getJobSeekerProfile();
        setAccount({
          email: profile.user.email,
          phone: profile.phone || '',
          profileVisibility: profile.profileVisibility || 'public',
        });
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccount(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await profileService.updateJobSeekerProfile({
        phone: account.phone,
        profileVisibility: account.profileVisibility
      });
      toast.success('Account preferences updated successfully!');
    } catch (err) {
      toast.error('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (security.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword(security.currentPassword, security.newPassword);
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action can be undone by contacting support.')) {
      try {
        setLoading(true);
        await userService.deactivateAccount();
        toast.success('Account deactivated. Logging out...');
        setTimeout(() => {
          authService.logout();
          window.location.href = '/login';
        }, 2000);
      } catch (err) {
        toast.error('Failed to deactivate account');
      } finally {
        setLoading(false);
      }
    }
  };

  if (fetching) return <DashboardLayout><div className="flex justify-center py-20">Loading settings...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-600">Manage your account preferences and security.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-neutral-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('account')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'account'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              Account Preferences
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'security'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'notifications'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'privacy'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              Privacy
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'account' ? (
            <div className="space-y-8">
              <form onSubmit={handleSaveAccount} className="max-w-2xl space-y-6">
                <Input
                  label="Email Address"
                  name="email"
                  value={account.email}
                  type="email"
                  disabled 
                  helperText="Email cannot be changed directly."
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  value={account.phone}
                  onChange={handleAccountChange}
                  placeholder="+1 (555) 000-0000"
                />
                
                <div className="space-y-4 pt-2">
                  <h3 className="text-lg font-medium text-neutral-900">Privacy Settings</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Profile Visibility</label>
                      <p className="text-xs text-neutral-500">Allow employers to find you in search results</p>
                    </div>
                    <select
                      name="profileVisibility"
                      value={account.profileVisibility}
                      onChange={handleAccountChange}
                      className="w-40 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="public">Publicly Visible</option>
                      <option value="private">Hidden (Private)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="primary" loading={loading}>
                    Save Preferences
                  </Button>
                </div>
              </form>

              <div className="pt-8 border-t border-red-100">
                <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
                <p className="text-sm text-neutral-500 mb-4">
                  Once you deactivate your account, you will no longer be visible to employers and cannot apply for jobs.
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleDeleteAccount}
                  loading={loading}
                >
                  Deactivate My Account
                </Button>
              </div>
            </div>
          ) : activeTab === 'security' ? (
            <form onSubmit={handleSaveSecurity} className="max-w-xl space-y-6">
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md text-sm mb-4">
                Enter your current password to authorize this change.
              </div>

              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                value={security.currentPassword}
                onChange={handleSecurityChange}
                placeholder="Enter current password"
                required
              />
              <Input
                label="New Password"
                name="newPassword"
                type="password"
                value={security.newPassword}
                onChange={handleSecurityChange}
                placeholder="Enter new password"
                required
              />
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={security.confirmPassword}
                onChange={handleSecurityChange}
                placeholder="Confirm new password"
                required
              />

              <div className="pt-4">
                <Button type="submit" variant="primary" loading={loading}>
                  Update Password
                </Button>
              </div>
            </form>
          ) : activeTab === 'notifications' ? (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-neutral-900">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-700">Email Notifications</p>
                    <p className="text-xs text-neutral-500">Receive alerts about new jobs and application updates</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-700">Application Status Alerts</p>
                    <p className="text-xs text-neutral-500">Instant notifications when an employer reviews your application</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary-600" />
                </div>
              </div>
              <Button variant="primary">Save Changes</Button>
            </div>
          ) : (
            <div className="space-y-6">
               <h3 className="text-lg font-medium text-neutral-900">Privacy & Data</h3>
               <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-700">Profile Searchability</p>
                    <p className="text-xs text-neutral-500">Allow verified employers to find you even if you haven't applied</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-red-100">
                  <div>
                    <p className="font-medium text-red-700">Download My Data</p>
                    <p className="text-xs text-neutral-500">Get a copy of all your profile information and resumes</p>
                  </div>
                  <Button size="small" variant="outline">Request Download</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
