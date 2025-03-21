import Link from 'next/link';
import { LoadingButton } from './Loading';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  href,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';

  // Size variations
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm leading-4',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base'
  };

  // Variant variations
  const variantClasses = {
    primary: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400',
    secondary: 'text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500 disabled:bg-blue-50 dark:text-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800',
    outline: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-100 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400',
    success: 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-400',
    warning: 'text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 disabled:bg-yellow-400',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-200 dark:hover:bg-gray-700',
    link: 'text-blue-600 hover:text-blue-700 underline focus:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
  };

  // Loading state
  if (loading) {
    return (
      <LoadingButton
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        disabled={true}
        {...props}
      >
        {children}
      </LoadingButton>
    );
  }

  // Link variant
  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
          disabled ? 'pointer-events-none opacity-50' : ''
        } ${className}`}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // Regular button
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export const ButtonGroup = ({ children, className = '' }) => {
  return (
    <div className={`inline-flex rounded-md shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export const IconButton = ({
  icon,
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3'
  };

  const iconSizes = {
    xs: 'h-4 w-4',
    sm: 'h-5 w-5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-6 w-6'
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      loading={loading}
      className={`${sizeClasses[size]} ${className}`}
      aria-label={label}
      {...props}
    >
      <span className={iconSizes[size]}>{icon}</span>
    </Button>
  );
};

export const FloatingActionButton = ({
  icon,
  label,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  return (
    <IconButton
      icon={icon}
      label={label}
      variant={variant}
      size={size}
      disabled={disabled}
      loading={loading}
      className={`fixed bottom-4 right-4 rounded-full shadow-lg ${className}`}
      {...props}
    />
  );
};

export default Button;