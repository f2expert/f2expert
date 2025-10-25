import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import { Card, CardContent } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { cn } from '../../../lib/utils';
import { 
  FaCreditCard, 
  FaCalendarAlt, 
  FaTrash, 
  FaPlus,
  FaCheck,
  FaSpinner
} from 'react-icons/fa';
import type { PaymentMethod } from '../../../services';

interface PaymentMethodManagerProps {
  paymentMethods: PaymentMethod[];
  onAddMethod: () => void;
  onDeleteMethod: (methodId: string) => void;
  onSetDefault: (methodId: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const PaymentMethodManager: React.FC<PaymentMethodManagerProps> = ({
  paymentMethods,
  onAddMethod,
  onDeleteMethod,
  onSetDefault,
  isLoading = false,
  className
}) => {
  const [deletingMethod, setDeletingMethod] = useState<string | null>(null);
  const [settingDefault, setSettingDefault] = useState<string | null>(null);

  const handleDeleteMethod = async (methodId: string) => {
    setDeletingMethod(methodId);
    try {
      await onDeleteMethod(methodId);
    } finally {
      setDeletingMethod(null);
    }
  };

  const handleSetDefault = async (methodId: string) => {
    setSettingDefault(methodId);
    try {
      await onSetDefault(methodId);
    } finally {
      setSettingDefault(null);
    }
  };

  const getCardBrandIcon = (brand?: string) => {
    const brandLower = brand?.toLowerCase();
    switch (brandLower) {
      case 'visa':
        return <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>;
      case 'mastercard':
        return <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>;
      case 'amex':
        return <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>;
      default:
        return <FaCreditCard className="text-gray-400" />;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Payment Methods</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddMethod}
          disabled={isLoading}
          className="flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Method
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-2xl text-gray-400" />
        </div>
      ) : paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FaCreditCard className="text-4xl text-gray-300 mb-4 mx-auto" />
            <h4 className="text-lg font-medium text-gray-700 mb-2">No Payment Methods</h4>
            <p className="text-gray-500 mb-4">Add a payment method to make purchases easier</p>
            <Button onClick={onAddMethod}>
              <FaPlus className="mr-2" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <Card key={method.id} className={cn(
              'transition-all duration-200',
              method.isDefault && 'ring-2 ring-purple-500 ring-opacity-20 bg-purple-50'
            )}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getCardBrandIcon(method.brand)}
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium capitalize">
                          {method.brand} ending in {method.last4}
                        </span>
                        {method.isDefault && (
                          <Badge variant="default" className="bg-purple-100 text-purple-800">
                            <FaCheck className="mr-1 text-xs" />
                            Default
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FaCalendarAlt className="mr-1" />
                        <span>Expires {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}</span>
                        <span className="mx-2">•</span>
                        <span>Added {new Date(method.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                        disabled={settingDefault === method.id}
                        className="text-xs"
                      >
                        {settingDefault === method.id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          'Set Default'
                        )}
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMethod(method.id)}
                      disabled={deletingMethod === method.id}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      {deletingMethod === method.id ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTrash />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Secure & Encrypted</h4>
            <p className="text-sm text-blue-700">
              Your payment information is encrypted and stored securely. We never store your full card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodManager;