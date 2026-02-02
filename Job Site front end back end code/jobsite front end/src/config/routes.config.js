// Route configuration
export const routes = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Job Seeker routes
  JOB_SEEKER_DASHBOARD: '/job-seeker/dashboard',
  JOB_SEEKER_JOBS: '/job-seeker/jobs',
  JOB_SEEKER_JOB_DETAILS: '/job-seeker/jobs/:id',
  JOB_SEEKER_APPLICATIONS: '/job-seeker/applications',
  JOB_SEEKER_PROFILE: '/job-seeker/profile',
  JOB_SEEKER_CV_MANAGER: '/job-seeker/cv-manager',
  JOB_SEEKER_CV_BUILDER: '/job-seeker/cv-builder',
  JOB_SEEKER_SETTINGS: '/job-seeker/settings',
  
  // Employer routes
  EMPLOYER_DASHBOARD: '/employer/dashboard',
  EMPLOYER_JOBS: '/employer/jobs',
  EMPLOYER_POST_JOB: '/employer/jobs/post',
  EMPLOYER_JOB_ANALYTICS: '/employer/jobs/:id/analytics',
  EMPLOYER_APPLICATIONS: '/employer/applications',
  EMPLOYER_COMPANY_PROFILE: '/employer/company-profile',
  EMPLOYER_VERIFICATION: '/employer/verification',
  EMPLOYER_SETTINGS: '/employer/settings',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_EMPLOYERS: '/admin/employers',
  ADMIN_JOBS: '/admin/jobs',
  ADMIN_ANALYTICS: '/admin/analytics',
};
