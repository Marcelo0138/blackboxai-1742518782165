import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { LoadingButton } from './Loading';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actionLabel,
  onAction,
  cancelLabel = 'Cancelar',
  loading = false,
  danger = false,
  size = 'md',
  hideActions = false,
}) => {
  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
    '4xl': 'sm:max-w-4xl',
    '5xl': 'sm:max-w-5xl',
    full: 'sm:max-w-full'
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className={`inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} sm:w-full sm:p-6`}>
              <div>
                {title && (
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                  >
                    {title}
                  </Dialog.Title>
                )}
                <div className="mt-2">{children}</div>
              </div>

              {!hideActions && (
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  {actionLabel && (
                    <LoadingButton
                      loading={loading}
                      onClick={onAction}
                      className={`w-full sm:col-start-2 ${
                        danger
                          ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                          : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                      }`}
                    >
                      {actionLabel}
                    </LoadingButton>
                  )}
                  <button
                    type="button"
                    className="mt-3 sm:mt-0 w-full sm:col-start-1 inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    onClick={onClose}
                  >
                    {cancelLabel}
                  </button>
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
  danger = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      actionLabel={confirmLabel}
      onAction={onConfirm}
      cancelLabel={cancelLabel}
      loading={loading}
      danger={danger}
      size="sm"
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </Modal>
  );
};

export const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  closeLabel = 'Fechar',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      cancelLabel={closeLabel}
      hideActions={false}
      size="sm"
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </Modal>
  );
};

export default Modal;