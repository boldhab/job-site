import React from 'react';
import PropTypes from 'prop-types';
import { StarIcon } from '@heroicons/react/24/outline';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  ...props 
}) => {
  // Base button classes
  const baseClasses = 'font-semibold rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';
  
  // Variant classes using amber/gold palette
  const variants = {
    primary: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white border-transparent shadow-lg hover:shadow-xl hover:shadow-amber-500/25 transform hover:-translate-y-0.5 focus:ring-amber-500',
    secondary: 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border-amber-200 hover:bg-gradient-to-r hover:from-amber-200 hover:to-amber-100 hover:border-amber-300 focus:ring-amber-400',
    outline: 'bg-transparent text-amber-700 border-amber-300 hover:bg-amber-50/50 hover:border-amber-400 focus:ring-amber-400',
    ghost: 'bg-transparent text-neutral-700 hover:text-amber-800 hover:bg-amber-50/50 border-transparent focus:ring-amber-400',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-transparent shadow-lg hover:shadow-xl hover:shadow-red-500/25 focus:ring-red-500',
  };
  
  // Size classes with consistent spacing
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };
  
  // Build classes array
  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
    loading ? 'cursor-wait' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button 
      type={type}
      className={classes} 
      disabled={disabled || loading} 
      {...props}
    >
      {loading ? (
        <>
          <svg 
            className="animate-spin mr-3 h-5 w-5 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  children: PropTypes.node.isRequired,
};

export default Button;