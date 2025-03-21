import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useStore } from '../store/useStore';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const { checkAuth } = useStore();

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();

    // Check for dark mode preference
    if (typeof window !== 'undefined') {
      const isDarkMode = localStorage.getItem('darkMode') === 'true';
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
  }, [checkAuth]);

  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: 'white',
            },
          },
        }}
      />
      <style jsx global>{`
        :root {
          --toast-bg: #ffffff;
          --toast-color: #1F2937;
        }

        .dark {
          --toast-bg: #1F2937;
          --toast-color: #F3F4F6;
        }

        /* FullCalendar overrides */
        .fc {
          font-family: inherit !important;
        }

        .dark .fc-theme-standard td,
        .dark .fc-theme-standard th {
          border-color: rgba(75, 85, 99, 0.4) !important;
        }

        .dark .fc-theme-standard .fc-scrollgrid {
          border-color: rgba(75, 85, 99, 0.4) !important;
        }

        .dark .fc-theme-standard .fc-highlight {
          background: rgba(59, 130, 246, 0.1) !important;
        }

        /* Scrollbar customization */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }

        .dark ::-webkit-scrollbar-thumb {
          background: #4B5563;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Focus outline */
        *:focus-visible {
          outline: 2px solid #3B82F6;
          outline-offset: 2px;
        }

        .dark *:focus-visible {
          outline-color: #60A5FA;
        }

        /* Loading spinner */
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        /* Transitions */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }

        /* Typography */
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Selection */
        ::selection {
          background-color: #BFDBFE;
          color: #1E3A8A;
        }

        .dark ::selection {
          background-color: #1E3A8A;
          color: #BFDBFE;
        }
      `}</style>
    </>
  );
}

export default MyApp;