// Tutorial API Debug Utility
import { tutorialApiService } from '../services/tutorialApi';

export const debugTutorialApi = async () => {
  console.log('=== TUTORIAL API DEBUG START ===');
  
  // Check environment variables
  console.log('Environment variables:');
  console.log('- VITE_API_URL:', import.meta.env?.VITE_API_URL);
  console.log('- NODE_ENV:', import.meta.env?.NODE_ENV);
  
  // Check what the API base URL resolves to
  const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
  console.log('- Resolved API_BASE_URL:', API_BASE_URL);
  
  // Test basic connectivity
  console.log('\nTesting API connectivity...');
  
  try {
    const response = await fetch(API_BASE_URL + '/health', { method: 'GET' });
    console.log('Health check response status:', response.status);
    console.log('Health check response ok:', response.ok);
  } catch (error) {
    console.error('Health check failed:', error);
  }
  
  // Test tutorials endpoint specifically
  console.log('\nTesting tutorials endpoint...');
  
  try {
    const tutorialResponse = await tutorialApiService.getTutorials();
    console.log('Tutorials response:', tutorialResponse);
    console.log('Number of tutorials:', tutorialResponse.data.length);
    console.log('First tutorial:', tutorialResponse.data[0]);
  } catch (error) {
    console.error('Tutorials API failed:', error);
  }
  
  console.log('=== TUTORIAL API DEBUG END ===');
};

// Auto-run debug when this file is imported in development
if (import.meta.env?.NODE_ENV === 'development') {
  console.log('Tutorial API debug utility loaded. Call debugTutorialApi() to run diagnostics.');
}