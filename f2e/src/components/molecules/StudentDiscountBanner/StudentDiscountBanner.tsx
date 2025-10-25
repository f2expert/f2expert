import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import { Card, CardContent, CardHeader } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { cn } from '../../../lib/utils';
import { 
  FaRupeeSign, 
  FaClock, 
  FaCheck, 
  FaGraduationCap,
  FaUsers,
  FaCertificate,
  FaHeadset
} from 'react-icons/fa';

interface StudentDiscountBannerProps {
  originalPrice: number;
  discountedPrice: number;
  currency: string;
  validUntil?: string;
  studentsEnrolled: number;
  onApplyDiscount: () => void;
  className?: string;
}

export const StudentDiscountBanner: React.FC<StudentDiscountBannerProps> = ({
  originalPrice,
  discountedPrice,
  currency,
  validUntil,
  studentsEnrolled,
  onApplyDiscount,
  className
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  const savings = originalPrice - discountedPrice;

  return (
    <Card className={cn('border-orange-200 bg-gradient-to-r from-orange-50 to-red-50', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaGraduationCap className="text-orange-600" />
            <span className="font-bold text-orange-800">Student Special Offer</span>
            <Badge className="bg-red-500 text-white animate-pulse">
              {discountPercent}% OFF
            </Badge>
          </div>
          {validUntil && (
            <div className="flex items-center text-sm text-red-600">
              <FaClock className="mr-1" />
              <span>Valid till {validUntil}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Price Display */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-green-600 flex items-center">
                  <FaRupeeSign className="text-lg" />
                  {discountedPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-lg text-gray-500 line-through flex items-center">
                  <FaRupeeSign className="text-sm" />
                  {originalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-sm text-green-700 font-medium">
                You save {currency}{savings.toLocaleString('en-IN')}!
              </p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <FaUsers className="mr-1" />
                <span>{studentsEnrolled.toLocaleString()} students enrolled</span>
              </div>
              <Button
                size="sm"
                onClick={onApplyDiscount}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Enroll Now
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-green-700">
              <FaCheck className="mr-2 text-xs" />
              <span>Pay with UPI</span>
            </div>
            <div className="flex items-center text-green-700">
              <FaCheck className="mr-2 text-xs" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center text-green-700">
              <FaCheck className="mr-2 text-xs" />
              <span>Certificate Included</span>
            </div>
            <div className="flex items-center text-green-700">
              <FaCheck className="mr-2 text-xs" />
              <span>24/7 Support</span>
            </div>
          </div>

          {/* Toggle Details */}
          <div className="border-t border-orange-200 pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-orange-700 hover:text-orange-800 hover:bg-orange-100 p-0"
            >
              {showDetails ? 'Hide' : 'Show'} offer details
            </Button>

            {showDetails && (
              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <div className="bg-white/50 rounded-lg p-3">
                  <h4 className="font-medium text-orange-800 mb-2">What's Included:</h4>
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      <FaCertificate className="mr-2 text-purple-600 text-xs" />
                      Industry-recognized certificate
                    </li>
                    <li className="flex items-center">
                      <FaHeadset className="mr-2 text-blue-600 text-xs" />
                      Expert instructor support
                    </li>
                    <li className="flex items-center">
                      <FaRupeeSign className="mr-2 text-green-600 text-xs" />
                      Easy UPI payments
                    </li>
                    <li className="flex items-center">
                      <FaClock className="mr-2 text-orange-600 text-xs" />
                      Lifetime access to content
                    </li>
                  </ul>
                </div>
                
                <p className="text-xs text-gray-600 italic">
                  * Special pricing for students in India. Valid ID may be required.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentDiscountBanner;