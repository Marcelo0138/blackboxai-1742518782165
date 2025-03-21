const Loading = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando...</p>
      </div>
    </div>
  );
};

export const LoadingOverlay = ({ message = 'Processando...' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">{message}</p>
        </div>
      </div>
    </div>
  );
};

export const LoadingButton = ({ loading, children, ...props }) => {
  return (
    <button
      disabled={loading}
      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
        props.className || ''
      }`}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Carregando...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export const LoadingCard = ({ height = 'h-32' }) => {
  return (
    <div className={`animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800 ${height}`}>
      <div className="h-full flex items-center justify-center">
        <svg
          className="w-12 h-12 text-gray-300 dark:text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export const LoadingSkeleton = ({ count = 1, className = '' }) => {
  return [...Array(count)].map((_, i) => (
    <div key={i} className={`animate-pulse space-y-4 ${className}`}>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  ));
};

export default Loading;