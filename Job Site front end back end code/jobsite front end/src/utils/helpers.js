// Helper utilities
export const helpers = {
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle: (func, limit) => {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
};

/**
 * Map backend role enum to frontend role string
 * Backend uses: JOB_SEEKER, EMPLOYER, ADMIN
 * Frontend uses: job_seeker, employer, admin
 */
export const mapBackendRoleToFrontend = (backendRole) => {
  if (!backendRole) return null;

  // Handle array of roles (common in some backends)
  let roleData = Array.isArray(backendRole) ? backendRole[0] : backendRole;

  // Extract role string from various possible formats
  let roleStr = typeof roleData === 'string'
    ? roleData
    : (roleData?.name || roleData?.role || roleData?.authority || JSON.stringify(roleData));

  if (typeof roleStr !== 'string') return 'job_seeker'; // Final fallback

  // Normalize: remove ROLE_ prefix and map to lowercase
  const normalized = roleStr.replace('ROLE_', '').toUpperCase();

  const roleMap = {
    'ADMIN': 'admin',
    'EMPLOYER': 'employer',
    'JOB_SEEKER': 'job_seeker',
    'USER': 'job_seeker',
    'CUSTOMER': 'job_seeker',
  };

  return roleMap[normalized] || normalized.toLowerCase();
};

/**
 * Get dashboard route based on user role
 */
export const getDashboardRoute = (role) => {
  const roleMap = {
    'job_seeker': '/job-seeker/dashboard',
    'employer': '/employer/dashboard',
    'admin': '/admin/dashboard',
  };

  return roleMap[role] || '/job-seeker/dashboard';
};