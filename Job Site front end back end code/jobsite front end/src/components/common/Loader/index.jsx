import React from 'react';
import PropTypes from 'prop-types';
import { StarIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

const Loader = ({ 
  size = 'medium', 
  label = 'Loading', 
  variant = 'spinner',
  color = 'amber',
  fullWidth = false,
  className = '',
}) => {
  // Size mappings
  const sizeMap = {
    xs: 'h-3 w-3',
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-10 w-10',
    xl: 'h-12 w-12',
  };

  // Color mappings
  const colorMap = {
    amber: 'text-amber-600',
    white: 'text-white',
    neutral: 'text-neutral-600',
    emerald: 'text-emerald-600',
    blue: 'text-blue-600',
    red: 'text-red-600',
  };

  const s = sizeMap[size] || sizeMap.medium;
  const c = colorMap[color] || colorMap.amber;

  // Variant components
  const variants = {
    spinner: (
      <svg 
        className={`${s} ${c} animate-spin`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        aria-hidden="true"
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
    ),
    dots: (
      <div className="flex items-center justify-center space-x-1">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={`${s.replace('h-', 'h-2 ').replace('w-', 'w-2 ')} bg-gradient-to-r from-amber-500 to-amber-600 rounded-full animate-pulse`}
            style={{ 
              animationDelay: `${dot * 150}ms`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    ),
    ring: (
      <div className="relative">
        <svg 
          className={`${s} animate-spin`} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
            strokeDasharray="60"
            strokeDashoffset="50"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <RocketLaunchIcon className={`${s.replace('h-', 'h-1/2 ').replace('w-', 'w-1/2 ')} ${c} animate-pulse`} />
        </div>
      </div>
    ),
    pulse: (
      <div className="relative">
        <div className={`${s} ${c} animate-ping absolute inset-0 opacity-75 bg-current rounded-full`} />
        <div className={`${s} ${c} relative rounded-full bg-current opacity-20`} />
      </div>
    ),
    brand: (
      <div className="relative">
        <div className={`${s} bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl animate-pulse shadow-lg`} />
        <StarIcon className={`${s.replace('h-', 'h-1/2 ').replace('w-', 'w-1/2 ')} text-white absolute inset-0 m-auto animate-spin`} />
      </div>
    ),
  }; 

  const variantComponent = variants[variant] || variants.spinner;

  return (
    <div 
      role="status" 
      aria-live="polite" 
      className={`flex items-center justify-center ${fullWidth ? 'w-full py-8' : ''} ${className}`}
    >
      <div className="relative">
        {variantComponent}
        <span className="sr-only">{label}</span>
      </div>
      {/* Optional visible label for larger loaders */}
      {(size === 'large' || size === 'xl') && variant !== 'brand' && (
        <span className="ml-3 text-sm font-semibold text-amber-700 animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(['xs', 'small', 'medium', 'large', 'xl']),
  label: PropTypes.string,
  variant: PropTypes.oneOf(['spinner', 'dots', 'ring', 'pulse', 'brand']),
  color: PropTypes.oneOf(['amber', 'white', 'neutral', 'emerald', 'blue', 'red']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};

Loader.defaultProps = {
  size: 'medium',
  label: 'Loading',
  variant: 'spinner',
  color: 'amber',
  fullWidth: false,
};

export default Loader;