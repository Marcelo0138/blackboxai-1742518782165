import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';

const Search = ({
  onSearch,
  placeholder = 'Pesquisar...',
  debounceTime = 300,
  className = '',
  autoFocus = false,
  minLength = 2
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, debounceTime);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= minLength) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch, minLength]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={placeholder}
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export const SearchWithFilters = ({
  onSearch,
  filters,
  onFilterChange,
  placeholder = 'Pesquisar...',
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <Search onSearch={onSearch} placeholder={placeholder} />
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              filter.active
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {filter.label}
            {filter.count !== undefined && (
              <span className="ml-2 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full px-2 py-0.5">
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export const SearchWithSuggestions = ({
  onSearch,
  suggestions,
  onSuggestionClick,
  loading = false,
  placeholder = 'Pesquisar...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <Search
        onSearch={(term) => {
          onSearch(term);
          setIsOpen(!!term);
        }}
        placeholder={placeholder}
      />

      {isOpen && (suggestions.length > 0 || loading) && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md ring-1 ring-black ring-opacity-5">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Carregando...
            </div>
          ) : (
            <ul className="max-h-60 overflow-auto py-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    onSuggestionClick(suggestion);
                    setIsOpen(false);
                  }}
                  className="cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {suggestion.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;