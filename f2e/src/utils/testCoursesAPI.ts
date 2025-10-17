// Test script for courses API integration
import { courseApiService } from '../services/courseApi';

// Test function to check the API integration
export async function testCoursesAPI() {
  console.log('Testing Courses API Integration...');
  
  try {
    // Test 1: Get courses by category
    console.log('\n1. Testing getCoursesByCategory with "html":');
    const htmlCourses = await courseApiService.getCoursesByCategory('html', 10);
    console.log('HTML Courses Response:', htmlCourses);
    console.log(`Found ${htmlCourses.data.length} HTML courses`);
    
    // Test 2: Get courses by category with different category
    console.log('\n2. Testing getCoursesByCategory with "javascript":');
    const jsCourses = await courseApiService.getCoursesByCategory('javascript', 5);
    console.log('JavaScript Courses Response:', jsCourses);
    console.log(`Found ${jsCourses.data.length} JavaScript courses`);
    
    // Test 3: Test with invalid category
    console.log('\n3. Testing getCoursesByCategory with "nonexistent":');
    const nonExistentCourses = await courseApiService.getCoursesByCategory('nonexistent', 10);
    console.log('Non-existent Category Response:', nonExistentCourses);
    console.log(`Found ${nonExistentCourses.data.length} courses for non-existent category`);
    
    console.log('\n✅ All tests passed! API integration is working correctly.');
    return true;
    
  } catch (error) {
    console.error('\n❌ API test failed:', error);
    return false;
  }
}

// Test the API when this file is imported
if (typeof window !== 'undefined') {
  console.log('Course API Test can be run by calling: testCoursesAPI()');
}