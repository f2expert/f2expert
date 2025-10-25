// Types for payment-related data
export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'upi';
  brand?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  upiId?: string; // For UPI payments
  isDefault: boolean;
  createdAt: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'canceled';
  courseId: string;
  userId: string;
  createdAt: string;
}

export interface PaymentHistory {
  id: string;
  courseId: string;
  courseName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
}

export interface CreatePaymentIntentRequest {
  courseId: string;
  amount: number;
  currency: string;
  paymentMethodId?: string;
  savePaymentMethod?: boolean;
}

export interface CreatePaymentIntentResponse {
  success: boolean;
  data?: PaymentIntent;
  message?: string;
}

export interface ProcessPaymentRequest {
  paymentIntentId: string;
  paymentMethodId: string;
  courseId: string;
}

export interface ProcessPaymentResponse {
  success: boolean;
  data?: {
    paymentIntent: PaymentIntent;
    enrollmentId: string;
  };
  message?: string;
}

export interface RefundRequest {
  paymentIntentId: string;
  enrollmentId: string;
  reason?: string;
}

export interface RefundResponse {
  success: boolean;
  data?: {
    refundId: string;
    amount: number;
    status: string;
  };
  message?: string;
}

// Payment gateway configuration (can be extended for multiple providers)
export const PAYMENT_CONFIG = {
  STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_test_key_here',
  UPI_MERCHANT_ID: import.meta.env.VITE_UPI_MERCHANT_ID || 'your_merchant_id',
  SUPPORTED_CURRENCIES: ['USD', 'EUR', 'GBP', 'INR'],
  SUPPORTED_PAYMENT_METHODS: ['card', 'bank_transfer', 'upi'],
  UPI_APPS: ['phonepe', 'googlepay', 'paytm', 'bhim', 'amazonpay'],
};

// Payment API service
class PaymentApiService {
  private baseUrl = 'http://localhost:5000/api/payments';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if available
        // 'Authorization': `Bearer ${getAuthToken()}`,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Create payment intent for course purchase
  async createPaymentIntent(data: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> {
    try {
      return await this.request<CreatePaymentIntentResponse>('/create-intent', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Process payment after confirmation
  async processPayment(data: ProcessPaymentRequest): Promise<ProcessPaymentResponse> {
    try {
      return await this.request<ProcessPaymentResponse>('/process', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Get user's payment methods
  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const response = await this.request<{ success: boolean; data: PaymentMethod[] }>(`/methods/${userId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }

  // Save payment method for future use
  async savePaymentMethod(userId: string, paymentMethodId: string): Promise<boolean> {
    try {
      const response = await this.request<{ success: boolean }>('/methods', {
        method: 'POST',
        body: JSON.stringify({ userId, paymentMethodId }),
      });
      return response.success;
    } catch (error) {
      console.error('Error saving payment method:', error);
      return false;
    }
  }

  // Delete payment method
  async deletePaymentMethod(paymentMethodId: string): Promise<boolean> {
    try {
      const response = await this.request<{ success: boolean }>(`/methods/${paymentMethodId}`, {
        method: 'DELETE',
      });
      return response.success;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      return false;
    }
  }

  // Get payment history
  async getPaymentHistory(userId: string): Promise<PaymentHistory[]> {
    try {
      const response = await this.request<{ success: boolean; data: PaymentHistory[] }>(`/history/${userId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }

  // Request refund
  async requestRefund(data: RefundRequest): Promise<RefundResponse> {
    try {
      return await this.request<RefundResponse>('/refund', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error requesting refund:', error);
      throw error;
    }
  }

  // Validate coupon code
  async validateCoupon(couponCode: string, courseId: string): Promise<{
    valid: boolean;
    discount: number;
    discountType: 'percentage' | 'fixed';
    message?: string;
  }> {
    try {
      const response = await this.request<{
        success: boolean;
        data?: {
          valid: boolean;
          discount: number;
          discountType: 'percentage' | 'fixed';
        };
        message?: string;
      }>(`/validate-coupon`, {
        method: 'POST',
        body: JSON.stringify({ couponCode, courseId }),
      });

      return {
        valid: response.data?.valid || false,
        discount: response.data?.discount || 0,
        discountType: response.data?.discountType || 'percentage',
        message: response.message,
      };
    } catch (error) {
      console.error('Error validating coupon:', error);
      return {
        valid: false,
        discount: 0,
        discountType: 'percentage',
        message: 'Failed to validate coupon',
      };
    }
  }
}

export const paymentApiService = new PaymentApiService();