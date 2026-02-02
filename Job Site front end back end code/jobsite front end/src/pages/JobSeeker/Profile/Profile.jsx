import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { profileService } from '../../../services/profile.service';
import { aiService } from '../../../services/ai.service';
import { toast } from 'react-hot-toast';
import { SparklesIcon, LightBulbIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, statsData] = await Promise.all([
          profileService.getJobSeekerProfile(),
          profileService.getStatistics()
        ]);
        setProfile(profileData);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load profile data', err);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await profileService.updateJobSeekerProfile(profile);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyzeCV = async () => {
    setAnalyzing(true);
    setAiFeedback(null);
    try {
      const res = await aiService.analyzeMyCV();
      setAiFeedback(res.feedback);
      toast.success('AI Analysis complete!');
    } catch (err) {
      console.error('AI Analysis failed', err);
      toast.error('AI service is busy, please try again later.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <DashboardLayout><div className="flex justify-center py-20">Loading profile...</div></DashboardLayout>;

  return (
    <DashboardLayout>
       <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">My Profile</h1>
        <p className="text-neutral-600">Manage your personal information and resume.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-600 overflow-hidden">
                {profile?.profilePhotoUrl ? (
                  <img src={profile.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile?.fullName?.split(' ').map(n => n[0]).join('') || 'U'
                )}
              </div>
              <h2 className="text-xl font-bold text-neutral-900">{profile?.fullName}</h2>
              <p className="text-neutral-500 mb-4">{profile?.headline || 'No headline set'}</p>
              <div className="text-xs text-neutral-400 mb-2 italic px-4">To change your photo, update the URL in the form below.</div>
           </Card>

           <Card className="p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Application Statistics</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Total Submitted</span>
                    <span className="font-bold text-neutral-900">{stats?.totalApplications || 0}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Shortlisted</span>
                    <span className="font-bold text-green-600">{stats?.shortlistedApplications || 0}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-neutral-600">In Review</span>
                    <span className="font-bold text-blue-600">{stats?.reviewedApplications || 0}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Rejected</span>
                    <span className="font-bold text-red-600">{stats?.rejectedApplications || 0}</span>
                 </div>
              </div>
           </Card>
        </div>

        {/* Main Form */}
        <div className="lg:col-span-2">
           <Card className="p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-6">Personal Details</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="Full Name" 
                      name="fullName"
                      value={profile?.fullName || ''} 
                      onChange={handleChange}
                      placeholder="e.g. John Doe" 
                    />
                    <Input 
                      label="Phone Number" 
                      name="phone"
                      value={profile?.phone || ''} 
                      onChange={handleChange}
                      placeholder="e.g. +1 (555) 000-0000" 
                    />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Email Address" value={profile?.user?.email || ''} disabled />
                    <Input 
                      label="Location" 
                      name="location"
                      value={profile?.location || ''} 
                      onChange={handleChange}
                      placeholder="e.g. San Francisco, CA" 
                    />
                 </div>
                 <Input 
                   label="Headline" 
                   name="headline"
                   value={profile?.headline || ''} 
                   onChange={handleChange}
                   placeholder="e.g. Senior Frontend Developer" 
                 />
                 
                 <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">About Me / Bio</label>
                    <textarea 
                      name="bio"
                      value={profile?.bio || ''}
                      onChange={handleChange}
                      rows="4" 
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                 </div>

                 <div className="border-t border-neutral-100 pt-6">
                    <h3 className="text-lg font-bold text-neutral-900 mb-6">Professional Information</h3>
                    <div className="space-y-6">
                       <Input 
                         label="Skills (comma separated)" 
                         name="skills"
                         value={profile?.skills || ''} 
                         onChange={handleChange}
                         placeholder="e.g. React, Node.js, TypeScript" 
                       />
                       <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Experience</label>
                          <textarea 
                            name="experience"
                            value={profile?.experience || ''}
                            onChange={handleChange}
                            rows="4" 
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            placeholder="Detail your work history..."
                          ></textarea>
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Education</label>
                          <textarea 
                            name="education"
                            value={profile?.education || ''}
                            onChange={handleChange}
                            rows="4" 
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            placeholder="Detail your educational background..."
                          ></textarea>
                       </div>
                    </div>
                 </div>

                 <div className="flex justify-end space-x-4 border-t border-neutral-100 pt-6">
                    <Button variant="outline" type="button" onClick={() => window.location.reload()}>Cancel</Button>
                    <Button variant="primary" type="submit" loading={saving}>Save Changes</Button>
                 </div>
              </form>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
