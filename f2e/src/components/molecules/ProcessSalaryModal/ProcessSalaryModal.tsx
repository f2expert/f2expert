import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../atoms/Dialog';
import { Button } from '../../atoms/Button';
import { Badge } from '../../atoms/Badge';
import { Card } from '../../atoms/Card';
import { Input } from '../../atoms/Input';
import { 
  CheckCircle,
  CreditCard,
  Calendar,
  DollarSign,
  User,
  Loader2,
  AlertCircle,
  Clock,
  FileText
} from 'lucide-react';
import { trainerSalaryApiService, type SalaryStructure } from '../../../services/salaryApi';

interface ProcessSalaryRequest {
  action: 'process' | 'pay' | 'cancel';
  paymentReference?: string;
  notes?: string;
}

interface ProcessSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  salary: SalaryStructure;
}

export const ProcessSalaryModal: React.FC<ProcessSalaryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  salary
}) => {
  const [processData, setProcessData] = useState<ProcessSalaryRequest>({
    action: 'process',
    paymentReference: '',
    notes: ''
  });
  
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

  const getPaymentModeDisplay = (mode: string) => {
    const modes = {
      bank_transfer: 'Bank Transfer',
      cash: 'Cash',
      cheque: 'Cheque',
      upi: 'UPI'
    };
    return modes[mode as keyof typeof modes] || mode;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (processData.action === 'pay' && !processData.paymentReference) {
      setError('Payment reference is required when marking as paid');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // For now, just use the action type as processedBy until API is updated
      const processedBy = `System - ${processData.action}`;
      await trainerSalaryApiService.processSalary(salary._id || salary.id, processedBy);
      onSuccess();
    } catch (err) {
      console.error('Failed to process salary:', err);
      setError(err instanceof Error ? err.message : 'Failed to process salary');
    } finally {
      setLoading(false);
    }
  };

  const getActionTitle = () => {
    switch (processData.action) {
      case 'process':
        return 'Process Salary';
      case 'pay':
        return 'Mark as Paid';
      case 'cancel':
        return 'Cancel Salary';
      default:
        return 'Process Salary';
    }
  };

  const getActionIcon = () => {
    switch (processData.action) {
      case 'process':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'pay':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancel':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-blue-600" />;
    }
  };

  const getActionDescription = () => {
    switch (processData.action) {
      case 'process':
        return 'Mark this salary as processed and ready for payment. This will change the status from pending to processed.';
      case 'pay':
        return 'Mark this salary as paid after the payment has been completed. This will finalize the salary record.';
      case 'cancel':
        return 'Cancel this salary record. This action should only be used if the salary was created in error.';
      default:
        return '';
    }
  };

  if (!salary) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            {getActionIcon()}
            {getActionTitle()} - {salary.trainerName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Salary Summary */}
          <Card className="p-4 bg-gray-50">
            <h3 className="font-semibold mb-3 text-gray-900">Salary Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{salary.trainerName}</p>
                  <p className="text-gray-600">{salary.trainerEmail}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{formatPayPeriod(salary.payPeriod)}</p>
                  <p className="text-gray-600">{getPaymentModeDisplay(salary.paymentMode || salary.paymentInfo?.method || 'cash')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{formatCurrency(salary.netSalary)}</p>
                  <p className="text-gray-600">Net Amount</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Selection */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-gray-900">Select Action</h3>
            
            <div className="space-y-3">
              {salary.status === 'pending' && (
                <>
                  <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="action"
                      value="process"
                      checked={processData.action === 'process'}
                      onChange={(e) => setProcessData((prev: ProcessSalaryRequest) => ({ ...prev, action: e.target.value as 'process' | 'pay' | 'cancel' }))}
                      className="mt-1"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Process Salary</span>
                        <Badge variant="default">Recommended</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Mark as processed and ready for payment</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="action"
                      value="pay"
                      checked={processData.action === 'pay'}
                      onChange={(e) => setProcessData((prev: ProcessSalaryRequest) => ({ ...prev, action: e.target.value as 'process' | 'pay' | 'cancel' }))}
                      className="mt-1"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Mark as Paid</span>
                      </div>
                      <p className="text-sm text-gray-600">Payment has been completed</p>
                    </div>
                  </label>
                </>
              )}

              {salary.status === 'processed' && (
                <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="action"
                    value="pay"
                    checked={processData.action === 'pay'}
                    onChange={(e) => setProcessData((prev: ProcessSalaryRequest) => ({ ...prev, action: e.target.value as 'process' | 'pay' | 'cancel' }))}
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Mark as Paid</span>
                      <Badge variant="default">Ready</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Confirm payment completion</p>
                  </div>
                </label>
              )}

              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="action"
                  value="cancel"
                  checked={processData.action === 'cancel'}
                  onChange={(e) => setProcessData((prev: ProcessSalaryRequest) => ({ ...prev, action: e.target.value as 'process' | 'pay' | 'cancel' }))}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Cancel Salary</span>
                  </div>
                  <p className="text-sm text-gray-600">Cancel this salary record</p>
                </div>
              </label>
            </div>
          </Card>

          {/* Payment Reference (for paid action) */}
          {processData.action === 'pay' && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Reference *
                </label>
                <Input
                  type="text"
                  value={processData.paymentReference}
                  onChange={(e) => setProcessData((prev: ProcessSalaryRequest) => ({ ...prev, paymentReference: e.target.value }))}
                  placeholder="Enter transaction ID, check number, or reference"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the payment reference number or transaction ID for record keeping
                </p>
              </div>
            </Card>
          )}

          {/* Notes */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes (Optional)
            </h3>
            
            <textarea
              value={processData.notes}
              onChange={(e) => setProcessData((prev: ProcessSalaryRequest) => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes or comments..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </Card>

          {/* Action Description */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Action: </strong>{getActionDescription()}
            </p>
          </div>

          </form>
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t mt-4">
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
            disabled={loading || (processData.action === 'pay' && !processData.paymentReference)}
            className={
              processData.action === 'cancel' ? 'bg-red-600 hover:bg-red-700' :
              processData.action === 'pay' ? 'bg-green-600 hover:bg-green-700' :
              'bg-blue-600 hover:bg-blue-700'
            }
            onClick={handleSubmit}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {getActionTitle()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};