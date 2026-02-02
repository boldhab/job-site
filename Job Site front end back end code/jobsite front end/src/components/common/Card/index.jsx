import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  variant = 'default',
  padding = 'medium',
  border = true,
  shadow = 'default',
  ...props 
}) => {
  // Base card classes
  const baseClasses = 'rounded-3xl transition-all duration-300 bg-white/80 backdrop-blur-sm';
  
  // Variant styles
  const variants = {
    default: 'border-2 border-amber-100',
    elevated: 'border-2 border-amber-100 shadow-lg',
    gradient: 'bg-gradient-to-br from-amber-50/80 to-orange-50/50 border-2 border-amber-100',
    glass: 'bg-white/90 backdrop-blur-sm border border-amber-100/50',
  };
  
  // Padding sizes
  const paddings = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
    xlarge: 'p-10',
  };
  
  // Shadow variants
  const shadows = {
    none: '',
    default: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg',
    xlarge: 'shadow-xl',
  };
  
  // Border classes
  const borderClasses = border ? '' : 'border-0';
  
  // Hover effects
  const hoverClasses = hover 
    ? 'hover:shadow-xl hover:-translate-y-1 hover:border-amber-300/50 hover:bg-white/90' 
    : '';
  
  // Build classes array
  const classes = [
    baseClasses,
    variants[variant],
    paddings[padding],
    shadows[shadow],
    borderClasses,
    hoverClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'elevated', 'gradient', 'glass']),
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large', 'xlarge']),
  border: PropTypes.bool,
  shadow: PropTypes.oneOf(['none', 'default', 'medium', 'large', 'xlarge']),
};

Card.defaultProps = {
  variant: 'default',
  padding: 'medium',
  border: true,
  shadow: 'default',
};

export default Card;