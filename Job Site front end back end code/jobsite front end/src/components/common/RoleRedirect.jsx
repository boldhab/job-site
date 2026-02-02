import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const RoleRedirect = ({ target }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.toLowerCase();
  let prefix = '';
  let finalTarget = target;

  switch (role) {
    case 'employer':
      prefix = '/employer';
      if (finalTarget === 'profile') finalTarget = 'company-profile';
      break;
    case 'job_seeker':
      prefix = '/job-seeker';
      break;
    case 'admin':
      prefix = '/admin';
      break;
    default:
      return <Navigate to="/" replace />;
  }

  return <Navigate to={`${prefix}/${finalTarget}`} replace />;
};
