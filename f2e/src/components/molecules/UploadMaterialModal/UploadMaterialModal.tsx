import React, { useState } from 'react';
import { X, Upload, FileText, AlertCircle, Link } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Card } from '../../atoms/Card';
import { classManagementApiService, type ClassManagement, type CreateMaterialRequest } from '../../../services';

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  class: ClassManagement;
  onMaterialUploaded: () => void;
}

export const UploadMaterialModal: React.FC<UploadMaterialModalProps> = ({
  isOpen,
  onClose,
  class: classData,
  onMaterialUploaded
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    fileType: 'document' as 'document' | 'video' | 'audio' | 'image' | 'link' | 'other',
    isRequired: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title || !formData.description) {
        throw new Error('Title and description are required');
      }

      const materialData: CreateMaterialRequest = {
        classId: classData._id,
        title: formData.title,
        description: formData.description,
        type: formData.fileType,
        fileUrl: formData.fileUrl || undefined,
        isRequired: formData.isRequired,
        uploadedBy: 'admin' // TODO: Get from current user context
      };

      const result = await classManagementApiService.uploadMaterial(materialData);
      console.log('Material upload successful:', result);
      
      // Show success message (optional)
      alert(`Material "${formData.title}" successfully uploaded to ${classData.className}!`);
      
      onMaterialUploaded();
      onClose();
    } catch (err) {
      console.error('Failed to upload material:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload material';
      setError(`Upload failed: ${errorMessage}`);
      
      // Show user-friendly error message
      if (err instanceof Error && err.message.includes('Unable to connect to the materials service')) {
        setError('Unable to connect to materials service. Please check if the server is running on localhost:5000');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg bg-white">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Upload Material</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText className="h-4 w-4 inline mr-1" />
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter material title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter material description"
                rows={3}
                required
              />
            </div>

            {/* File URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Link className="h-4 w-4 inline mr-1" />
                File URL
              </label>
              <input
                type="url"
                value={formData.fileUrl}
                onChange={(e) => handleInputChange('fileUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/file.pdf"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL to the material file (optional)
              </p>
            </div>

            {/* File Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Type
              </label>
              <select
                value={formData.fileType}
                onChange={(e) => handleInputChange('fileType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="document">Document</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="image">Image</option>
                <option value="link">Link</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Is Required */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isRequired}
                  onChange={(e) => handleInputChange('isRequired', e.target.checked)}
                  className="rounded border-gray-300 mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  This material is required for students
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.title || !formData.description}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Material
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default UploadMaterialModal;