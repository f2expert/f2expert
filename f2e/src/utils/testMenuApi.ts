// Simple utility to test menu API connectivity
export const testMenuApi = async (role: string = 'student') => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const endpoint = `${API_BASE_URL}/api/menu?role=${role}`;
  
  console.log('🔍 Testing menu API...');
  console.log('API Base URL:', API_BASE_URL);
  console.log('Full endpoint:', endpoint);
  console.log('Testing for role:', role);
  
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Menu API Response:', data);
    
    // Check response format
    if (Array.isArray(data)) {
      console.log(`📋 Found ${data.length} menu items (direct array format)`);
      return { success: true, data, count: data.length, format: 'array' };
    } else if (data && Array.isArray(data.data)) {
      console.log(`📋 Found ${data.data.length} menu items (object with data property)`);
      return { success: true, data: data.data, count: data.data.length, format: 'object' };
    } else if (data && Array.isArray(data.menu)) {
      console.log(`📋 Found ${data.menu.length} menu items (object with menu property)`);
      return { success: true, data: data.menu, count: data.menu.length, format: 'menu_object' };
    } else {
      console.log('⚠️ Unexpected response format:', typeof data);
      return { success: false, error: 'Unexpected response format', data };
    }
  } catch (error) {
    console.error('❌ Menu API Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      endpoint 
    };
  }
};