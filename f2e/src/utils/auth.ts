// Authentication Token Management Utility

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresAt?: number;
}

export interface UserTokenData {
  user: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
  tokens: AuthTokens;
}

// Token storage keys
const TOKEN_STORAGE_KEY = 'auth_tokens';
const USER_DATA_KEY = 'user_data';

class AuthTokenManager {
  private static instance: AuthTokenManager;
  private tokens: AuthTokens | null = null;
  private userData: UserTokenData['user'] | null = null;

  private constructor() {
    this.loadTokensFromStorage();
  }

  public static getInstance(): AuthTokenManager {
    if (!AuthTokenManager.instance) {
      AuthTokenManager.instance = new AuthTokenManager();
    }
    return AuthTokenManager.instance;
  }

  /**
   * Get the current access token
   * @returns Access token string or null if not available
   */
  public getAuthToken(): string | null {
    if (!this.tokens) {
      this.loadTokensFromStorage();
    }

    if (!this.tokens?.accessToken) {
      console.warn('No access token available');
      return null;
    }

    // Check if token is expired
    if (this.isTokenExpired()) {
      console.warn('Access token has expired');
      this.clearTokens();
      return null;
    }

    return this.tokens.accessToken;
  }

  /**
   * Get authorization header value
   * @returns Authorization header string or null
   */
  public getAuthHeader(): string | null {
    const token = this.getAuthToken();
    if (!token) return null;

    const tokenType = this.tokens?.tokenType || 'Bearer';
    return `${tokenType} ${token}`;
  }

  /**
   * Set authentication tokens
   * @param tokens Token data
   * @param userData Optional user data
   */
  public setTokens(tokens: AuthTokens, userData?: UserTokenData['user']): void {
    // Calculate expiration if not provided
    if (!tokens.expiresAt && tokens.accessToken) {
      // Default to 1 hour if no expiration provided
      tokens.expiresAt = Date.now() + (60 * 60 * 1000);
    }

    this.tokens = tokens;
    
    if (userData) {
      this.userData = userData;
    }

    this.saveTokensToStorage();
    console.log('Authentication tokens set successfully');
  }

  /**
   * Clear all authentication data
   */
  public clearTokens(): void {
    this.tokens = null;
    this.userData = null;
    
    // Clear from storage
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.warn('Error clearing tokens from storage:', error);
    }

    console.log('Authentication tokens cleared');
  }

  /**
   * Check if user is authenticated
   * @returns True if user has valid token
   */
  public isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return !!token;
  }

  /**
   * Check if token is expired
   * @returns True if token is expired
   */
  public isTokenExpired(): boolean {
    if (!this.tokens?.expiresAt) {
      return false; // No expiration data, assume valid
    }

    return Date.now() >= this.tokens.expiresAt;
  }

  /**
   * Get current user data
   * @returns User data or null
   */
  public getUserData(): UserTokenData['user'] | null {
    if (!this.userData) {
      this.loadTokensFromStorage();
    }
    return this.userData;
  }

  /**
   * Get refresh token
   * @returns Refresh token or null
   */
  public getRefreshToken(): string | null {
    return this.tokens?.refreshToken || null;
  }

  /**
   * Refresh the access token using refresh token
   * @returns Promise with new tokens or null if failed
   */
  public async refreshAccessToken(): Promise<AuthTokens | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.warn('No refresh token available');
      return null;
    }

    try {
      const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.tokens) {
        this.setTokens(data.tokens);
        return data.tokens;
      }

      throw new Error('Invalid refresh token response');
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clearTokens();
      return null;
    }
  }

  /**
   * Load tokens from storage (localStorage with sessionStorage fallback)
   */
  private loadTokensFromStorage(): void {
    try {
      // Try localStorage first, then sessionStorage
      const tokenData = localStorage.getItem(TOKEN_STORAGE_KEY) || 
                       sessionStorage.getItem(TOKEN_STORAGE_KEY);
      const userData = localStorage.getItem(USER_DATA_KEY) || 
                      sessionStorage.getItem(USER_DATA_KEY);

      if (tokenData) {
        this.tokens = JSON.parse(tokenData);
      }

      if (userData) {
        this.userData = JSON.parse(userData);
      }
    } catch (error) {
      console.warn('Error loading tokens from storage:', error);
      this.clearTokens();
    }
  }

  /**
   * Save tokens to storage
   */
  private saveTokensToStorage(): void {
    try {
      if (this.tokens) {
        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(this.tokens));
      }

      if (this.userData) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(this.userData));
      }
    } catch (error) {
      console.warn('Error saving tokens to storage:', error);
      // Fallback to sessionStorage
      try {
        if (this.tokens) {
          sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(this.tokens));
        }
        if (this.userData) {
          sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(this.userData));
        }
      } catch (sessionError) {
        console.error('Failed to save tokens to sessionStorage:', sessionError);
      }
    }
  }

  /**
   * Get token expiration time in milliseconds
   * @returns Expiration timestamp or null
   */
  public getTokenExpiration(): number | null {
    return this.tokens?.expiresAt || null;
  }

  /**
   * Get time until token expires in seconds
   * @returns Seconds until expiration or null
   */
  public getTimeUntilExpiration(): number | null {
    const expiresAt = this.getTokenExpiration();
    if (!expiresAt) return null;

    const timeLeft = Math.max(0, expiresAt - Date.now());
    return Math.floor(timeLeft / 1000);
  }

  /**
   * Set up automatic token refresh
   * @param beforeExpiryMs Refresh token this many ms before expiry (default: 5 minutes)
   */
  public setupAutoRefresh(beforeExpiryMs: number = 5 * 60 * 1000): void {
    const checkInterval = 60 * 1000; // Check every minute

    const intervalId = setInterval(async () => {
      if (!this.isAuthenticated()) {
        clearInterval(intervalId);
        return;
      }

      const expiresAt = this.getTokenExpiration();
      if (!expiresAt) return;

      const timeUntilExpiry = expiresAt - Date.now();
      
      if (timeUntilExpiry <= beforeExpiryMs) {
        console.log('Auto-refreshing token...');
        const newTokens = await this.refreshAccessToken();
        
        if (!newTokens) {
          console.warn('Auto-refresh failed, user needs to log in again');
          clearInterval(intervalId);
        }
      }
    }, checkInterval);

    // Store interval ID for cleanup if needed
    (globalThis as { authRefreshInterval?: number }).authRefreshInterval = intervalId;
  }
}

// Export singleton instance and convenience functions
export const authTokenManager = AuthTokenManager.getInstance();

// Convenience functions for easy access
export const getAuthToken = (): string | null => authTokenManager.getAuthToken();
export const getAuthHeader = (): string | null => authTokenManager.getAuthHeader();
export const setAuthTokens = (tokens: AuthTokens, userData?: UserTokenData['user']): void => 
  authTokenManager.setTokens(tokens, userData);
export const clearAuthTokens = (): void => authTokenManager.clearTokens();
export const isAuthenticated = (): boolean => authTokenManager.isAuthenticated();
export const getUserData = (): UserTokenData['user'] | null => authTokenManager.getUserData();
export const refreshAccessToken = (): Promise<AuthTokens | null> => authTokenManager.refreshAccessToken();

export default authTokenManager;