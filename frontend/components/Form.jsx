import { useState } from 'react';
import { LoadingButton } from './Loading';

export const FormInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="mt-1">
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`appearance-none block w-full px-3 py-2 border ${
            error
              ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed sm:text-sm ${
            disabled ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
          } dark:bg-gray-700`}
          {...props}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export const FormTextarea = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  rows = 3,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="mt-1">
        <textarea
          name={name}
          id={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`appearance-none block w-full px-3 py-2 border ${
            error
              ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed sm:text-sm ${
            disabled ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
          } dark:bg-gray-700`}
          {...props}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export const FormSelect = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="mt-1">
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
            disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-700'
          }`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export const FormCheckbox = ({
  label,
  name,
  checked,
  onChange,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          name={name}
          id={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        {label && (
          <label
            htmlFor={name}
            className={`font-medium ${
              disabled ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-200'
            } cursor-pointer`}
          >
            {label}
          </label>
        )}
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    </div>
  );
};

export const FormRadioGroup = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      )}
      <div className="mt-2 space-y-4">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              name={name}
              id={`${name}-${option.value}`}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              disabled={disabled}
              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 ${
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              {...props}
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className={`ml-3 block text-sm font-medium ${
                disabled ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-200'
              } cursor-pointer`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export const FormSubmitButton = ({ loading, children, ...props }) => {
  return (
    <LoadingButton
      type="submit"
      loading={loading}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      {...props}
    >
      {children}
    </LoadingButton>
  );
};

export const Form = ({ onSubmit, children, className = '' }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};

export default Form;