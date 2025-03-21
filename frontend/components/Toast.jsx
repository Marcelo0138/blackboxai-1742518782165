import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const showToast = {
  success: (message) => {
    toast.success(message, {
      duration: 4000,
      position: 'bottom-right',
      style: {
        background: 'var(--toast-bg)',
        color: 'var(--toast-color)',
      },
      icon: '✅',
    });
  },

  error: (message) => {
    toast.error(message, {
      duration: 5000,
      position: 'bottom-right',
      style: {
        background: 'var(--toast-bg)',
        color: 'var(--toast-color)',
      },
      icon: '❌',
    });
  },

  warning: (message) => {
    toast(message, {
      duration: 4000,
      position: 'bottom-right',
      style: {
        background: 'var(--toast-bg)',
        color: 'var(--toast-color)',
        border: '1px solid var(--toast-warning-border)',
      },
      icon: '⚠️',
    });
  },

  info: (message) => {
    toast(message, {
      duration: 3000,
      position: 'bottom-right',
      style: {
        background: 'var(--toast-bg)',
        color: 'var(--toast-color)',
        border: '1px solid var(--toast-info-border)',
      },
      icon: 'ℹ️',
    });
  },

  promise: async (promise, messages) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Carregando...',
        success: messages.success || 'Operação concluída!',
        error: messages.error || 'Ocorreu um erro.',
      },
      {
        style: {
          background: 'var(--toast-bg)',
          color: 'var(--toast-color)',
        },
        success: {
          duration: 4000,
          icon: '✅',
        },
        error: {
          duration: 5000,
          icon: '❌',
        },
      }
    );
  },

  custom: (message, options = {}) => {
    return toast(message, {
      duration: options.duration || 3000,
      position: options.position || 'bottom-right',
      style: {
        background: 'var(--toast-bg)',
        color: 'var(--toast-color)',
        ...options.style,
      },
      icon: options.icon,
    });
  },
};

const Toast = ({ message, type = 'info', duration, onClose }) => {
  useEffect(() => {
    const toastFunction = showToast[type] || showToast.info;
    const toastId = toastFunction(message);

    if (duration) {
      const timer = setTimeout(() => {
        toast.dismiss(toastId);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, type, duration, onClose]);

  return null;
};

export const ToastContainer = () => {
  return (
    <div>
      <style jsx global>{`
        :root {
          --toast-bg: #ffffff;
          --toast-color: #1F2937;
          --toast-warning-border: #F59E0B;
          --toast-info-border: #3B82F6;
        }

        .dark {
          --toast-bg: #1F2937;
          --toast-color: #F3F4F6;
          --toast-warning-border: #B45309;
          --toast-info-border: #2563EB;
        }

        .toast-container {
          z-index: 9999;
        }

        .toast {
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                     0 2px 4px -1px rgba(0, 0, 0, 0.06);
          margin-bottom: 1rem;
          max-width: 350px;
          width: 100%;
        }

        .toast-success {
          border-left: 4px solid #10B981;
        }

        .toast-error {
          border-left: 4px solid #EF4444;
        }

        .toast-warning {
          border-left: 4px solid #F59E0B;
        }

        .toast-info {
          border-left: 4px solid #3B82F6;
        }

        .toast-icon {
          margin-right: 0.75rem;
          flex-shrink: 0;
        }

        .toast-message {
          flex-grow: 1;
          font-size: 0.875rem;
          line-height: 1.25rem;
        }

        .toast-close {
          margin-left: 0.75rem;
          flex-shrink: 0;
          cursor: pointer;
          opacity: 0.5;
          transition: opacity 0.2s;
        }

        .toast-close:hover {
          opacity: 1;
        }

        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: rgba(0, 0, 0, 0.1);
        }

        .toast-progress-bar {
          height: 100%;
          background-color: currentColor;
          transition: width 0.1s linear;
        }
      `}</style>
    </div>
  );
};

export default Toast;