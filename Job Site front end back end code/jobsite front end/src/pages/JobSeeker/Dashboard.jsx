import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { BriefcaseIcon, ClipboardDocumentListIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/application.service';
import { jobService } from '../../services/job.service';
import { profileService } from '../../services/profile.service';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const [apps, jobs, statistics] = await Promise.all([
          applicationService.getByJobSeeker(),
          jobService.getAll(),
          profileService.getStatistics()
        ]);
        setApplications(Array.isArray(apps) ? apps : []);
        setRecommended(Array.isArray(jobs) ? jobs.slice(0, 5) : []);
        setStats(statistics);
      } catch (err) {
        console.error('Failed to load jobseeker dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Job Seeker Dashboard</h1>
        <p className="text-neutral-600">Welcome back! Here's what's happening with your job search.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg text-primary-600 mr-4">
              <ClipboardDocumentListIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Total Applications</p>
              <h3 className="text-2xl font-bold text-neutral-900">{loading ? '—' : (stats?.totalApplications ?? 0)}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
             <div className="p-3 bg-green-100 rounded-lg text-green-600 mr-4">
              <UserCircleIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Approved / Hired</p>
              <h3 className="text-2xl font-bold text-neutral-900">{loading ? '—' : (stats?.hiredApplications ?? 0)}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
           <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg text-red-600 mr-4">
              <BriefcaseIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Rejected</p>
              <h3 className="text-2xl font-bold text-neutral-900">{loading ? '—' : (stats?.rejectedApplications ?? 0)}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Recent Applications</h2>
           <div className="space-y-4">
            {loading ? (
              <div className="text-center text-neutral-500 py-6">Loading applications…</div>
            ) : applications.length === 0 ? (
              <div className="text-center text-neutral-500 py-6">No recent applications</div>
            ) : (
              applications.slice(0, 5).map((app) => (
               <div key={app.id} className="flex items-center justify-between p-4 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors">
                 <div>
                   <h4 className="font-medium text-neutral-900">{app.jobTitle ?? app.job?.title}</h4>
                   <p className="text-sm text-neutral-500">{app.companyName ?? app.job?.employerName}</p>
                 </div>
                 <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                   {app.status ?? 'Applied'}
                 </span>
               </div>
             ))
            )}
           </div>
           <div className="mt-4 text-center">
              <Link to="/job-seeker/applications">
                 <Button variant="ghost" size="small">View All Applications</Button>
              </Link>
           </div>
        </Card>

         <Card className="p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Recommended Jobs</h2>
            <div className="space-y-4">
            {loading ? (
              <div className="text-center text-neutral-500 py-6">Loading jobs…</div>
            ) : recommended.length === 0 ? (
              <div className="text-center text-neutral-500 py-6">No recommended jobs</div>
            ) : (
              recommended.map((job) => (
               <div key={job.id} className="flex items-center justify-between p-4 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors">
                 <div>
                   <h4 className="font-medium text-neutral-900">{job.title}</h4>
                   <p className="text-sm text-neutral-500">{job.employerName ?? job.company ?? job.location}</p>
                 </div>
                 <Link to={`/job-seeker/jobs/${job.id}`}>
                   <Button variant="outline" size="small">View</Button>
                 </Link>
               </div>
              ))
            )}
           </div>
           <div className="mt-4 text-center">
              <Link to="/job-seeker/jobs">
                 <Button variant="ghost" size="small">Browse All Jobs</Button>
              </Link>
           </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
