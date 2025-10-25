import React, { useState, useEffect } from 'react';
import { Button } from '../../atoms/Button';
import { Card, CardContent, CardHeader } from '../../atoms/Card';
import { Input } from '../../atoms/Input';
import { Badge } from '../../atoms/Badge';
import { Separator } from '../../atoms/Separator';
import { cn } from '../../../lib/utils';
import { 
  FaCreditCard, 
  FaPaypal, 
  FaUniversity, 
  FaShieldAlt, 
  FaLock,
  FaCheck,
  FaTimes,
  FaPlus,
  FaSpinner,
  FaTag
} from 'react-icons/fa';
import type { PaymentMethod, CourseDetails } from '../../../services';

interface PaymentGatewayProps {
  course: CourseDetails;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (enrollmentId: string) => void;
  onPaymentError: (error: string) => void;
  onUpiSelected?: () => void;
  isProcessing?: boolean;
}

interface CardFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  saveCard: boolean;
}

interface UpiFormData {
  upiId: string;
  selectedApp: string;
  saveUpi: boolean;
}

interface CouponData {
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  course,
  isOpen,
  onClose,
  onPaymentSuccess,
  onPaymentError,
  onUpiSelected,
  isProcessing = false
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal' | 'bank' | 'upi'>('card');
  const [savedMethods, setSavedMethods] = useState<PaymentMethod[]>([]);
  const [useNewCard, setUseNewCard] = useState(true);
  const [selectedSavedCard, setSelectedSavedCard] = useState<string | null>(null);
  const [, setIsLoadingMethods] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Card form state
  const [cardForm, setCardForm] = useState<CardFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    saveCard: false
  });

  // UPI form state
  const [upiForm, setUpiForm] = useState<UpiFormData>({
    upiId: '',
    selectedApp: 'phonepe',
    saveUpi: false
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Price calculations
  const originalPrice = course.price;
  const discountAmount = appliedCoupon 
    ? appliedCoupon.discountType === 'percentage' 
      ? (originalPrice * appliedCoupon.discount) / 100
      : appliedCoupon.discount
    : 0;
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const processingFee = finalPrice * 0.029; // 2.9% processing fee
  const totalAmount = finalPrice + processingFee;

  // Load saved payment methods
  useEffect(() => {
    if (isOpen) {
      loadSavedPaymentMethods();
    }
  }, [isOpen]);

  const loadSavedPaymentMethods = async () => {
    setIsLoadingMethods(true);
    try {
      // Mock saved payment methods - replace with actual API call
      const mockMethods: PaymentMethod[] = [
        {
          id: 'pm_1',
          type: 'card',
          brand: 'visa',
          last4: '4242',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true,
          createdAt: '2024-01-01'
        },
        {
          id: 'pm_2',
          type: 'upi',
          upiId: 'student@paytm',
          isDefault: false,
          createdAt: '2024-02-01'
        },
        {
          id: 'pm_3',
          type: 'card',
          brand: 'mastercard',
          last4: '8888',
          expiryMonth: 8,
          expiryYear: 2026,
          isDefault: false,
          createdAt: '2024-02-15'
        }
      ];
      setSavedMethods(mockMethods);
      
      // Select default card if available
      const defaultCard = mockMethods.find(method => method.isDefault);
      if (defaultCard && mockMethods.length > 0) {
        setSelectedSavedCard(defaultCard.id);
        setUseNewCard(false);
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    } finally {
      setIsLoadingMethods(false);
    }
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsCouponLoading(true);
    setCouponError(null);
    
    try {
      // Mock coupon validation - replace with actual API call
      const mockCoupons: Record<string, CouponData> = {
        'SAVE20': { code: 'SAVE20', discount: 20, discountType: 'percentage' },
        'WELCOME50': { code: 'WELCOME50', discount: 50, discountType: 'fixed' },
        'STUDENT10': { code: 'STUDENT10', discount: 10, discountType: 'percentage' }
      };
      
      const coupon = mockCoupons[couponCode.toUpperCase()];
      if (coupon) {
        setAppliedCoupon(coupon);
        setCouponCode('');
      } else {
        setCouponError('Invalid coupon code');
      }
    } catch {
      setCouponError('Failed to validate coupon');
    } finally {
      setIsCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardInputChange = (field: keyof CardFormData, value: string | boolean) => {
    setCardForm(prev => ({
      ...prev,
      [field]: field === 'cardNumber' && typeof value === 'string' 
        ? formatCardNumber(value)
        : field === 'expiryDate' && typeof value === 'string'
        ? formatExpiryDate(value)
        : value
    }));
  };

  const handleUpiInputChange = (field: keyof UpiFormData, value: string | boolean) => {
    setUpiForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateUpiId = (upiId: string): boolean => {
    // UPI ID format: username@bank (e.g., john@paytm, user@oksbi)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upiId);
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    // Handle UPI payment - redirect to QR code
    if (selectedMethod === 'upi' && onUpiSelected) {
      onUpiSelected();
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock payment processing - replace with actual payment integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate payment success
      const mockEnrollmentId = `enroll_${Date.now()}`;
      onPaymentSuccess(mockEnrollmentId);
      
      // Reset forms
      setCardForm({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        saveCard: false
      });
      
      setUpiForm({
        upiId: '',
        selectedApp: 'phonepe',
        saveUpi: false
      });
      
    } catch (error) {
      onPaymentError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): boolean => {
    if (selectedMethod === 'card') {
      if (useNewCard) {
        if (!cardForm.cardNumber || !cardForm.expiryDate || !cardForm.cvv || !cardForm.cardholderName) {
          onPaymentError('Please fill in all card details');
          return false;
        }
      } else if (!selectedSavedCard) {
        onPaymentError('Please select a payment method');
        return false;
      }
    } else if (selectedMethod === 'upi') {
      if (!upiForm.upiId || !validateUpiId(upiForm.upiId)) {
        onPaymentError('Please enter a valid UPI ID (e.g., user@paytm)');
        return false;
      }
    }
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Panel - Course Info & Order Summary */}
          <div className="bg-gray-50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Complete Purchase</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting || isProcessing}
              >
                <FaTimes />
              </Button>
            </div>

            {/* Course Info */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <img
                    src={course.thumbnailUrl || '/assets/topics/default-course.png'}
                    alt={course.title}
                    className="w-20 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{course.level}</Badge>
                      <span className="text-sm text-gray-500">{course.duration}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coupon Section */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <h3 className="font-semibold flex items-center">
                  <FaTag className="mr-2 text-green-600" />
                  Coupon Code
                </h3>
              </CardHeader>
              <CardContent className="pt-0">
                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaCheck className="text-green-600 mr-2" />
                        <span className="font-semibold text-green-800">
                          {appliedCoupon.code} Applied
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeCoupon}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      {appliedCoupon.discountType === 'percentage' 
                        ? `${appliedCoupon.discount}% discount applied`
                        : `$${appliedCoupon.discount} discount applied`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={validateCoupon}
                      disabled={isCouponLoading || !couponCode.trim()}
                    >
                      {isCouponLoading ? <FaSpinner className="animate-spin" /> : 'Apply'}
                    </Button>
                  </div>
                )}
                {couponError && (
                  <p className="text-sm text-red-600 mt-2">{couponError}</p>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader className="pb-3">
                <h3 className="font-semibold">Order Summary</h3>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Course Price</span>
                    <span>{course.currency}{originalPrice}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-{course.currency}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Processing Fee (2.9%)</span>
                    <span>{course.currency}{processingFee.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{course.currency}{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Payment Methods */}
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-6">Payment Method</h3>

            {/* Payment Method Selection */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
              <Button
                variant={selectedMethod === 'card' ? 'primary' : 'outline'}
                className="flex flex-col items-center p-4 h-auto"
                onClick={() => setSelectedMethod('card')}
              >
                <FaCreditCard className="text-2xl mb-2" />
                <span className="text-sm">Card</span>
              </Button>
              
              <Button
                variant={selectedMethod === 'upi' ? 'primary' : 'outline'}
                className="flex flex-col items-center p-4 h-auto"
                onClick={() => setSelectedMethod('upi')}
              >
                <div className="text-2xl mb-2 font-bold text-purple-600">₹</div>
                <span className="text-sm">UPI</span>
              </Button>
              
              <Button
                variant={selectedMethod === 'paypal' ? 'primary' : 'outline'}
                className="flex flex-col items-center p-4 h-auto"
                onClick={() => setSelectedMethod('paypal')}
              >
                <FaPaypal className="text-2xl mb-2" />
                <span className="text-sm">PayPal</span>
              </Button>
              
              <Button
                variant={selectedMethod === 'bank' ? 'primary' : 'outline'}
                className="flex flex-col items-center p-4 h-auto"
                onClick={() => setSelectedMethod('bank')}
              >
                <FaUniversity className="text-2xl mb-2" />
                <span className="text-sm">Bank</span>
              </Button>
            </div>

            {/* Card Payment Form */}
            {selectedMethod === 'card' && (
              <div className="space-y-6">
                {/* Saved Cards */}
                {savedMethods.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Saved Payment Methods</h4>
                    <div className="space-y-2 mb-4">
                      {savedMethods.map((method) => (
                        <label
                          key={method.id}
                          className={cn(
                            'flex items-center p-3 border rounded-lg cursor-pointer',
                            selectedSavedCard === method.id && !useNewCard
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <input
                            type="radio"
                            name="payment-method"
                            checked={selectedSavedCard === method.id && !useNewCard}
                            onChange={() => {
                              setSelectedSavedCard(method.id);
                              setUseNewCard(false);
                            }}
                            className="mr-3"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center">
                              <FaCreditCard className="mr-2 text-gray-400" />
                              <span className="capitalize">{method.brand}</span>
                              <span className="ml-2">••••{method.last4}</span>
                              <span className="ml-2 text-sm text-gray-500">
                                {method.expiryMonth}/{method.expiryYear}
                              </span>
                            </div>
                            {method.isDefault && (
                              <Badge variant="secondary" className="ml-2">Default</Badge>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUseNewCard(true);
                        setSelectedSavedCard(null);
                      }}
                      className="flex items-center"
                    >
                      <FaPlus className="mr-2" />
                      Use New Card
                    </Button>
                    
                    {useNewCard && <Separator className="my-4" />}
                  </div>
                )}

                {/* New Card Form */}
                {(useNewCard || savedMethods.length === 0) && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={cardForm.cardNumber}
                        onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <Input
                          placeholder="MM/YY"
                          value={cardForm.expiryDate}
                          onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVC *
                        </label>
                        <Input
                          placeholder="123"
                          value={cardForm.cvv}
                          onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                          maxLength={4}
                          type="password"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name *
                      </label>
                      <Input
                        placeholder="John Doe"
                        value={cardForm.cardholderName}
                        onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                      />
                    </div>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={cardForm.saveCard}
                        onChange={(e) => handleCardInputChange('saveCard', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Save this card for future purchases</span>
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* PayPal */}
            {selectedMethod === 'paypal' && (
              <div className="text-center py-8">
                <FaPaypal className="text-6xl text-blue-600 mb-4 mx-auto" />
                <p className="text-gray-600 mb-4">
                  You will be redirected to PayPal to complete your payment securely.
                </p>
              </div>
            )}

            {/* UPI Payment */}
            {selectedMethod === 'upi' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4 text-purple-600 font-bold">₹</div>
                  <h3 className="text-lg font-semibold mb-2">Pay with UPI</h3>
                  <p className="text-gray-600 text-sm">
                    Quick and secure payments using your UPI ID
                  </p>
                </div>

                {/* UPI Apps Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose your preferred UPI app
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {['phonepe', 'googlepay', 'paytm'].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => handleUpiInputChange('selectedApp', app)}
                        className={cn(
                          'p-3 border rounded-lg text-center transition-colors',
                          upiForm.selectedApp === app
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="font-medium capitalize text-sm">
                          {app === 'phonepe' ? 'PhonePe' : 
                           app === 'googlepay' ? 'Google Pay' : 
                           'Paytm'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* UPI ID Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID *
                  </label>
                  <Input
                    placeholder="yourname@paytm"
                    value={upiForm.upiId}
                    onChange={(e) => handleUpiInputChange('upiId', e.target.value)}
                    className={cn(
                      validateUpiId(upiForm.upiId) || !upiForm.upiId 
                        ? '' 
                        : 'border-red-300 focus:border-red-500'
                    )}
                  />
                  {upiForm.upiId && !validateUpiId(upiForm.upiId) && (
                    <p className="text-red-600 text-sm mt-1">
                      Please enter a valid UPI ID (e.g., user@paytm)
                    </p>
                  )}
                </div>

                {/* Save UPI Option */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={upiForm.saveUpi}
                    onChange={(e) => handleUpiInputChange('saveUpi', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Save this UPI ID for future payments</span>
                </label>

                {/* UPI Benefits */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center text-green-800 mb-2">
                    <FaCheck className="mr-2" />
                    <span className="font-medium">UPI Benefits</span>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Instant payment confirmation</li>
                    <li>• No additional charges</li>
                    <li>• Bank-level security</li>
                    <li>• 24/7 availability</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Bank Transfer */}
            {selectedMethod === 'bank' && (
              <div className="text-center py-8">
                <FaUniversity className="text-6xl text-green-600 mb-4 mx-auto" />
                <p className="text-gray-600 mb-4">
                  Bank transfer instructions will be provided after confirming your order.
                </p>
                <p className="text-sm text-gray-500">
                  Processing time: 1-3 business days
                </p>
              </div>
            )}

            {/* Security Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center text-blue-800">
                <FaShieldAlt className="mr-2" />
                <span className="font-medium">Secure Payment</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Your payment information is encrypted and processed securely. We never store your card details.
              </p>
            </div>

            {/* Payment Button */}
            <Button
              className="w-full py-3 text-lg"
              onClick={handlePayment}
              disabled={isSubmitting || isProcessing}
            >
              {isSubmitting || isProcessing ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <FaLock className="mr-2" />
                  {selectedMethod === 'upi' ? `Pay ₹${totalAmount.toFixed(2)} with UPI` : `Pay ${course.currency}${totalAmount.toFixed(2)}`}
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By completing your purchase, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;