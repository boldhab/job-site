// Role guard - protects routes based on user role
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { mapBackendRoleToFrontend } from '../utils/helpers';

const RoleGuard = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();


  if (loading) {
    return <div>Loading...</div>;
  }
  
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Normalize role coming from backend (e.g. 'ADMIN', {name:'ADMIN'}, etc.)
  const normalizedRole = mapBackendRoleToFrontend(user.role) || user.role;

  if (!allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleGuard;
