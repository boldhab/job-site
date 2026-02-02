// Job Seeker routes
import { Routes, Route } from 'react-router-dom';
import RoleGuard from '../guards/RoleGuard';
import { ROLES } from '../constants/roles';
import Dashboard from '../pages/JobSeeker/Dashboard';
import JobList from '../pages/JobSeeker/Jobs/JobList';
import JobDetails from '../pages/JobSeeker/Jobs/JobDetails';
import MyApplications from '../pages/JobSeeker/Applications/MyApplications';
import ApplicationStatus from '../pages/JobSeeker/Applications/ApplicationStatus';
import Profile from '../pages/JobSeeker/Profile/Profile';
import CVManager from '../pages/JobSeeker/Profile/CVManager';
import CVBuilder from '../pages/JobSeeker/Profile/CVBuilder';
import Settings from '../pages/JobSeeker/Settings';
import ApplicationForm from '../pages/JobSeeker/Jobs/ApplicationForm';

const JobSeekerRoutes = () => {
  return (
    <RoleGuard allowedRoles={[ROLES.JOB_SEEKER]}>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="jobs" element={<JobList />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="jobs/:jobId/apply" element={<ApplicationForm />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="applications/:id" element={<ApplicationStatus />} />
        <Route path="profile" element={<Profile />} />
        <Route path="cv-manager" element={<CVManager />} />
        <Route path="cv-builder" element={<CVBuilder />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </RoleGuard>
  );
};

export default JobSeekerRoutes;
