import React, { useState } from 'react';
import { UserX, AlertTriangle } from 'lucide-react';

import { Button } from '../../atoms/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../atoms/Dialog';

import { trainerManagementApiService, type Trainer } from '../../../services/trainerManagementApi';

interface DeleteTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainer: Trainer;
  onTrainerDeleted: () => void;
}

const DeleteTrainerModal: React.FC<DeleteTrainerModalProps> = ({
  isOpen,
  onClose,
  trainer,
  onTrainerDeleted,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await trainerManagementApiService.softDeleteTrainer(trainer._id);
      onTrainerDeleted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate trainer');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-semibold text-red-600">
            <UserX className="mr-2 h-5 w-5" />
            Deactivate Trainer
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
              Are you sure you want to deactivate this trainer?
            </h3>
            <p className="text-gray-600">
              You are about to deactivate:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {trainer.firstName.charAt(0)}{trainer.lastName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {trainer.firstName} {trainer.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    ID: {trainer.trainerId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {trainer.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Text */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-700">
                <p className="font-semibold mb-1">Important:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>This will set the trainer's status to inactive</li>
                  <li>They will no longer be able to conduct training sessions</li>
                  <li>Their profile will be preserved for historical records</li>
                  <li>This action can be reversed by editing the trainer later</li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
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
                  Deactivating...
                </>
              ) : (
                <>
                  <UserX className="h-4 w-4 mr-2" />
                  Deactivate Trainer
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { DeleteTrainerModal };