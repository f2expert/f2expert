import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../atoms/Dialog';
import { Button } from '../../atoms/Button';
import { Badge } from '../../atoms/Badge';
import { Card } from '../../atoms/Card';
import { 
  Eye,
  Calendar,
  DollarSign,
  User,
  Mail,
  CreditCard,
  Clock,
  CheckCircle,
  Plus,
  Minus
} from 'lucide-react';
import { type SalaryStructure } from '../../../services/salaryApi';

interface ViewSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  salary: SalaryStructure;
}

export const ViewSalaryModal: React.FC<ViewSalaryModalProps> = ({
  isOpen,
  onClose,
  salary
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPayPeriod = (payPeriod: { month: number; year: number }) => {
    return `${new Date(2024, payPeriod.month - 1).toLocaleDateString('en-IN', { month: 'long' })} ${payPeriod.year}`;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary', icon: Clock, color: 'text-orange-600' },
      processed: { variant: 'default', icon: CheckCircle, color: 'text-blue-600' },
      paid: { variant: 'default', icon: CheckCircle, color: 'text-green-600' },
      cancelled: { variant: 'destructive', icon: Clock, color: 'text-red-600' }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant as "default" | "secondary" | "destructive" | "outline"} className="flex items-center gap-1">
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
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

  if (!salary) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Salary Details - {salary.trainerName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6">
          {/* Header Info */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Trainer</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900">{salary.trainerName}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {salary.trainerEmail}
                    </p>
                    <p className="text-xs text-gray-500">ID: {salary.trainerId}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Pay Period</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="font-semibold text-gray-900">{formatPayPeriod(salary.payPeriod)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                {getStatusBadge(salary.status || salary.paymentInfo?.status || 'pending')}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Payment Mode</p>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <p className="font-semibold text-gray-900">{getPaymentModeDisplay(salary.paymentMode || salary.paymentInfo?.method || 'cash')}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Salary Breakdown */}
            <div className="space-y-4">
              {/* Basic Salary */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Salary Breakdown
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-800">Basic Salary</span>
                    <span className="font-bold text-green-900 text-lg">{formatCurrency(salary.basicSalary)}</span>
                  </div>

                  {/* Allowances */}
                  {(salary.allowances.hra > 0 || salary.allowances.transport > 0 || salary.allowances.medical > 0 || salary.allowances.performance > 0 || salary.allowances.other > 0) && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Plus className="h-4 w-4 text-green-600" />
                        Allowances
                      </h4>
                      <div className="space-y-2">
                        {salary.allowances.hra > 0 && (
                          <div className="flex justify-between p-2 bg-green-25 border border-green-200 rounded">
                            <span className="text-green-700">HRA</span>
                            <span className="font-semibold text-green-800">+{formatCurrency(salary.allowances.hra)}</span>
                          </div>
                        )}
                        {salary.allowances.transport > 0 && (
                          <div className="flex justify-between p-2 bg-green-25 border border-green-200 rounded">
                            <span className="text-green-700">Transport</span>
                            <span className="font-semibold text-green-800">+{formatCurrency(salary.allowances.transport)}</span>
                          </div>
                        )}
                        {salary.allowances.medical > 0 && (
                          <div className="flex justify-between p-2 bg-green-25 border border-green-200 rounded">
                            <span className="text-green-700">Medical</span>
                            <span className="font-semibold text-green-800">+{formatCurrency(salary.allowances.medical)}</span>
                          </div>
                        )}
                        {salary.allowances.performance > 0 && (
                          <div className="flex justify-between p-2 bg-green-25 border border-green-200 rounded">
                            <span className="text-green-700">Performance</span>
                            <span className="font-semibold text-green-800">+{formatCurrency(salary.allowances.performance)}</span>
                          </div>
                        )}
                        {salary.allowances.other > 0 && (
                          <div className="flex justify-between p-2 bg-green-25 border border-green-200 rounded">
                            <span className="text-green-700">Other</span>
                            <span className="font-semibold text-green-800">+{formatCurrency(salary.allowances.other)}</span>
                          </div>
                        )}
                        <div className="flex justify-between p-2 bg-green-100 rounded font-medium">
                          <span className="text-green-800">Total Allowances</span>
                          <span className="text-green-900">+{formatCurrency(salary.allowances.hra + salary.allowances.transport + salary.allowances.medical + salary.allowances.performance + salary.allowances.other)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center p-3 bg-blue-50 border-t-2 border-blue-200 rounded-lg">
                    <span className="font-semibold text-blue-800">Gross Salary</span>
                    <span className="font-bold text-blue-900 text-xl">{formatCurrency(salary.grossSalary)}</span>
                  </div>
                </div>
              </Card>

              {/* Deductions */}
              {(salary.deductions.pf > 0 || salary.deductions.esi > 0 || salary.deductions.tax > 0 || salary.deductions.advance > 0 || salary.deductions.other > 0) && (
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Minus className="h-5 w-5 text-red-600" />
                    Deductions
                  </h3>

                  <div className="space-y-2">
                    {salary.deductions.pf > 0 && (
                      <div className="flex justify-between p-2 bg-red-25 border border-red-200 rounded">
                        <span className="text-red-700">PF</span>
                        <span className="font-semibold text-red-800">-{formatCurrency(salary.deductions.pf)}</span>
                      </div>
                    )}
                    {salary.deductions.esi > 0 && (
                      <div className="flex justify-between p-2 bg-red-25 border border-red-200 rounded">
                        <span className="text-red-700">ESI</span>
                        <span className="font-semibold text-red-800">-{formatCurrency(salary.deductions.esi)}</span>
                      </div>
                    )}
                    {salary.deductions.tax > 0 && (
                      <div className="flex justify-between p-2 bg-red-25 border border-red-200 rounded">
                        <span className="text-red-700">Tax</span>
                        <span className="font-semibold text-red-800">-{formatCurrency(salary.deductions.tax)}</span>
                      </div>
                    )}
                    {salary.deductions.advance > 0 && (
                      <div className="flex justify-between p-2 bg-red-25 border border-red-200 rounded">
                        <span className="text-red-700">Advance</span>
                        <span className="font-semibold text-red-800">-{formatCurrency(salary.deductions.advance)}</span>
                      </div>
                    )}
                    {salary.deductions.other > 0 && (
                      <div className="flex justify-between p-2 bg-red-25 border border-red-200 rounded">
                        <span className="text-red-700">Other</span>
                        <span className="font-semibold text-red-800">-{formatCurrency(salary.deductions.other)}</span>
                      </div>
                    )}
                    <div className="flex justify-between p-2 bg-red-100 rounded font-medium border-t border-red-300">
                      <span className="text-red-800">Total Deductions</span>
                      <span className="text-red-900">-{formatCurrency(salary.deductions.pf + salary.deductions.esi + salary.deductions.tax + salary.deductions.advance + salary.deductions.other)}</span>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Net Salary & Audit Info */}
            <div className="space-y-4">
              {/* Net Salary */}
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <h3 className="text-lg font-semibold mb-4 text-green-800">Final Salary</h3>
                
                <div className="text-center">
                  <p className="text-sm text-green-600 mb-2">Net Salary</p>
                  <p className="text-4xl font-bold text-green-700 mb-4">{formatCurrency(salary.netSalary)}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-green-600">Gross</p>
                      <p className="font-semibold">{formatCurrency(salary.grossSalary)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-red-600">Deductions</p>
                      <p className="font-semibold">-{formatCurrency(salary.totalDeductions)}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Audit Information */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Audit Information</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">Created At</p>
                      <p className="font-medium">{formatDate(salary.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Updated At</p>
                      <p className="font-medium">{formatDate(salary.updatedAt)}</p>
                    </div>
                  </div>

                  {salary.processedBy && (
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-gray-500">Processed By</p>
                        <p className="font-medium">{salary.processedBy}</p>
                      </div>
                    </div>
                  )}

                  {salary.approvedBy && (
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-gray-500">Approved By</p>
                        <p className="font-medium">{typeof salary.approvedBy === 'string' ? salary.approvedBy : salary.approvedBy?.name || 'Not assigned'}</p>
                      </div>
                    </div>
                  )}

                  {salary.remarks && (
                    <div>
                      <p className="text-gray-500">Remarks</p>
                      <p className="font-medium bg-gray-50 p-2 rounded text-gray-700">{salary.remarks}</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Payment Information */}
              {salary.paymentDetails && (
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Payment Information</h3>
                  
                  <div className="space-y-2 text-sm">
                    {salary.paymentDetails.reference && (
                      <div>
                        <p className="text-gray-500">Payment Reference</p>
                        <p className="font-mono bg-gray-50 p-2 rounded text-gray-700">{salary.paymentDetails.reference}</p>
                      </div>
                    )}
                    
                    {salary.paymentDetails.transactionId && (
                      <div>
                        <p className="text-gray-500">Transaction ID</p>
                        <p className="font-mono bg-gray-50 p-2 rounded text-gray-700">{salary.paymentDetails.transactionId}</p>
                      </div>
                    )}

                    {salary.paymentDetails.bankAccount && (
                      <div>
                        <p className="text-gray-500">Bank Account</p>
                        <p className="font-mono bg-gray-50 p-2 rounded text-gray-700">{salary.paymentDetails.bankAccount}</p>
                      </div>
                    )}

                    {salary.paymentDetails.paymentDate && (
                      <div>
                        <p className="text-gray-500">Payment Date</p>
                        <p className="font-medium bg-gray-50 p-2 rounded text-gray-700">{formatDate(salary.paymentDetails.paymentDate)}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>

          </div>
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {(salary.status === 'processed' || salary.status === 'paid') && (
            <Button variant="outline">
              Download Payslip
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};