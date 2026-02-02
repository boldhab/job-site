// Role-based access configuration
export const roles = {
  ADMIN: 'admin',
  EMPLOYER: 'employer',
  JOB_SEEKER: 'job_seeker',
};

export const rolePermissions = {
  [roles.ADMIN]: ['*'],
  [roles.EMPLOYER]: ['manage_jobs', 'view_applications', 'manage_company'],
  [roles.JOB_SEEKER]: ['apply_jobs', 'manage_profile', 'manage_cv'],
};
