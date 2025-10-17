// Simple utility to test login API connectivity
export const testLoginApi = async (email: string = 'test@example.com', password: string = 'password123') => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/';
  const endpoint = `${API_BASE_URL}users/login`;
  
  console.log('🔐 Testing login API...');
  console.log('API Base URL:', API_BASE_URL);
  console.log('Full endpoint:', endpoint);
  console.log('Test credentials:', { email, password: '***' });
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    
    const data = await response.json();
    console.log('Raw API response:', data);
    
    if (!response.ok) {
      console.log('❌ Login API Error:', data);
      return { 
        success: false, 
        error: data.message || data.error || `HTTP ${response.status}`,
        status: response.status,
        data 
      };
    }
    
    // Check response format
    if (data.token && data.user) {
      console.log('✅ Login API Success - Valid response format');
      console.log('User:', data.user);
      console.log('Token present:', !!data.token);
      return { success: true, data, user: data.user, token: data.token };
    } else {
      console.log('⚠️ Login API - Unexpected response format');
      return { success: false, error: 'Invalid response format', data };
    }
  } catch (error) {
    console.error('❌ Login API Network Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error',
      endpoint 
    };
  }
};