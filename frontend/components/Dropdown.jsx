import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';

const Dropdown = ({ trigger, items, align = 'right', width = 48 }) => {
  const alignmentClasses = {
    left: 'origin-top-left left-0',
    right: 'origin-top-right right-0',
  };

  const widthClasses = {
    48: 'w-48',
    56: 'w-56',
    64: 'w-64',
    72: 'w-72',
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={Fragment}>{trigger}</Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute z-50 mt-2 ${widthClasses[width]} ${
            alignmentClasses[align]
          } rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <div className="py-1">
            {items.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={index}
                    className="my-1 border-t border-gray-100 dark:border-gray-700"
                  />
                );
              }

              const itemContent = (
                <>
                  {item.icon && (
                    <span className="mr-3 text-gray-400 dark:text-gray-500">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto">{item.badge}</span>
                  )}
                </>
              );

              return (
                <Menu.Item key={index}>
                  {({ active }) => {
                    const className = `${
                      active
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-200'
                    } ${
                      item.danger
                        ? 'text-red-600 dark:text-red-400'
                        : ''
                    } group flex items-center w-full px-4 py-2 text-sm`;

                    if (item.href) {
                      return (
                        <Link href={item.href} className={className}>
                          {itemContent}
                        </Link>
                      );
                    }

                    return (
                      <button
                        type="button"
                        className={className}
                        onClick={item.onClick}
                        disabled={item.disabled}
                      >
                        {itemContent}
                      </button>
                    );
                  }}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export const DropdownButton = ({ children, className = '', ...props }) => {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
      <svg
        className="ml-2 -mr-1 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

export const DropdownIconButton = ({ icon, className = '', ...props }) => {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center p-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};

export const ContextMenu = ({ trigger, items, className = '' }) => {
  return (
    <Dropdown
      trigger={
        <DropdownIconButton
          icon={
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          }
          className={className}
        />
      }
      items={items}
    />
  );
};

export default Dropdown;