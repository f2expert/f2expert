import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../atoms/Dialog';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  BookOpen,
  User,
  Target,
  CheckCircle,
  Package,
  Tag,
  Repeat,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

// Import types
import type { ClassManagement } from '../../../services';

interface ViewClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  class: ClassManagement;
}

const ViewClassModal: React.FC<ViewClassModalProps> = ({
  isOpen,
  onClose,
  class: classData
}) => {
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

  const getRecurringText = () => {
    if (!classData.isRecurring || !classData.recurringPattern) return null;

    const { type, interval, daysOfWeek, endDate } = classData.recurringPattern;
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    let text = `Repeats ${type}`;
    
    if (interval > 1) {
      text += ` every ${interval} ${type}s`;
    }
    
    if (daysOfWeek && daysOfWeek.length > 0) {
      const days = daysOfWeek.map(day => dayNames[day]).join(', ');
      text += ` on ${days}`;
    }
    
    if (endDate) {
      text += ` until ${new Date(endDate).toLocaleDateString('en-IN')}`;
    }
    
    return text;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
                {classData.className}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{classData.courseName}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{classData.instructorName}</span>
                </div>
                <Badge className={cn('text-xs', getStatusColor(classData.status || 'scheduled'))}>
                  {classData.status || 'Scheduled'}
                </Badge>
                {classData.isRecurring && (
                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                    <Repeat className="h-3 w-3 mr-1" />
                    Recurring
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {classData.description}
              </p>
            </div>

            {/* Schedule Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(classData.scheduledDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Time</p>
                  <p className="text-sm font-medium text-gray-900 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(classData.startTime)} - {formatTime(classData.endTime)}
                  </p>
                </div>
              </div>
              {classData.isRecurring && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Recurring Pattern
                  </p>
                  <p className="text-sm text-gray-700 flex items-center">
                    <Repeat className="h-3 w-3 mr-1" />
                    {getRecurringText()}
                  </p>
                </div>
              )}
            </div>

            {/* Venue Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Venue
              </h3>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">{classData.venue}</p>
                <div className="text-sm text-gray-600">
                  <p>{classData.address.street}</p>
                  <p>
                    {classData.address.city}, {classData.address.state} {classData.address.zipCode}
                  </p>
                  <p>{classData.address.country}</p>
                </div>
              </div>
            </div>

            {/* Learning Objectives */}
            {classData.objectives && classData.objectives.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Learning Objectives
                </h3>
                <ul className="space-y-2">
                  {classData.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prerequisites */}
            {classData.prerequisites && classData.prerequisites.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Prerequisites</h3>
                <ul className="space-y-2">
                  {classData.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                      <span>{prerequisite}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Materials */}
            {classData.requiredMaterials && classData.requiredMaterials.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Required Materials
                </h3>
                <ul className="space-y-2">
                  {classData.requiredMaterials.map((material, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <Package className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{material}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Key Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Class Information</h3>
              <div className="space-y-4">
                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Price
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(classData.classPrice, classData.currency)}
                  </span>
                </div>

                {/* Capacity */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Capacity
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {classData.capacity} students
                  </span>
                </div>

                {/* Current Enrollments */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Enrolled</span>
                  <span className="text-sm font-medium text-gray-900">
                    {classData.currentEnrollments || 0}/{classData.maxEnrollments}
                  </span>
                </div>

                {/* Enrollment Progress Bar */}
                <div className="w-full">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Enrollment Progress</span>
                    <span>
                      {Math.round(((classData.currentEnrollments || 0) / classData.maxEnrollments) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(((classData.currentEnrollments || 0) / classData.maxEnrollments) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {classData.tags && classData.tags.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {classData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Metadata</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{new Date(classData.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Updated:</span>
                  <span>{new Date(classData.updatedAt).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Class ID:</span>
                  <span className="font-mono">{classData._id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewClassModal;