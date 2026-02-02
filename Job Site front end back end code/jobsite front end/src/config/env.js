// Environment configuration
export const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  appName: process.env.REACT_APP_NAME || 'Job Board',
  environment: process.env.NODE_ENV || 'development',
};
