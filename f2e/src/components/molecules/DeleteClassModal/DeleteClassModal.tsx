import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../atoms/Dialog';
import { Button } from '../../atoms/Button';
import { Badge } from '../../atoms/Badge';
import {
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  BookOpen,
  User,
  Loader2,
} from 'lucide-react';

// Import types and services
import type { ClassManagement } from '../../../services';
import { classManagementApiService } from '../../../services';

interface DeleteClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  class: ClassManagement;
  onClassDeleted: () => void;
}

const DeleteClassModal: React.FC<DeleteClassModalProps> = ({
  isOpen,
  onClose,
  class: classData,
  onClassDeleted
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatPrice = (price: number, currency: string = 'INR') => {
    if (price === 0) return 'Free';
    return `${currency === 'INR' ? '₹' : currency}${price}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ongoing': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      await classManagementApiService.deleteClass(classData._id);
      
      onClassDeleted();
      onClose();
    } catch (err) {
      console.error('Failed to delete class:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete class');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Delete Class
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 mb-1">
                  Are you sure you want to delete this class?
                </p>
                <p className="text-sm text-red-700">
                  This will permanently remove the class and all associated data. 
                  {classData.currentEnrollments && classData.currentEnrollments > 0 && (
                    <span className="font-medium">
                      {' '}This class currently has {classData.currentEnrollments} enrolled students.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Class Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Class Details</h3>
            
            {/* Class Overview */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900 mb-1">
                    {classData.className}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{classData.courseName}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{classData.instructorName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getStatusColor(classData.status || 'scheduled')}`}>
                      {classData.status || 'Scheduled'}
                    </Badge>
                    {classData.isRecurring && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        Recurring
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule and Venue Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {formatDate(classData.scheduledDate)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Time:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {formatTime(classData.startTime)} - {formatTime(classData.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Venue:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {classData.venue}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Enrolled:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {classData.currentEnrollments || 0}/{classData.maxEnrollments}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Price:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {formatPrice(classData.classPrice, classData.currency)}
                    </span>
                  </div>
                  <div className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <span className="text-gray-600">Address:</span>
                      <div className="ml-2 text-gray-900 text-xs">
                        <p>{classData.address.street}</p>
                        <p>{classData.address.city}, {classData.address.state}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Warning */}
          {classData.currentEnrollments && classData.currentEnrollments > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start">
                <Users className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-800 mb-1">
                    Impact on Enrolled Students
                  </p>
                  <p className="text-sm text-orange-700">
                    Deleting this class will affect {classData.currentEnrollments} enrolled student
                    {classData.currentEnrollments !== 1 ? 's' : ''}. 
                    Make sure to notify them about the cancellation before proceeding.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">
                <span className="font-medium">Error:</span> {error}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Class'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteClassModal;