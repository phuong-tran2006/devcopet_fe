import React from 'react';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const iconButtonClasses = cva(
  'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-full',
  {
    variants: {
      variant: {
        primary: 'bg-primary-teal text-white hover:bg-opacity-90 focus:ring-primary-teal',
        secondary: 'bg-background-card text-text-primary border border-border-primary hover:bg-background-secondary focus:ring-primary-teal-light',
        ghost: 'bg-transparent text-text-primary hover:bg-background-card focus:ring-primary-teal-light',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
      },
      size: {
        small: 'w-8 h-8 p-1.5',
        medium: 'w-10 h-10 p-2',
        large: 'w-12 h-12 p-3',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'medium',
    },
  }
);

const IconButton = ({
  icon,
  variant,
  size,
  disabled = false,
  className,
  onClick,
  type = "button",
  ariaLabel,
  ...props
}) => {
  const handleClick = (event) => {
    if (disabled) return;
    if (typeof onClick === 'function') {
      onClick(event);
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={twMerge(
        iconButtonClasses({ variant, size }),
        'hover:scale-105 active:scale-95',
        className
      )}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;