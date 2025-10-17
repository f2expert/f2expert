# Courses API Integration

## Overview
This document describes the integration of the courses API endpoint for filtering and displaying courses based on selected topics.

## API Endpoint
- **URL**: `http://localhost:5000/api/courses/category/{category}?limit={limit}`
- **Method**: GET
- **Purpose**: Fetch filtered courses based on category/technology

## Implementation Details

### 1. Course API Service (`src/services/courseApi.ts`)
- Added `getCoursesByCategory(category: string, limit: number)` method
- Enhanced mock data with HTML, CSS, JavaScript courses
- Improved filtering logic to match technology tags and course properties
- Fallback to mock data if API is unavailable

### 2. Redux Integration (`src/store/slices/coursesSlice.ts`)
- Added `fetchCoursesByCategory` async thunk
- Added proper Redux state management for category-based course fetching
- Error handling and loading states

### 3. Course Card Component (`src/components/molecules/CourseCard/`)
- Created reusable CourseCard component for displaying course information
- Responsive design with course image, title, description, stats
- Enrollment functionality integration
- Technology badges and pricing display

### 4. Topic Page (`src/pages/Dashboard/Topic.tsx`)
- Integrated API call based on URL parameter (`/dashboard/topic/:lang`)
- Comprehensive error handling and loading states
- Empty state handling for no courses found
- Grid layout for course display

### 5. CSS Utilities (`src/index.css`)
- Added line-clamp utilities for text truncation
- Support for 1, 2, and 3 line text limiting

## Usage

### Navigate to Topic Page
```
/dashboard/topic/html     -> Shows HTML courses
/dashboard/topic/css      -> Shows CSS courses  
/dashboard/topic/javascript -> Shows JavaScript courses
```

### API Response Format
```json
{
  "data": [
    {
      "_id": "1",
      "title": "Course Title",
      "description": "Course description",
      "instructor": "Instructor Name",
      "category": "Web Development",
      "technologies": ["HTML", "CSS"],
      "price": 299,
      "rating": 4.7,
      // ... other course properties
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

## Features

### Course Filtering
- Matches by category name
- Matches by technology tags  
- Matches by course title
- Case-insensitive matching
- Partial matching support

### UI Components
- Loading skeletons during API calls
- Error states with retry functionality
- Empty states for no results
- Responsive course cards
- Enrollment buttons for authenticated users

### Mock Data
The service includes comprehensive mock data for testing:
- HTML & CSS Fundamentals course
- JavaScript Programming Masterclass
- Full Stack Web Development course
- Data Science & Machine Learning course

## Error Handling
- Network error handling
- API unavailable fallback to mock data
- User-friendly error messages
- Retry functionality

## Testing
Use the test utility at `src/utils/testCoursesAPI.ts` to verify API integration:

```javascript
import { testCoursesAPI } from './utils/testCoursesAPI';
testCoursesAPI(); // Run in browser console
```

## Next Steps
1. Connect to real backend API when available
2. Add pagination support
3. Implement advanced filtering options
4. Add course search functionality
5. Implement course detail pages