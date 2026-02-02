// Data formatters
export const formatters = {
  date: (date) => {
    return new Date(date).toLocaleDateString();
  },
  
  currency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },
  
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  truncate: (str, length) => {
    return str.length > length ? str.substring(0, length) + '...' : str;
  },
};
