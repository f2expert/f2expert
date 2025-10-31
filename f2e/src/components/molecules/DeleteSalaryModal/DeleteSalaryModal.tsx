import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../atoms/Dialog';
import { Button } from '../../atoms/Button';
import { Card } from '../../atoms/Card';
import { 
  Trash2,
  AlertTriangle,
  Loader2,
  Calendar,
  DollarSign,
  User
} from 'lucide-react';
import { trainerSalaryApiService, type TrainerSalary } from '../../../services/trainerSalaryApi';

interface DeleteSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  salary: TrainerSalary;
}

export const DeleteSalaryModal: React.FC<DeleteSalaryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  salary
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPayPeriod = (payPeriod: { month: number; year: number }) => {
    return `${new Date(2024, payPeriod.month - 1).toLocaleDateString('en-IN', { month: 'long' })} ${payPeriod.year}`;
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await trainerSalaryApiService.deleteSalary(salary._id);
      onSuccess();
    } catch (err) {
      console.error('Failed to delete salary:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete salary');
    } finally {
      setLoading(false);
    }
  };

  if (!salary) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Salary Record
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800 mb-1">Permanent Action</h4>
              <p className="text-sm text-red-700">
                This salary record will be permanently deleted. This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Salary Details */}
          <Card className="p-4 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-3">Record to be deleted:</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{salary.trainerName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{formatPayPeriod(salary.payPeriod)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="font-semibold">{formatCurrency(salary.netSalary)}</span>
              </div>
            </div>
          </Card>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Confirmation Message */}
          <p className="text-gray-600 text-sm">
            Are you absolutely sure you want to delete this salary record? 
            {salary.status === 'paid' && (
              <span className="text-orange-600 font-medium">
                {" "}Warning: This salary has already been paid.
              </span>
            )}
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Record
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};