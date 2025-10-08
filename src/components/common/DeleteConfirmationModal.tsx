import React, { useState } from 'react';
import { X, AlertTriangle, Trash2, UserX } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (hardDelete: boolean) => void;
  title: string;
  message: string;
  entityName: string;
  entityType: 'agent' | 'client' | 'invoice' | 'subscription' | 'service' | 'payment';
  isLoading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  entityName,
  entityType,
  isLoading = false,
}) => {
  const [hardDelete, setHardDelete] = useState(false);

  const handleConfirm = () => {
    onConfirm(hardDelete);
  };

  const handleClose = () => {
    setHardDelete(false);
    onClose();
  };

  const getEntityIcon = () => {
    switch (entityType) {
      case 'agent':
        return <UserX className="h-6 w-6 text-red-500" />;
      case 'client':
        return <UserX className="h-6 w-6 text-red-500" />;
      case 'invoice':
        return <Trash2 className="h-6 w-6 text-red-500" />;
      case 'subscription':
        return <Trash2 className="h-6 w-6 text-red-500" />;
      case 'service':
        return <Trash2 className="h-6 w-6 text-red-500" />;
      case 'payment':
        return <Trash2 className="h-6 w-6 text-red-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
    }
  };

  const getDeleteTypeDescription = () => {
    if (hardDelete) {
      return (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Hard Delete Selected
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                This will permanently remove all data and cannot be undone. This action is irreversible.
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Soft Delete Selected
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                This will deactivate the account but preserve all data. The account can be reactivated later.
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {getEntityIcon()}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-fg">
                {title}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-muted hover:text-gray-600 dark:hover:text-muted transition-colors"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 dark:text-muted mb-4">
              {message}
            </p>

            {/* Entity Name */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-muted">Entity to delete:</p>
              <p className="font-medium text-gray-900 dark:text-fg">{entityName}</p>
            </div>

            {/* Delete Type Selection */}
            <div className="mb-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hardDelete}
                  onChange={(e) => setHardDelete(e.target.checked)}
                  className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-fg">
                    Permanently delete (Hard Delete)
                  </span>
                  <p className="text-sm text-gray-500 dark:text-muted mt-1">
                    Check this box to permanently remove all data. Leave unchecked for soft delete (deactivation).
                  </p>
                </div>
              </label>
            </div>

            {/* Delete Type Description */}
            {getDeleteTypeDescription()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-muted bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium text-fg rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                hardDelete
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {hardDelete ? <Trash2 className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                  <span>{hardDelete ? 'Permanently Delete' : 'Deactivate'}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
