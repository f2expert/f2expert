import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  setLoading,
  setProcessing,
  setError,
  setPaymentMethods,
  removePaymentMethod,
  setCurrentPaymentIntent,
  updatePaymentIntentStatus,
  setPaymentHistory,
  addPaymentHistory,
  updatePaymentHistoryStatus,
  applyCoupon,
  removeCoupon,
  resetPaymentState,
  clearError,
} from '../store/slices/paymentSlice';
import { 
  paymentApiService,
  type PaymentHistory,
  type CreatePaymentIntentRequest,
  type ProcessPaymentRequest,
  type RefundRequest,
} from '../services';

export const usePayment = () => {
  const dispatch = useAppDispatch();
  const paymentState = useAppSelector((state) => state.payment);

  // Load user's payment methods
  const loadPaymentMethods = useCallback(async (userId: string) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const methods = await paymentApiService.getPaymentMethods(userId);
      dispatch(setPaymentMethods(methods));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to load payment methods'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Add a new payment method
  const addNewPaymentMethod = useCallback(async (userId: string, paymentMethodId: string) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const success = await paymentApiService.savePaymentMethod(userId, paymentMethodId);
      if (success) {
        // Reload payment methods to get the updated list
        await loadPaymentMethods(userId);
      } else {
        throw new Error('Failed to save payment method');
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to add payment method'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, loadPaymentMethods]);

  // Delete a payment method
  const deletePaymentMethod = useCallback(async (paymentMethodId: string) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const success = await paymentApiService.deletePaymentMethod(paymentMethodId);
      if (success) {
        dispatch(removePaymentMethod(paymentMethodId));
      } else {
        throw new Error('Failed to delete payment method');
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to delete payment method'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Create payment intent for course purchase
  const createPaymentIntent = useCallback(async (data: CreatePaymentIntentRequest) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await paymentApiService.createPaymentIntent(data);
      if (response.success && response.data) {
        dispatch(setCurrentPaymentIntent(response.data));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create payment intent');
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to create payment intent'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Process payment
  const processPayment = useCallback(async (data: ProcessPaymentRequest) => {
    dispatch(setProcessing(true));
    dispatch(clearError());
    
    try {
      const response = await paymentApiService.processPayment(data);
      if (response.success && response.data) {
        dispatch(updatePaymentIntentStatus('succeeded'));
        
        // Add to payment history
        const paymentHistory: PaymentHistory = {
          id: response.data.paymentIntent.id,
          courseId: data.courseId,
          courseName: 'Course Name', // This should come from the course data
          amount: response.data.paymentIntent.amount,
          currency: response.data.paymentIntent.currency,
          status: 'completed',
          paymentMethod: 'card', // This should be determined from the payment method
          transactionId: response.data.paymentIntent.id,
          createdAt: new Date().toISOString(),
        };
        dispatch(addPaymentHistory(paymentHistory));
        
        return response.data;
      } else {
        throw new Error(response.message || 'Payment failed');
      }
    } catch (error) {
      dispatch(updatePaymentIntentStatus('canceled'));
      dispatch(setError(error instanceof Error ? error.message : 'Payment failed'));
      throw error;
    } finally {
      dispatch(setProcessing(false));
    }
  }, [dispatch]);

  // Load payment history
  const loadPaymentHistory = useCallback(async (userId: string) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const history = await paymentApiService.getPaymentHistory(userId);
      dispatch(setPaymentHistory(history));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to load payment history'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Request refund
  const requestRefund = useCallback(async (data: RefundRequest) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await paymentApiService.requestRefund(data);
      if (response.success) {
        // Update payment history status
        dispatch(updatePaymentHistoryStatus({
          paymentId: data.paymentIntentId,
          status: 'refunded'
        }));
        return response.data;
      } else {
        throw new Error(response.message || 'Refund request failed');
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Refund request failed'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Validate and apply coupon
  const validateAndApplyCoupon = useCallback(async (couponCode: string, courseId: string) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const result = await paymentApiService.validateCoupon(couponCode, courseId);
      if (result.valid) {
        dispatch(applyCoupon({
          code: couponCode,
          discount: result.discount,
          discountType: result.discountType
        }));
        return true;
      } else {
        dispatch(setError(result.message || 'Invalid coupon code'));
        return false;
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to validate coupon'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Remove applied coupon
  const removeAppliedCoupon = useCallback(() => {
    dispatch(removeCoupon());
  }, [dispatch]);

  // Reset payment state
  const resetPayment = useCallback(() => {
    dispatch(resetPaymentState());
  }, [dispatch]);

  // Clear errors
  const clearPaymentError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    ...paymentState,
    
    // Actions
    loadPaymentMethods,
    addNewPaymentMethod,
    deletePaymentMethod,
    createPaymentIntent,
    processPayment,
    loadPaymentHistory,
    requestRefund,
    validateAndApplyCoupon,
    removeAppliedCoupon,
    resetPayment,
    clearPaymentError,
  };
};

export default usePayment;