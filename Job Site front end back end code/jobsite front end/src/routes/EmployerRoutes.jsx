// Employer routes
import { Routes, Route } from 'react-router-dom';
import RoleGuard from '../guards/RoleGuard';
import { ROLES } from '../constants/roles';
import Dashboard from '../pages/Employer/Dashboard';
import MyJobs from '../pages/Employer/Jobs/MyJobs';
import PostJob from '../pages/Employer/Jobs/PostJob';
import JobAnalytics from '../pages/Employer/Jobs/JobAnalytics';
import ReceivedApplications from '../pages/Employer/Applications/ReceivedApplications';
import ManageApplication from '../pages/Employer/Applications/ManageApplication';
import CompanyProfile from '../pages/Employer/Profile/CompanyProfile';
import Verification from '../pages/Employer/Profile/Verification';
import Settings from '../pages/Employer/Settings';

const EmployerRoutes = () => {
  return (
    <RoleGuard allowedRoles={[ROLES.EMPLOYER]}>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="jobs" element={<MyJobs />} />
        <Route path="jobs/post" element={<PostJob />} />
        <Route path="jobs/:id/analytics" element={<JobAnalytics />} />
        <Route path="applications" element={<ReceivedApplications />} />
        <Route path="applications/:id" element={<ManageApplication />} />
        <Route path="company-profile" element={<CompanyProfile />} />
        <Route path="verification" element={<Verification />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </RoleGuard>
  );
};

export default EmployerRoutes;
