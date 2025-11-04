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
  Users, 
  Calendar,
  Loader2,
  AlertCircle,
  Search,
  Minus
} from 'lucide-react';
import { trainerApiService, type Trainer } from '../../../services/trainerApi';
// Import Trainer Salary API Service
import { 
  trainerSalaryApiService, 
  type CreateSalaryData 
} from '../../../services/salaryApi';

interface AddSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddSalaryModal: React.FC<AddSalaryModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  // Form states
  const [formData, setFormData] = useState<CreateSalaryData>({
    employeeId: '',
    payPeriod: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    },
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
      loan: 0,
    },
    paymentMode: 'bank_transfer'
  });

  // Component states
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [error, setError] = useState<string | null>(null);



  // Search
  const [trainerSearch, setTrainerSearch] = useState('');

  // Load trainers when modal opens
  useEffect(() => {
    if (isOpen) {
      loadTrainers();
      resetForm();
    }
  }, [isOpen]);

  const loadTrainers = async () => {
    try {
      setLoadingTrainers(true);
      const result = await trainerApiService.getActiveTrainers();
      setTrainers(result.data);
    } catch (err) {
      console.error('Failed to load trainers:', err);
      setError('Failed to load trainers');
    } finally {
      setLoadingTrainers(false);
    }
  };

  const resetForm = () => {
    const currentDate = new Date();
    setFormData({
      employeeId: '',
      payPeriod: {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      },
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
    setSelectedTrainer(null);
    setTrainerSearch('');
    setError(null);
  };

  // Handle trainer selection
  const handleTrainerSelect = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setFormData((prev: CreateSalaryData) => ({
      ...prev,
      employeeId: trainer._id
    }));
  };

  // Update allowance handler
  const updateAllowance = (field: keyof CreateSalaryData['allowances'], value: number) => {
    setFormData((prev: CreateSalaryData) => ({
      ...prev,
      allowances: {
        ...prev.allowances,
        [field]: value
      }
    }));
  };

  // Update deduction handler
  const updateDeduction = (field: keyof CreateSalaryData['deductions'], value: number) => {
    setFormData((prev: CreateSalaryData) => ({
      ...prev,
      deductions: {
        ...prev.deductions,
        [field]: value
      }
    }));
  };

  // Calculate totals
  const totalAllowances = Object.values(formData.allowances).reduce((sum: number, amount: number) => sum + amount, 0);
  const totalDeductions = Object.values(formData.deductions).reduce((sum: number, amount: number) => sum + amount, 0);
  const grossSalary = formData.basicSalary + totalAllowances;
  const netSalary = grossSalary - totalDeductions;

  // Filter trainers by search
  const filteredTrainers = trainers.filter((trainer: Trainer) =>
    trainer.fullName.toLowerCase().includes(trainerSearch.toLowerCase()) ||
    trainer.email.toLowerCase().includes(trainerSearch.toLowerCase()) ||
    trainer._id.toLowerCase().includes(trainerSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.basicSalary) {
      setError('Please select a trainer and enter basic salary');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Submitting salary data:', formData);
      await trainerSalaryApiService.createSalary(formData);
      onSuccess();
    } catch (err) {
      console.error('Failed to create salary:', err);
      setError(err instanceof Error ? err.message : 'Failed to create salary');
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Generate Trainer Salary
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Trainer Selection & Basic Info */}
            <div className="space-y-4">
              {/* Trainer Selection */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Select Trainer
                </h3>

                {/* Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search trainers..."
                    value={trainerSearch}
                    onChange={(e) => setTrainerSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Trainer List */}
                {loadingTrainers ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {filteredTrainers.map((trainer) => (
                      <div
                        key={trainer._id}
                        onClick={() => handleTrainerSelect(trainer)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedTrainer?._id === trainer._id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{trainer.fullName}</p>
                            <p className="text-sm text-gray-500">{trainer.email}</p>
                          </div>
                          <Badge variant={trainer.isActive ? 'default' : 'secondary'}>
                            {trainer.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTrainer && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm font-medium">Selected: {selectedTrainer.fullName}</p>
                    <p className="text-green-600 text-xs">{selectedTrainer.email}</p>
                  </div>
                )}
              </Card>

              {/* Pay Period & Basic Info */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Pay Period & Basic Salary
                </h3>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Month
                    </label>
                    <select
                      value={formData.payPeriod.month}
                      onChange={(e) => setFormData((prev: CreateSalaryData) => ({
                        ...prev,
                        payPeriod: { ...prev.payPeriod, month: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(2024, i).toLocaleDateString('en-IN', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <select
                      value={formData.payPeriod.year}
                      onChange={(e) => setFormData((prev: CreateSalaryData) => ({
                        ...prev,
                        payPeriod: { ...prev.payPeriod, year: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {Array.from({ length: 3 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Basic Salary *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="100"
                    value={formData.basicSalary || ''}
                    onChange={(e) => setFormData((prev: CreateSalaryData) => ({
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
                    onChange={(e) => setFormData((prev: CreateSalaryData) => ({
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
              </Card>
            </div>

            {/* Right Column - Allowances & Deductions */}
            <div className="space-y-4">
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
                      value={formData.allowances.hra || ''}
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
                      value={formData.allowances.transport || ''}
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
                      value={formData.allowances.medical || ''}
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
                      value={formData.allowances.performance || ''}
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
                      value={formData.allowances.other || ''}
                      onChange={(e) => updateAllowance('other', parseFloat(e.target.value) || 0)}
                      placeholder="Enter other allowances"
                    />
                  </div>
                </div>
              </Card>

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
                      value={formData.deductions.pf || ''}
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
                      value={formData.deductions.esi || ''}
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
                      value={formData.deductions.tax || ''}
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
                      value={formData.deductions.advance || ''}
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
                      value={formData.deductions.other || ''}
                      onChange={(e) => updateDeduction('other', parseFloat(e.target.value) || 0)}
                      placeholder="Enter other deductions"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loan</label>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={formData.deductions.loan || ''}
                      onChange={(e) => updateDeduction('loan', parseFloat(e.target.value) || 0)}
                      placeholder="Enter loan deduction"
                    />
                  </div>
                </div>
              </Card>

              {/* Salary Summary */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Salary Summary
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Basic Salary:</span>
                    <span className="font-semibold">{formatCurrency(formData.basicSalary)}</span>
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
              </Card>
            </div>
          </div>

          </form>
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading || !formData.employeeId || !formData.basicSalary}
            onClick={handleSubmit}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Generate Salary
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};