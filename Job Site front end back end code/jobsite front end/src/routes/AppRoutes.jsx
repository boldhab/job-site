import { Navigate } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import JobSeekerRoutes from './JobSeekerRoutes';
import EmployerRoutes from './EmployerRoutes';
import AdminRoutes from './AdminRoutes';
import { RoleRedirect } from '../components/common/RoleRedirect';

const routesConfig = [
  { path: '/job-seeker/*', element: <JobSeekerRoutes /> },
  { path: '/employer/*', element: <EmployerRoutes /> },
  { path: '/admin/*', element: <AdminRoutes /> },
  
  // Redirects for common unprefixed routes
  { path: '/applications', element: <RoleRedirect target="applications" /> },
  { path: '/profile', element: <RoleRedirect target="profile" /> },
  { path: '/settings', element: <RoleRedirect target="settings" /> },
  { path: '/dashboard', element: <RoleRedirect target="dashboard" /> },
  
  { path: '/*', element: <PublicRoutes /> },
];

export default routesConfig;
