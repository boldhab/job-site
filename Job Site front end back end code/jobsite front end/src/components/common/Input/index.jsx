import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const Input = forwardRef(({ 
  id, 
  label, 
  error, 
  success,
  helperText,
  className = '', 
  icon,
  iconPosition = 'left',
  fullWidth = true,
  size = 'medium',
  ...props 
}, ref) => {
  
  // Base input classes
  const baseClasses = 'rounded-2xl border-2 bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-neutral-400';
  
  // State-based classes
  const stateClasses = error 
    ? 'border-red-300 focus:border-red-400 focus:ring-red-500/30 text-red-900' 
    : success 
    ? 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-500/30 text-emerald-900'
    : 'border-amber-200 focus:border-amber-300 focus:ring-amber-500/30 text-neutral-900 hover:border-amber-300';
  
  // Size classes
  const sizeClasses = {
    small: 'px-4 py-2.5 text-sm',
    medium: 'px-5 py-3.5 text-base',
    large: 'px-6 py-4 text-lg',
  };
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Build input classes
  const inputClasses = [
    baseClasses,
    stateClasses,
    sizeClasses[size],
    widthClass,
    icon && iconPosition === 'left' ? 'pl-12' : '',
    icon && iconPosition === 'right' ? 'pr-12' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={`${fullWidth ? 'w-full' : 'inline-block'}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-semibold text-neutral-800 mb-2"
        >
          {label}
          {props.required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            {React.cloneElement(icon, {
              className: `w-5 h-5 ${error ? 'text-red-500' : success ? 'text-emerald-500' : 'text-amber-500'}`
            })}
          </div>
        )}
        
        {/* Input Field */}
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : success ? `${id}-success` : helperText ? `${id}-helper` : undefined}
          className={inputClasses}
          {...props}
        />
        
        {/* Right Icon (Error/Success/Icon) */}
        {(error || success || (icon && iconPosition === 'right')) && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {error ? (
              <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
            ) : success ? (
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              icon && iconPosition === 'right' && React.cloneElement(icon, {
                className: `w-5 h-5 text-amber-500`
              })
            )}
          </div>
        )}
      </div>
      
      {/* Helper Text / Error Message */}
      {(error || success || helperText) && (
        <div 
          id={error ? `${id}-error` : success ? `${id}-success` : `${id}-helper`}
          className={`mt-2 text-sm flex items-center gap-1.5 ${
            error ? 'text-red-600' : 
            success ? 'text-emerald-600' : 
            'text-amber-700'
          }`}
        >
          {error && <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />}
          {success && (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <span className="font-medium">
            {error || success || helperText}
          </span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  success: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
  icon: PropTypes.element,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  required: PropTypes.bool,
};

Input.defaultProps = {
  size: 'medium',
  fullWidth: true,
  iconPosition: 'left',
};

export default Input;