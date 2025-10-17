# Tutorials API Integration

## Overview
This document describes the replacement of the courses functionality with tutorials API integration for the Topic page, using the endpoint `http://localhost:5000/api/tutorials/category/{category}?limit={limit}`.

## API Endpoint
- **URL**: `http://localhost:5000/api/tutorials/category/{category}?limit={limit}`
- **Method**: GET
- **Purpose**: Fetch filtered tutorials based on category/technology

## Implementation Details

### 1. Tutorial API Service (`src/services/tutorialApi.ts`)
- Enhanced existing service with `getTutorialsByCategory(category: string, limit: number)` method
- Added `getMockTutorialsByCategory()` for fallback mock data
- Smart filtering logic to match technology tags, categories, and tutorial properties
- Comprehensive error handling with API fallback

### 2. Redux Integration (`src/store/slices/tutorialsSlice.ts`)
- **NEW**: Created complete tutorials Redux slice
- Added `fetchTutorialsByCategory` async thunk
- Added `fetchTutorials`, `fetchTutorialById`, and `fetchFeaturedTutorials` thunks
- Proper loading, error, and pagination state management
- Integrated with main store configuration

### 3. Tutorial Card Component (`src/components/molecules/TutorialCard/`)
- **NEW**: Created dedicated TutorialCard component for displaying tutorial information
- Responsive design with tutorial image, title, description, and stats
- Shows views, likes, rating, and duration information
- Technology badges and featured/free badges
- Start tutorial functionality
- Clean separation from CourseCard component

### 4. Topic Page (`src/pages/Dashboard/Topic.tsx`)
- **COMPLETE REPLACEMENT**: Removed all courses-related functionality
- Integrated tutorials API call based on URL parameter (`/dashboard/topic/:lang`)
- Replaced CourseCard with TutorialCard components
- Updated all text references from "courses" to "tutorials"
- Maintained loading states, error handling, and empty states
- Removed enrollment functionality (replaced with start tutorial)

### 5. Store Configuration (`src/store/index.ts`)
- Added tutorials reducer to the main store
- Proper TypeScript integration with RootState

## API Response Format
```json
{
  "data": [
    {
      "_id": "1",
      "title": "Tutorial Title",
      "description": "Tutorial description",
      "shortDescription": "Brief description",
      "instructor": "Instructor Name",
      "category": "Web Development",
      "level": "Beginner",
      "duration": "2 hours",
      "totalMinutes": 120,
      "rating": 4.8,
      "views": 15420,
      "likes": 1240,
      "tags": ["HTML", "CSS", "Frontend"],
      "thumbnailUrl": "/assets/topics/tutorial.png",
      "isFeatured": true,
      // ... other tutorial properties
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

## Usage

### Navigate to Topic Page
```
/dashboard/topic/html     -> Shows HTML tutorials
/dashboard/topic/css      -> Shows CSS tutorials  
/dashboard/topic/javascript -> Shows JavaScript tutorials
```

### Tutorial Interface
```typescript
interface Tutorial {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  subCategory?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  totalMinutes: number;
  instructor: string;
  instructorBio?: string;
  thumbnailUrl: string;
  videoUrl: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  rating: number;
  views: number;
  likes: number;
  // ... other properties
}
```

## Features

### Tutorial Filtering
- Matches by category name
- Matches by technology tags  
- Matches by tutorial title
- Case-insensitive matching
- Partial matching support

### UI Components
- Loading skeletons during API calls
- Error states with retry functionality
- Empty states for no results
- Responsive tutorial cards
- Start tutorial buttons
- Free tutorial badges
- Featured tutorial indicators

### Mock Data
The service includes comprehensive mock data for testing:
- HTML Fundamentals tutorial
- CSS Styling Mastery tutorial
- JavaScript Programming for Beginners tutorial
- React Basics tutorial

## Key Differences from Courses
- **Free Content**: Tutorials are free, no pricing display
- **Views & Likes**: Shows engagement metrics instead of enrollment numbers
- **Duration**: Shows time-based duration (hours/minutes) instead of weeks
- **Steps**: Shows tutorial steps instead of lectures
- **Start Action**: "Start Tutorial" instead of "Enroll"
- **No Authentication Required**: All users can start tutorials

## Error Handling
- Network error handling
- API unavailable fallback to mock data
- User-friendly error messages
- Retry functionality
- Graceful degradation

## Redux State Structure
```typescript
interface TutorialsState {
  tutorials: Tutorial[];
  currentTutorial: Tutorial | null;
  categories: string[];
  isLoading: boolean;
  isStarting: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: TutorialFilters;
}
```

## Testing
- Mock data automatically loads when API is unavailable
- Comprehensive filtering logic for different categories
- Responsive design testing across devices
- Error state and retry functionality testing

## Next Steps
1. Connect to real backend API when available
2. Implement tutorial detail pages
3. Add tutorial progress tracking
4. Implement tutorial search functionality
5. Add advanced filtering options
6. Add tutorial playlist/series support