import React, { useState } from 'react';
import { X, User, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Card } from '../../atoms/Card';
import { classManagementApiService, type ClassManagement, type CreateEnrollmentRequest } from '../../../services';

interface EnrollStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  class: ClassManagement;
  onEnrollmentSuccess: () => void;
}

export const EnrollStudentModal: React.FC<EnrollStudentModalProps> = ({
  isOpen,
  onClose,
  class: classData,
  onEnrollmentSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    studentId: '',
    status: 'enrolled' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.studentId) {
        throw new Error('Student ID is required');
      }

      const enrollmentData: CreateEnrollmentRequest = {
        classId: classData._id,
        studentId: formData.studentId
      };

      const result = await classManagementApiService.enrollStudent(enrollmentData);
      console.log('Enrollment successful:', result);
      
      // Show success message (optional)
      alert(`Student ID ${formData.studentId} successfully enrolled in ${classData.className}!`);
      
      onEnrollmentSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to enroll student:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to enroll student';
      setError(`Enrollment failed: ${errorMessage}`);
      
      // Show user-friendly error message
      if (err instanceof Error && err.message.includes('Failed to enroll student')) {
        setError('Unable to connect to enrollment service. Please check if the server is running on localhost:5000');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
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
          <h2 className="text-xl font-semibold text-gray-900">Enroll Student</h2>
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
            {/* Student ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="h-4 w-4 inline mr-1" />
                Student ID *
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter student ID (e.g., 507f1f77bcf86cd799439013)"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the unique student identifier from your student management system
              </p>
            </div>

            {/* Enrollment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enrollment Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled
              >
                <option value="enrolled">Enrolled</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Status is automatically set to "enrolled" for new enrollments
              </p>
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
                disabled={loading || !formData.studentId}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enrolling...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Enroll Student
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

export default EnrollStudentModal;