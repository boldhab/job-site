// Error handler utility
export const errorHandler = {
  handle: (error) => {
    if (error.response) {
      // Server responded with error status
      return error.response.data?.message || 'An error occurred';
    } else if (error.request) {
      // Request made but no response
      return 'Network error. Please check your connection.';
    } else {
      // Something else happened
      return error.message || 'An unexpected error occurred';
    }
  },
  
  log: (error, context) => {
    console.error(`Error in ${context}:`, error);
  },
};
