import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../atoms/Dialog';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Badge } from '../../atoms/Badge';
import { Card } from '../../atoms/Card';
import { 
  Plus, 
  Calculator, 
  DollarSign, 
  Calendar,
  Loader2,
  AlertCircle,
  Minus,
  Edit3
} from 'lucide-react';
import { trainerSalaryApiService, type SalaryStructure, type UpdateSalaryData } from '../../../services/salaryApi';

interface EditSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  salary: SalaryStructure;
}

export const EditSalaryModal: React.FC<EditSalaryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  salary
}) => {
  // Form states
  const [formData, setFormData] = useState<UpdateSalaryData>({
    basicSalary: 0,
    allowances: {
      hra: 0,
      transport: 0,
      medical: 0,
      performance: 0,
      other: 0
    },
    deductions: {
      pf: 0,
      esi: 0,
      tax: 0,
      advance: 0,
      other: 0,
      loan: 0
    },
    paymentMode: 'bank_transfer'
  });

  // Component states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form data when modal opens or salary changes
  useEffect(() => {
    if (isOpen && salary) {
      setFormData({
        basicSalary: salary.basicSalary,
        allowances: { ...salary.allowances },
        deductions: { ...salary.deductions },
        paymentMode: salary.paymentMode
      });
      setError(null);
    }
  }, [isOpen, salary]);

  // Update allowance handler
  const updateAllowance = (field: keyof NonNullable<UpdateSalaryData['allowances']>, value: number) => {
    setFormData((prev: UpdateSalaryData) => ({
      ...prev,
      allowances: {
        hra: 0,
        transport: 0,
        medical: 0,
        performance: 0,
        other: 0,
        ...prev.allowances,
        [field]: value
      }
    }));
  };

  // Update deduction handler
  const updateDeduction = (field: keyof NonNullable<UpdateSalaryData['deductions']>, value: number) => {
    setFormData((prev: UpdateSalaryData) => ({
      ...prev,
      deductions: {
        pf: 0,
        esi: 0,
        tax: 0,
        advance: 0,
        other: 0,
        loan: 0,
        ...prev.deductions,
        [field]: value
      }
    }));
  };

  // Calculate totals
  const totalAllowances = formData.allowances ? Object.values(formData.allowances).reduce((sum: number, amount: number) => sum + amount, 0) : 0;
  const totalDeductions = formData.deductions ? Object.values(formData.deductions).reduce((sum: number, amount: number) => sum + amount, 0) : 0;
  const grossSalary = (formData.basicSalary || 0) + totalAllowances;
  const netSalary = grossSalary - totalDeductions;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.basicSalary) {
      setError('Please enter a basic salary');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await trainerSalaryApiService.updateSalary(salary._id || salary.id, formData);
      onSuccess();
    } catch (err) {
      console.error('Failed to update salary:', err);
      setError(err instanceof Error ? err.message : 'Failed to update salary');
    } finally {
      setLoading(false);
    }
  };

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

  if (!salary) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-blue-600" />
            Edit Salary - {salary.trainerName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Salary Info Header */}
          <Card className="p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Trainer</p>
                <p className="font-semibold text-gray-900">{salary.trainerName}</p>
                <p className="text-sm text-gray-600">{salary.trainerEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pay Period</p>
                <p className="font-semibold text-gray-900 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatPayPeriod(salary.payPeriod)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge 
                  variant={
                    salary.status === 'pending' ? 'secondary' :
                    salary.status === 'processed' ? 'default' :
                    salary.status === 'paid' ? 'default' : 'destructive'
                  }
                >
                  {(salary.status || salary.paymentInfo?.status || 'pending').charAt(0).toUpperCase() + (salary.status || salary.paymentInfo?.status || 'pending').slice(1)}
                </Badge>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Salary & Payment Mode */}
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Basic Salary & Payment
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Basic Salary *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={formData.basicSalary || ''}
                      onChange={(e) => setFormData((prev: UpdateSalaryData) => ({
                        ...prev,
                        basicSalary: parseFloat(e.target.value) || 0
                      }))}
                      placeholder="Enter basic salary"
                      className="text-lg font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={formData.paymentMode}
                      onChange={(e) => setFormData((prev: UpdateSalaryData) => ({
                        ...prev,
                        paymentMode: e.target.value as 'bank_transfer' | 'cash' | 'cheque' | 'upi'
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                      <option value="cheque">Cheque</option>
                      <option value="upi">UPI</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Allowances */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  Allowances
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">HRA</label>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={formData.allowances?.hra || ''}
                      onChange={(e) => updateAllowance('hra', parseFloat(e.target.value) || 0)}
                      placeholder="Enter HRA amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transport</label>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={formData.allowances?.transport || ''}
                      onChange={(e) => updateAllowance('transport', parseFloat(e.target.value) || 0)}
                      placeholder="Enter transport allowance"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical</label>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={formData.allowances?.medical || ''}
                      onChange={(e) => updateAllowance('medical', parseFloat(e.target.value) || 0)}
                      placeholder="Enter medical allowance"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Performance</label>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={formData.allowances?.performance || ''}
                      onChange={(e) => updateAllowance('performance', parseFloat(e.target.value) || 0)}
                      placeholder="Enter performance bonus"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Other</label>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={formData.allowances?.other || ''}
                      onChange={(e) => updateAllowance('other', parseFloat(e.target.value) || 0)}
                      placeholder="Enter other allowances"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Deductions & Summary */}
            <div className="space-y-4">
              {/* Deductions */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Minus className="h-5 w-5 text-red-600" />
                  Deductions
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PF</label>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={formData.deductions?.pf || ''}
                      onChange={(e) => updateDeduction('pf', parseFloat(e.target.value) || 0)}
                      placeholder="Enter PF deduction"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ESI</label>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={formData.deductions?.esi || ''}
                      onChange={(e) => updateDeduction('esi', parseFloat(e.target.value) || 0)}
                      placeholder="Enter ESI deduction"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax</label>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={formData.deductions?.tax || ''}
                      onChange={(e) => updateDeduction('tax', parseFloat(e.target.value) || 0)}
                      placeholder="Enter tax deduction"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Advance</label>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={formData.deductions?.advance || ''}
                      onChange={(e) => updateDeduction('advance', parseFloat(e.target.value) || 0)}
                      placeholder="Enter advance deduction"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Other</label>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={formData.deductions?.other || ''}
                      onChange={(e) => updateDeduction('other', parseFloat(e.target.value) || 0)}
                      placeholder="Enter other deductions"
                    />
                  </div>
                </div>
              </Card>

              {/* Salary Summary */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Updated Salary Summary
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Basic Salary:</span>
                    <span className="font-semibold">{formatCurrency(formData.basicSalary || 0)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Total Allowances:</span>
                    <span className="font-semibold">+{formatCurrency(totalAllowances)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Gross Salary:</span>
                    <span>{formatCurrency(grossSalary)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Total Deductions:</span>
                    <span className="font-semibold">-{formatCurrency(totalDeductions)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold text-blue-600">
                    <span>Net Salary:</span>
                    <span>{formatCurrency(netSalary)}</span>
                  </div>
                </div>

                {/* Show changes */}
                {netSalary !== salary.netSalary && (
                  <div className="mt-3 pt-3 border-t border-blue-300">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Previous Net Salary:</span>
                      <span>{formatCurrency(salary.netSalary)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-600">Difference:</span>
                      <span className={netSalary > salary.netSalary ? 'text-green-600' : 'text-red-600'}>
                        {netSalary > salary.netSalary ? '+' : ''}{formatCurrency(netSalary - salary.netSalary)}
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.basicSalary || formData.basicSalary <= 0}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Salary
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};