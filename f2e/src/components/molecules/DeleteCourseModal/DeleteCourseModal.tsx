import React, { useState } from 'react';
import { BookX, AlertTriangle, Users, DollarSign, Star } from 'lucide-react';

import { Button } from '../../atoms/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../atoms/Dialog';
import { Badge } from '../../atoms/Badge';

import { courseManagementApiService, type Course } from '../../../services/courseManagementApi';

interface DeleteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onCourseDeleted: () => void;
}

const DeleteCourseModal: React.FC<DeleteCourseModalProps> = ({
  isOpen,
  onClose,
  course,
  onCourseDeleted,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await courseManagementApiService.deleteCourse(course._id);
      onCourseDeleted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive course');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-semibold text-red-600">
            <BookX className="mr-2 h-5 w-5" />
            Archive Course
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Icon and Message */}
          <div className="flex items-center justify-center p-6 bg-red-50 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>

          {/* Confirmation Message */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Are you sure you want to archive this course?
            </h3>
            <p className="text-gray-600">
              You are about to archive:
            </p>
          </div>

          {/* Course Details Card */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-3">
              {/* Course Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {course.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    ID: {course._id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Instructor: {course.instructor}
                  </p>
                </div>
                <div className="text-right">
                  {course.isPublished ? (
                    <Badge className="bg-green-100 text-green-800 mb-1">
                      Published
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800 mb-1">
                      Draft
                    </Badge>
                  )}
                  {course.isFeatured && (
                    <Badge className="bg-purple-100 text-purple-800 ml-2">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center text-blue-600 mb-1">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm font-semibold">{course.totalEnrollments || 0}</span>
                  </div>
                  <p className="text-xs text-gray-500">Students</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-green-600 mb-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="text-sm font-semibold">{formatPrice(course.price, course.currency)}</span>
                  </div>
                  <p className="text-xs text-gray-500">Price</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-yellow-600 mb-1">
                    <Star className="h-4 w-4 mr-1" />
                    <span className="text-sm font-semibold">{course.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              </div>

              {/* Course Description Preview */}
              {course.shortDescription && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-700 italic">
                    "{course.shortDescription}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Warning Text */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-700">
                <p className="font-semibold mb-1">Important:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>This will archive the course and set its status to inactive</li>
                  <li>The course will no longer be available for new enrollments</li>
                  <li>Existing student enrollments will be preserved</li>
                  <li>All course data will be retained for historical records</li>
                  <li>This action can be reversed by editing the course later</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Impact Warning for Active Courses */}
          {course.isPublished && course.totalEnrollments > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-700">
                  <p className="font-semibold mb-1">Student Impact Warning:</p>
                  <p>
                    This course has <strong>{course.totalEnrollments} active student(s)</strong>. 
                    Archiving will prevent new enrollments but won't affect existing students' access.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <div className="flex">
                <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Error:</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Archiving...
                </>
              ) : (
                <>
                  <BookX className="h-4 w-4 mr-2" />
                  Archive Course
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { DeleteCourseModal };