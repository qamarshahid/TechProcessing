import React, { useState, useRef } from 'react';
import { useNotifications } from './NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { 
  X, 
  Upload, 
  File, 
  Download, 
  Trash2, 
  AlertCircle,
  Paperclip,
  Image,
  FileText,
  Archive
} from 'lucide-react';

interface FileAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  attachments?: any[];
  onAttachmentsUpdated?: () => void;
}

const FILE_CATEGORIES = [
  { value: 'REQUIREMENTS', label: 'Requirements', icon: FileText },
  { value: 'QUOTE', label: 'Quote', icon: FileText },
  { value: 'CONTRACT', label: 'Contract', icon: FileText },
  { value: 'DELIVERABLE', label: 'Deliverable', icon: File },
  { value: 'REFERENCE', label: 'Reference', icon: Image },
  { value: 'OTHER', label: 'Other', icon: Archive }
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain', 'application/zip', 'application/x-rar-compressed'
];

export function FileAttachmentModal({ 
  isOpen, 
  onClose, 
  requestId, 
  attachments = [],
  onAttachmentsUpdated 
}: FileAttachmentModalProps) {
  const { showError, showSuccess } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadForm, setUploadForm] = useState({
    category: 'REQUIREMENTS',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }
    
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'File type not supported. Please upload images, documents, or archives.';
    }
    
    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setErrors({ file: error });
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setErrors({});
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrors({ file: 'Please select a file to upload' });
      return;
    }

    setUploading(true);

    try {
      await apiClient.uploadAttachment(
        requestId, 
        selectedFile, 
        uploadForm.category, 
        uploadForm.description || undefined
      );
      
      showSuccess('File Uploaded', 'File has been uploaded successfully.');
      
      // Reset form
      setSelectedFile(null);
      setUploadForm({ category: 'REQUIREMENTS', description: '' });
      setErrors({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      onAttachmentsUpdated?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      logger.error('Error uploading file:', error);
      showError('Upload Failed', errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      await apiClient.deleteAttachment(attachmentId);
      showSuccess('File Deleted', 'File has been deleted successfully.');
      onAttachmentsUpdated?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete file';
      logger.error('Error deleting file:', error);
      showError('Delete Failed', errorMessage);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('word') || fileType.includes('document')) return FileText;
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return FileText;
    if (fileType.includes('zip') || fileType.includes('rar')) return Archive;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              File Attachments
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage files for this service request
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Upload Section */}
          <div className="border border-gray-200 dark:border-slate-600 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upload New File</h3>
            
            {/* File Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select File *
              </label>
              <div className="flex items-center space-x-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept={ALLOWED_FILE_TYPES.join(',')}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </button>
                {selectedFile && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </span>
                )}
              </div>
              {errors.file && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.file}
                </p>
              )}
            </div>

            {/* Category Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
              >
                {FILE_CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                rows={2}
                placeholder="Brief description of the file..."
              />
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Paperclip className="h-4 w-4 mr-2" />
                  Upload File
                </>
              )}
            </button>
          </div>

          {/* Existing Files */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Attached Files ({attachments.length})
            </h3>
            
            {attachments.length > 0 ? (
              <div className="space-y-3">
                {attachments.map((attachment) => {
                  const FileIcon = getFileIcon(attachment.fileType);
                  return (
                    <div key={attachment.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-600 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                          <FileIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {attachment.fileName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(attachment.fileSize)} • {attachment.category}
                          </div>
                          {attachment.description && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {attachment.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={attachment.fileUrl}
                          download
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteAttachment(attachment.id)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Paperclip className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No files attached yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
