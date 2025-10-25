import React, { useEffect, useState } from 'react';
import { Button } from '../../components/atoms/Button';
import { Card, CardContent, CardHeader } from '../../components/atoms/Card';
import { Badge } from '../../components/atoms/Badge';
import { Skeleton } from '../../components/atoms/Skeleton';
import { PaymentMethodManager } from '../../components/molecules/PaymentMethodManager';
import { useAuth } from '../../hooks/useAuth';
import { usePayment } from '../../hooks/usePayment';
import { cn } from '../../lib/utils';
import { 
  FaCreditCard, 
  FaCalendarAlt, 
  FaDownload, 
  FaSync,
  FaReceipt,
  FaFileInvoiceDollar,
  FaHistory,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUndo
} from 'react-icons/fa';
import type { PaymentHistory } from '../../services';

export const PaymentHistoryPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    paymentHistory, 
    paymentMethods, 
    isLoading, 
    error,
    loadPaymentHistory,
    loadPaymentMethods,
    deletePaymentMethod,
    requestRefund,
    clearPaymentError
  } = usePayment();

  const [activeTab, setActiveTab] = useState<'history' | 'methods'>('history');
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadPaymentHistory(user.id);
      loadPaymentMethods(user.id);
    }
  }, [isAuthenticated, user?.id, loadPaymentHistory, loadPaymentMethods]);

  const handleRefundRequest = async (paymentId: string, enrollmentId: string) => {
    try {
      await requestRefund({
        paymentIntentId: paymentId,
        enrollmentId: enrollmentId,
        reason: 'User requested refund'
      });
      alert('Refund request submitted successfully');
    } catch {
      alert('Failed to request refund. Please contact support.');
    }
  };

  const handleDeletePaymentMethod = async (methodId: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      await deletePaymentMethod(methodId);
    }
  };

  const handleSetDefaultPaymentMethod = async (methodId: string) => {
    // This would be implemented based on your API
    console.log('Set default payment method:', methodId);
  };

  const getStatusIcon = (status: PaymentHistory['status']) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-600" />;
      case 'pending':
        return <FaClock className="text-yellow-600" />;
      case 'failed':
        return <FaTimesCircle className="text-red-600" />;
      case 'refunded':
        return <FaUndo className="text-blue-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: PaymentHistory['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canRequestRefund = (payment: PaymentHistory) => {
    if (payment.status !== 'completed') return false;
    
    const paymentDate = new Date(payment.createdAt);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDiff <= 15; // 15-day refund policy
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <FaExclamationTriangle className="text-4xl text-yellow-400 mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Authentication Required</h2>
            <p className="text-gray-500 mb-6">Please log in to view your payment history</p>
            <Button onClick={() => window.location.href = '/login'}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Center</h1>
          <p className="text-gray-600">
            Manage your payment methods and view transaction history
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-red-800">
                  <FaExclamationTriangle className="mr-2" />
                  <span>{error}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearPaymentError}
                  className="text-red-600 border-red-300 hover:bg-red-100"
                >
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              'flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors',
              activeTab === 'history'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-700'
            )}
          >
            <FaHistory className="mr-2" />
            Payment History
          </button>
          <button
            onClick={() => setActiveTab('methods')}
            className={cn(
              'flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors',
              activeTab === 'methods'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-700'
            )}
          >
            <FaCreditCard className="mr-2" />
            Payment Methods
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Transaction History</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => user?.id && loadPaymentHistory(user.id)}
                disabled={isLoading}
                className="flex items-center"
              >
                <FaSync className={cn('mr-2', isLoading && 'animate-spin')} />
                Refresh
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : paymentHistory.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FaFileInvoiceDollar className="text-4xl text-gray-300 mb-4 mx-auto" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Transactions Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Your payment history will appear here once you make your first purchase
                  </p>
                  <Button onClick={() => window.location.href = '/courses'}>
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <Card key={payment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getStatusIcon(payment.status)}
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {payment.courseName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <FaCalendarAlt className="mr-1" />
                                {new Date(payment.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="flex items-center">
                                <FaCreditCard className="mr-1" />
                                {payment.paymentMethod}
                              </div>
                              <span>ID: {payment.transactionId}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900 mb-2">
                            ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                          >
                            <FaReceipt className="mr-2" />
                            View Receipt
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                          >
                            <FaDownload className="mr-2" />
                            Download Invoice
                          </Button>
                        </div>

                        {canRequestRefund(payment) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRefundRequest(payment.id, payment.courseId)}
                            className="text-red-600 border-red-300 hover:bg-red-50 flex items-center"
                          >
                            <FaUndo className="mr-2" />
                            Request Refund
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'methods' && (
          <PaymentMethodManager
            paymentMethods={paymentMethods}
            onAddMethod={() => setShowAddPaymentMethod(true)}
            onDeleteMethod={handleDeletePaymentMethod}
            onSetDefault={handleSetDefaultPaymentMethod}
            isLoading={isLoading}
          />
        )}

        {/* Add Payment Method Modal - Placeholder */}
        {showAddPaymentMethod && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <CardHeader>
                <h3 className="text-xl font-bold">Add Payment Method</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Payment method management interface would be implemented here.
                </p>
                <div className="flex gap-4">
                  <Button
                    onClick={() => setShowAddPaymentMethod(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;