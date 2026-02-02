import React from 'react';
import PropTypes from 'prop-types';
import { 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const Toast = ({ 
  message, 
  type = 'info', 
  onClose,
  title,
  showIcon = true,
  autoClose = true,
  duration = 5000,
  position = 'bottom-right',
  action,
  actionLabel,
  onAction,
  className = '',
}) => {
  // Type configurations
  const typeConfig = {
    info: {
      bg: 'bg-gradient-to-r from-blue-50/90 to-blue-100/50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <InformationCircleIcon className="w-5 h-5" />,
      accent: 'from-blue-400 to-blue-500',
    },
    success: {
      bg: 'bg-gradient-to-r from-emerald-50/90 to-green-100/50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      icon: <CheckCircleIcon className="w-5 h-5" />,
      accent: 'from-emerald-400 to-emerald-500',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50/90 to-red-100/50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <ExclamationCircleIcon className="w-5 h-5" />,
      accent: 'from-red-400 to-red-500',
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-50/90 to-orange-100/50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: <ExclamationTriangleIcon className="w-5 h-5" />,
      accent: 'from-amber-400 to-amber-500',
    },
    brand: {
      bg: 'bg-gradient-to-r from-amber-50/90 to-orange-100/50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: <RocketLaunchIcon className="w-5 h-5" />,
      accent: 'from-amber-600 to-amber-700',
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  // Auto-close effect
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`fixed ${positionClasses[position]} z-50 animate-slide-in`}
    >
      <div 
        className={`relative max-w-sm w-full rounded-2xl border-2 ${config.border} ${config.bg} shadow-2xl backdrop-blur-sm overflow-hidden ${className}`}
      >
        {/* Accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.accent}`} />
        
        {/* Progress bar for auto-close */}
        {autoClose && onClose && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current/30 to-transparent">
            <div 
              className="h-full bg-current/20 transition-all duration-100 ease-linear"
              style={{ 
                width: '100%',
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            {showIcon && (
              <div className={`p-2.5 rounded-xl ${config.text}/20 flex-shrink-0`}>
                <div className={config.text}>
                  {config.icon}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className={`text-sm font-bold ${config.text} mb-1`}>
                  {title}
                </h4>
              )}
              <div className={`text-sm font-medium ${config.text}/90`}>
                {message}
              </div>
              
              {/* Action Button */}
              {action && actionLabel && onAction && (
                <button
                  onClick={onAction}
                  className={`mt-3 px-4 py-1.5 text-xs font-semibold rounded-xl border-2 ${config.border} ${config.text} hover:bg-white/30 transition-colors duration-200`}
                >
                  {actionLabel}
                </button>
              )}
            </div>

            {/* Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                aria-label="Close notification"
                className={`p-1.5 rounded-xl ${config.text}/30 hover:${config.text}/50 hover:bg-white/30 transition-all duration-200 flex-shrink-0`}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animation for progress bar */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  type: PropTypes.oneOf(['info', 'success', 'error', 'warning', 'brand']),
  onClose: PropTypes.func,
  title: PropTypes.string,
  showIcon: PropTypes.bool,
  autoClose: PropTypes.bool,
  duration: PropTypes.number,
  position: PropTypes.oneOf(['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center']),
  action: PropTypes.bool,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  className: PropTypes.string,
};

Toast.defaultProps = {
  type: 'info',
  showIcon: true,
  autoClose: true,
  duration: 5000,
  position: 'bottom-right',
  action: false,
};

export default Toast;