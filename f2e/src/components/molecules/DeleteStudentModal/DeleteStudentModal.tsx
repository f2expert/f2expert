import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../atoms/Dialog';
import { Button } from '../../atoms/Button';
import { AlertTriangle, Users } from 'lucide-react';

interface DeleteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  studentName?: string;
  studentIds?: string[];
  isMultiple?: boolean;
}

export const DeleteStudentModal: React.FC<DeleteStudentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  studentName,
  studentIds = [],
  isMultiple = false
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const isMultipleDelete = isMultiple && studentIds.length > 0;
  const studentCount = studentIds.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {isMultipleDelete ? 'Deactivate Multiple Students' : 'Deactivate Student'}
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Students will be marked as inactive
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="py-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-orange-800">
                  Student Deactivation
                </h4>
                <p className="text-sm text-orange-700 mt-1">
                  {isMultipleDelete
                    ? `You are about to deactivate ${studentCount} student${studentCount > 1 ? 's' : ''}. They will be marked as inactive.`
                    : `You are about to deactivate the student "${studentName}". They will be marked as inactive.`
                  }
                </p>
              </div>
            </div>
          </div>

          {isMultipleDelete ? (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  Selected Students ({studentCount})
                </span>
              </div>
              <div className="text-sm text-blue-700">
                <p>When deactivated, these students will:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Be marked with "inactive" status</li>
                  <li>Not appear in active student lists by default</li>
                  <li>Retain all historical data and records</li>
                  <li>Can be reactivated later if needed</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700 mb-3">
                When deactivated, this student will:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-400 rounded-full"></div>
                  Be marked with "inactive" status
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-400 rounded-full"></div>
                  Not appear in active student lists by default
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-400 rounded-full"></div>
                  Retain all historical data and records
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-400 rounded-full"></div>
                  Can be reactivated later if needed
                </li>
              </ul>
            </div>
          )}

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Safe Approach:</strong> This deactivation preserves all data while removing the student 
              from active operations. The student can be reactivated anytime if needed.
            </p>
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deactivating...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  {isMultipleDelete ? `Deactivate ${studentCount} Students` : 'Deactivate Student'}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStudentModal;