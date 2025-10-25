import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PaymentMethod, PaymentIntent, PaymentHistory } from '../../services/paymentApi';

interface PaymentState {
  paymentMethods: PaymentMethod[];
  paymentHistory: PaymentHistory[];
  currentPaymentIntent: PaymentIntent | null;
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
  appliedCoupon: {
    code: string;
    discount: number;
    discountType: 'percentage' | 'fixed';
  } | null;
}

const initialState: PaymentState = {
  paymentMethods: [],
  paymentHistory: [],
  currentPaymentIntent: null,
  isLoading: false,
  isProcessing: false,
  error: null,
  appliedCoupon: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Payment methods
    setPaymentMethods: (state, action: PayloadAction<PaymentMethod[]>) => {
      state.paymentMethods = action.payload;
    },
    addPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.paymentMethods.push(action.payload);
    },
    removePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethods = state.paymentMethods.filter(
        method => method.id !== action.payload
      );
    },
    updatePaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      const index = state.paymentMethods.findIndex(
        method => method.id === action.payload.id
      );
      if (index !== -1) {
        state.paymentMethods[index] = action.payload;
      }
    },

    // Payment intent
    setCurrentPaymentIntent: (state, action: PayloadAction<PaymentIntent | null>) => {
      state.currentPaymentIntent = action.payload;
    },
    updatePaymentIntentStatus: (state, action: PayloadAction<PaymentIntent['status']>) => {
      if (state.currentPaymentIntent) {
        state.currentPaymentIntent.status = action.payload;
      }
    },

    // Payment history
    setPaymentHistory: (state, action: PayloadAction<PaymentHistory[]>) => {
      state.paymentHistory = action.payload;
    },
    addPaymentHistory: (state, action: PayloadAction<PaymentHistory>) => {
      state.paymentHistory.unshift(action.payload);
    },
    updatePaymentHistoryStatus: (state, action: PayloadAction<{
      paymentId: string;
      status: PaymentHistory['status'];
    }>) => {
      const index = state.paymentHistory.findIndex(
        payment => payment.id === action.payload.paymentId
      );
      if (index !== -1) {
        state.paymentHistory[index].status = action.payload.status;
      }
    },

    // Coupon management
    applyCoupon: (state, action: PayloadAction<{
      code: string;
      discount: number;
      discountType: 'percentage' | 'fixed';
    }>) => {
      state.appliedCoupon = action.payload;
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
    },

    // Reset states
    resetPaymentState: (state) => {
      state.currentPaymentIntent = null;
      state.isLoading = false;
      state.isProcessing = false;
      state.error = null;
      state.appliedCoupon = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setProcessing,
  setError,
  setPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  updatePaymentMethod,
  setCurrentPaymentIntent,
  updatePaymentIntentStatus,
  setPaymentHistory,
  addPaymentHistory,
  updatePaymentHistoryStatus,
  applyCoupon,
  removeCoupon,
  resetPaymentState,
  clearError,
} = paymentSlice.actions;

export default paymentSlice.reducer;