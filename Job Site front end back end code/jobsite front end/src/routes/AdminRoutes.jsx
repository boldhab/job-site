// Admin routes
import { Routes, Route } from 'react-router-dom';
import RoleGuard from '../guards/RoleGuard';
import { ROLES } from '../constants/roles';
import Dashboard from '../pages/Admin/Dashboard';
import UserManagement from '../pages/Admin/Users/UserManagement';
import UserDetails from '../pages/Admin/Users/UserDetails';
import EmployerApproval from '../pages/Admin/Employers/EmployerApproval';
import JobModeration from '../pages/Admin/Jobs/JobModeration';
import JobReports from '../pages/Admin/Jobs/JobReports';
import Analytics from '../pages/Admin/Analytics';
import Settings from '../pages/Admin/Settings';
import AdminProfile from '../pages/Admin/AdminProfile';

const AdminRoutes = () => {
  return (
    <RoleGuard allowedRoles={[ROLES.ADMIN]}>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="employers" element={<EmployerApproval />} />
        <Route path="jobs" element={<JobModeration />} />
        <Route path="jobs/reports" element={<JobReports />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<AdminProfile />} />
      </Routes>
    </RoleGuard>
  );
};

export default AdminRoutes;
