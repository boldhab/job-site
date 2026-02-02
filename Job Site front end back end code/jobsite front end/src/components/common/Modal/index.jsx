import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  ariaLabel,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  padding = 'medium',
  showHeader = true,
  footer,
  ...props 
}) => {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    medium: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    full: 'max-w-4xl',
  };

  // Padding classes
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
    xlarge: 'p-10',
  };

  const sizeClass = sizeClasses[size] || sizeClasses.medium;
  const paddingClass = paddingClasses[padding] || paddingClasses.medium;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title}
      {...props}
    >
      {/* Overlay */}
      <div 
        className={`fixed inset-0 transition-opacity duration-300 ${
          isOpen 
            ? 'bg-black/60 backdrop-blur-sm' 
            : 'bg-transparent'
        }`}
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div 
        ref={modalRef}
        tabIndex="-1"
        className={`relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-amber-100 w-full ${sizeClass} transform transition-all duration-300 ${
          isOpen 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top decorative line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 rounded-t-3xl"></div>
        
        {/* Header */}
        {showHeader && (
          <div className="flex items-center justify-between px-8 py-6 border-b-2 border-amber-100">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent">
                {title}
              </h3>
              {ariaLabel && !title && (
                <span className="sr-only">{ariaLabel}</span>
              )}
            </div>
            
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-xl text-neutral-500 hover:text-amber-700 hover:bg-amber-50 transition-colors duration-200 border-2 border-transparent hover:border-amber-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className={`${paddingClass} ${showHeader ? '' : 'pt-8'}`}>
          {children}
        </div>
        
        {/* Footer (optional) */}
        {footer && (
          <div className="px-8 py-6 border-t-2 border-amber-100 bg-gradient-to-r from-amber-50/30 to-orange-50/30 rounded-b-3xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'medium', 'lg', 'xl', 'full']),
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large', 'xlarge']),
  showHeader: PropTypes.bool,
  footer: PropTypes.node,
};

Modal.defaultProps = {
  size: 'medium',
  showCloseButton: true,
  closeOnOverlayClick: true,
  padding: 'medium',
  showHeader: true,
};

export default Modal;