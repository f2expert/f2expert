import React from 'react';
import { Button } from '../../atoms/Button';
import { Card, CardContent, CardHeader } from '../../atoms/Card';
import { cn } from '../../../lib/utils';
import { FaQrcode, FaLink, FaCheck } from 'react-icons/fa';

interface UpiQrCodeProps {
  merchantId: string;
  amount: number;
  currency: string;
  courseName: string;
  studentName?: string;
  onPaymentComplete: (transactionId: string) => void;
  onCancel: () => void;
}

export const UpiQrCode: React.FC<UpiQrCodeProps> = ({
  merchantId,
  amount,
  currency,
  courseName,
  studentName,
  onPaymentComplete,
  onCancel
}) => {
  // Generate UPI payment URL
  const generateUpiUrl = (app: string) => {
    const upiUrl = `upi://pay?pa=${merchantId}&pn=F2Expert&am=${amount}&cu=${currency}&tn=Course:${encodeURIComponent(courseName)}`;
    
    switch (app) {
      case 'phonepe':
        return `phonepe://pay?${new URLSearchParams({
          pa: merchantId,
          pn: 'F2Expert',
          am: amount.toString(),
          cu: currency,
          tn: `Course: ${courseName}`
        })}`;
      case 'googlepay':
        return `gpay://upi/pay?${new URLSearchParams({
          pa: merchantId,
          pn: 'F2Expert',
          am: amount.toString(),
          cu: currency,
          tn: `Course: ${courseName}`
        })}`;
      case 'paytm':
        return `paytmmp://pay?${new URLSearchParams({
          pa: merchantId,
          pn: 'F2Expert',
          am: amount.toString(),
          cu: currency,
          tn: `Course: ${courseName}`
        })}`;
      default:
        return upiUrl;
    }
  };

  const handleUpiAppClick = (app: string) => {
    const url = generateUpiUrl(app);
    window.location.href = url;
  };

  const handleManualComplete = () => {
    const transactionId = `TXN${Date.now()}`;
    onPaymentComplete(transactionId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <h3 className="text-xl font-bold">Pay with UPI</h3>
          <p className="text-gray-600">Complete your payment using any UPI app</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Course:</span>
              <span className="font-medium">{courseName}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-lg">{currency}{amount}</span>
            </div>
            {studentName && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Student:</span>
                <span className="font-medium">{studentName}</span>
              </div>
            )}
          </div>

          {/* QR Code Placeholder */}
          <div className="text-center">
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
              <FaQrcode className="text-6xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                QR Code for UPI Payment
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Scan this QR code with any UPI app to pay
            </p>
          </div>

          {/* UPI Apps */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">
              Or choose your preferred UPI app:
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-100 text-purple-700 border-purple-200' },
                { id: 'googlepay', name: 'Google Pay', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                { id: 'paytm', name: 'Paytm', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }
              ].map((app) => (
                <Button
                  key={app.id}
                  variant="outline"
                  onClick={() => handleUpiAppClick(app.id)}
                  className={cn('text-xs py-2', app.color)}
                >
                  {app.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Manual Link */}
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const upiUrl = generateUpiUrl('default');
                navigator.clipboard.writeText(upiUrl);
                alert('UPI payment link copied to clipboard!');
              }}
              className="flex items-center mx-auto"
            >
              <FaLink className="mr-2" />
              Copy UPI Link
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleManualComplete}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <FaCheck className="mr-2" />
              Payment Done
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm font-medium mb-1">Payment Instructions:</p>
            <ol className="text-blue-700 text-xs space-y-1">
              <li>1. Open your UPI app (PhonePe, Google Pay, Paytm, etc.)</li>
              <li>2. Scan the QR code or click on your preferred UPI app</li>
              <li>3. Verify the payment details and complete the transaction</li>
              <li>4. Click "Payment Done" after successful payment</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpiQrCode;