// Debug utility for authentication issues
import { getAuthHeader, getAuthToken, authTokenManager } from '../utils/auth';

// Type definitions for debugging
interface WindowWithRedux extends Window {
  __REDUX_DEVTOOLS_EXTENSION__?: unknown;
  store?: {
    getState: () => {
      auth?: unknown;
    };
  };
  authDebug?: {
    debugAuthState: () => unknown;
    setTestTokens: () => void;
    clearAllAuthData: () => void;
    checkReduxAuthState: () => unknown;
    diagnoseAuthIssue: () => unknown;
  };
}

// Function to debug auth state
export const debugAuthState = () => {
  console.log('🔍 === AUTH DEBUG STATE ===');
  
  // Check localStorage directly
  console.log('📦 LocalStorage contents:');
  console.log('  auth_tokens:', localStorage.getItem('auth_tokens'));
  console.log('  user_data:', localStorage.getItem('user_data'));
  
  // Check sessionStorage as well
  console.log('📦 SessionStorage contents:');
  console.log('  auth_tokens:', sessionStorage.getItem('auth_tokens'));
  console.log('  user_data:', sessionStorage.getItem('user_data'));
  
  // Check token manager state
  console.log('🎯 Token Manager State:');
  console.log('  isAuthenticated:', authTokenManager.isAuthenticated());
  console.log('  getUserData:', authTokenManager.getUserData());
  console.log('  getTokenExpiration:', authTokenManager.getTokenExpiration());
  console.log('  isTokenExpired:', authTokenManager.isTokenExpired());
  
  // Try to get tokens
  console.log('🔑 Token Retrieval:');
  const token = getAuthToken();
  console.log('  getAuthToken():', token ? `${token.substring(0, 20)}...` : null);
  
  const authHeader = getAuthHeader();
  console.log('  getAuthHeader():', authHeader ? `${authHeader.substring(0, 30)}...` : null);
  
  console.log('🔍 === END AUTH DEBUG ===');
  
  return {
    hasTokenInStorage: !!localStorage.getItem('auth_tokens'),
    hasUserInStorage: !!localStorage.getItem('user_data'),
    isAuthenticated: authTokenManager.isAuthenticated(),
    hasToken: !!token,
    hasAuthHeader: !!authHeader,
    tokenExpired: authTokenManager.isTokenExpired()
  };
};

// Function to manually set test tokens
export const setTestTokens = () => {
  console.log('🧪 Setting test tokens...');
  
  const testTokens = {
    accessToken: 'test_access_token_12345',
    refreshToken: 'test_refresh_token_67890',
    tokenType: 'Bearer',
    expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour from now
  };
  
  const testUser = {
    id: 'test_user_id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'admin'
  };
  
  // Store directly in localStorage
  localStorage.setItem('auth_tokens', JSON.stringify(testTokens));
  localStorage.setItem('user_data', JSON.stringify(testUser));
  
  console.log('✅ Test tokens set in localStorage');
  
  // Also set through token manager
  authTokenManager.setTokens(testTokens, testUser);
  
  console.log('✅ Test tokens set through token manager');
  
  // Verify
  debugAuthState();
};

// Function to clear all auth data
export const clearAllAuthData = () => {
  console.log('🧹 Clearing all auth data...');
  
  localStorage.removeItem('auth_tokens');
  localStorage.removeItem('user_data');
  sessionStorage.removeItem('auth_tokens');
  sessionStorage.removeItem('user_data');
  
  authTokenManager.clearTokens();
  
  console.log('✅ All auth data cleared');
  debugAuthState();
};

// Function to check if tokens exist in any Redux store
export const checkReduxAuthState = () => {
  console.log('🔍 Checking Redux auth state...');
  
  // Check if window has Redux DevTools
  if (typeof window !== 'undefined' && (window as WindowWithRedux).__REDUX_DEVTOOLS_EXTENSION__) {
    console.log('🔧 Redux DevTools available - check the store manually');
  }
  
  // Try to access Redux store if available globally
  if (typeof window !== 'undefined' && (window as WindowWithRedux).store) {
    const state = (window as WindowWithRedux).store?.getState();
    console.log('🏪 Redux store auth state:', state?.auth);
    return state?.auth;
  }
  
  console.log('❌ No Redux store accessible');
  return null;
};

// Comprehensive auth diagnosis
export const diagnoseAuthIssue = () => {
  console.log('🏥 === COMPREHENSIVE AUTH DIAGNOSIS ===');
  
  const debugResult = debugAuthState();
  const reduxState = checkReduxAuthState();
  
  console.log('📊 Diagnosis Summary:');
  console.log('  Storage has tokens:', debugResult.hasTokenInStorage);
  console.log('  Storage has user:', debugResult.hasUserInStorage);
  console.log('  Token manager authenticated:', debugResult.isAuthenticated);
  console.log('  Can retrieve token:', debugResult.hasToken);
  console.log('  Can get auth header:', debugResult.hasAuthHeader);
  console.log('  Token expired:', debugResult.tokenExpired);
  console.log('  Redux auth state:', reduxState);
  
  // Provide recommendations
  console.log('💡 Recommendations:');
  
  if (!debugResult.hasTokenInStorage) {
    console.log('  ❌ No tokens in storage - user needs to log in');
  } else if (debugResult.tokenExpired) {
    console.log('  ⏰ Token expired - needs refresh or re-login');
  } else if (!debugResult.hasToken) {
    console.log('  🔧 Token exists in storage but token manager can\'t retrieve it - check parsing');
  } else if (!debugResult.hasAuthHeader) {
    console.log('  🔧 Token retrieved but auth header generation failed - check token format');
  } else {
    console.log('  ✅ Everything looks good - auth should be working');
  }
  
  console.log('🏥 === END DIAGNOSIS ===');
  
  return {
    ...debugResult,
    reduxState,
    needsLogin: !debugResult.hasTokenInStorage,
    needsRefresh: debugResult.tokenExpired,
    hasParsingIssue: debugResult.hasTokenInStorage && !debugResult.hasToken,
    hasHeaderIssue: debugResult.hasToken && !debugResult.hasAuthHeader
  };
};

// Export all functions for easy access in browser console
if (typeof window !== 'undefined') {
  (window as WindowWithRedux).authDebug = {
    debugAuthState,
    setTestTokens,
    clearAllAuthData,
    checkReduxAuthState,
    diagnoseAuthIssue
  };
  
  console.log('🛠️ Auth debug tools available on window.authDebug');
}

export default {
  debugAuthState,
  setTestTokens,
  clearAllAuthData,
  checkReduxAuthState,
  diagnoseAuthIssue
};