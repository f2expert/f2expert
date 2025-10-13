// Tutorial API Service
export interface Tutorial {
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
  downloadUrl?: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  rating: number;
  views: number;
  likes: number;
  language: string;
  difficulty: number;
  prerequisites: string[];
  learningOutcomes: string[];
  resources: TutorialResource[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TutorialResource {
  _id: string;
  title: string;
  type: 'document' | 'code' | 'link' | 'image';
  url: string;
  description?: string;
}

export interface TutorialsResponse {
  data: Tutorial[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TutorialFilters {
  category?: string;
  level?: string;
  instructor?: string;
  tags?: string[];
  minDuration?: number;
  maxDuration?: number;
  search?: string;
}

// Mock API Base URL (replace with actual API endpoint)
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

// Flag to force real API calls only (set to true to disable mock data fallback)
const FORCE_REAL_API = true;

class TutorialApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Tutorial API Request URL:', url);
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          // Add auth token if needed
          // 'Authorization': `Bearer ${getAuthToken()}`,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Fetch all tutorials
  async getTutorials(filters?: TutorialFilters): Promise<TutorialsResponse> {
    const endpoint = '/tutorials';
    
    /*if (filters) {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.level) queryParams.append('level', filters.level);
      if (filters.instructor) queryParams.append('instructor', filters.instructor);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.minDuration) queryParams.append('minDuration', filters.minDuration.toString());
      if (filters.maxDuration) queryParams.append('maxDuration', filters.maxDuration.toString());
      
      const query = queryParams.toString();
      if (query) endpoint += `?${query}`;
    }*/

    try {
      console.log('Making API request to tutorials endpoint:', endpoint);
      const response = await this.makeRequest<Tutorial[] | TutorialsResponse>(endpoint);
      console.log('Tutorials API response received:', response);
      
      // Handle both array response and object response with data property
      if (Array.isArray(response)) {
        console.log('Successfully fetched tutorials as array, count:', response.length);
        return {
          data: response,
          total: response.length,
          page: 1,
          limit: response.length,
          totalPages: 1
        };
      } else if (response && response.data && Array.isArray(response.data)) {
        console.log('Successfully fetched tutorials from response.data, count:', response.data.length);
        return {
          data: response.data,
          total: response.total || response.data.length,
          page: response.page || 1,
          limit: response.limit || response.data.length,
          totalPages: response.totalPages || 1
        };
      } else {
        console.error('Invalid tutorials API response format:', response);
        throw new Error('Invalid response format from tutorials API');
      }
    } catch (error) {
      console.error('Error fetching from tutorials API:', error);
      console.log('API Base URL:', API_BASE_URL);
      console.log('Full endpoint URL:', `${API_BASE_URL}${endpoint}`);
      
      if (FORCE_REAL_API) {
        console.error('FORCE_REAL_API is enabled - throwing error instead of using mock data');
        throw new Error(`Tutorials API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      console.log('Falling back to mock data due to tutorials API error');
      return this.getMockTutorials(filters);
    }
  }

  // Fetch tutorial by ID
  async getTutorialById(id: string): Promise<Tutorial> {
    const endpoint = `/tutorials/${id}`;
    
    try {
      console.log('Fetching tutorial by ID:', id, 'from endpoint:', endpoint);
      const tutorial = await this.makeRequest<Tutorial>(endpoint);
      console.log('Tutorial fetched successfully:', tutorial);
      return tutorial;
    } catch (error) {
      console.error('Error fetching tutorial by ID:', error);
      if (FORCE_REAL_API) {
        throw new Error(`Tutorial API failed for ID ${id} and mock data is disabled`);
      }
      console.log('Falling back to mock data for tutorial ID:', id);
      // Fallback to mock data
      const mockResponse = await this.getMockTutorials();
      const tutorial = mockResponse.data.find(t => t._id === id);
      if (!tutorial) {
        throw new Error('Tutorial not found');
      }
      return tutorial;
    }
  }

  // Fetch featured tutorials
  async getFeaturedTutorials(): Promise<TutorialsResponse> {
    try {
      console.log('Fetching featured tutorials');
      // Try direct featured endpoint first
      try {
        const response = await this.makeRequest<Tutorial[] | TutorialsResponse>('/tutorials?featured=true');
        if (Array.isArray(response)) {
          return {
            data: response,
            total: response.length,
            page: 1,
            limit: response.length,
            totalPages: 1
          };
        } else if (response && response.data) {
          return response as TutorialsResponse;
        }
      } catch {
        console.log('No featured parameter support, filtering all tutorials');
      }
      
      // Fallback: Get all tutorials and filter for featured ones
      const response = await this.getTutorials();
      const featuredTutorials = response.data.filter(tutorial => tutorial.isFeatured);
      
      return {
        ...response,
        data: featuredTutorials,
        total: featuredTutorials.length
      };
    } catch (error) {
      console.error('Error fetching featured tutorials:', error);
      if (FORCE_REAL_API) {
        throw new Error('Featured tutorials API failed and mock data is disabled');
      }
      return this.getMockTutorials();
    }
  }

  // Mock data method (replace with actual API call)
  private async getMockTutorials(filters?: TutorialFilters): Promise<TutorialsResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const tutorials: Tutorial[] = [
      {
        _id: '1',
        title: 'Introduction to React Hooks',
        description: 'Learn the fundamentals of React Hooks and how to use useState, useEffect, and custom hooks in your applications. This comprehensive tutorial covers all essential hooks and best practices.',
        shortDescription: 'Learn the fundamentals of React Hooks and how to use useState, useEffect, and custom hooks in your applications.',
        category: 'Web Development',
        subCategory: 'Frontend',
        level: 'Beginner',
        duration: '45 min',
        totalMinutes: 45,
        instructor: 'Sarah Johnson',
        instructorBio: 'Senior React Developer with 5+ years of experience',
        thumbnailUrl: '/assets/topics/react-frontend.png',
        videoUrl: 'https://example.com/react-hooks-tutorial',
        downloadUrl: '/downloads/react-hooks-guide.pdf',
        tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
        isPublished: true,
        isFeatured: true,
        rating: 4.8,
        views: 1250,
        likes: 95,
        language: 'English',
        difficulty: 2,
        prerequisites: ['Basic JavaScript', 'Basic React'],
        learningOutcomes: [
          'Understand React Hooks fundamentals',
          'Use useState and useEffect effectively',
          'Create custom hooks',
          'Apply best practices'
        ],
        resources: [
          {
            _id: 'res1',
            title: 'React Hooks Cheat Sheet',
            type: 'document',
            url: '/downloads/react-hooks-cheat-sheet.pdf',
            description: 'Quick reference guide for React Hooks'
          }
        ],
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-10-01T00:00:00Z',
        __v: 0
      },
      {
        _id: '2',
        title: 'Python Data Analysis with Pandas',
        description: 'Master data manipulation and analysis using Pandas library. Perfect for beginners in data science who want to learn practical data analysis techniques.',
        shortDescription: 'Master data manipulation and analysis using Pandas library. Perfect for beginners in data science.',
        category: 'Data Science',
        subCategory: 'Data Analysis',
        level: 'Intermediate',
        duration: '60 min',
        totalMinutes: 60,
        instructor: 'Dr. Michael Chen',
        instructorBio: 'Data Scientist with PhD in Statistics',
        thumbnailUrl: '/assets/topics/python-fundamentals.png',
        videoUrl: 'https://example.com/pandas-tutorial',
        downloadUrl: '/downloads/pandas-tutorial.pdf',
        tags: ['Python', 'Pandas', 'Data Analysis', 'Data Science'],
        isPublished: true,
        isFeatured: false,
        rating: 4.9,
        views: 980,
        likes: 87,
        language: 'English',
        difficulty: 3,
        prerequisites: ['Basic Python', 'Statistics Fundamentals'],
        learningOutcomes: [
          'Master Pandas DataFrames',
          'Perform data cleaning and transformation',
          'Conduct exploratory data analysis',
          'Visualize data insights'
        ],
        resources: [],
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-09-15T00:00:00Z',
        __v: 0
      },
      {
        _id: '3',
        title: 'AWS EC2 Instance Setup',
        description: 'Step-by-step guide to setting up and configuring EC2 instances on Amazon Web Services. Learn best practices for cloud infrastructure management.',
        shortDescription: 'Step-by-step guide to setting up and configuring EC2 instances on Amazon Web Services.',
        category: 'Cloud Computing',
        subCategory: 'AWS',
        level: 'Beginner',
        duration: '35 min',
        totalMinutes: 35,
        instructor: 'Emily Rodriguez',
        instructorBio: 'AWS Certified Solutions Architect',
        thumbnailUrl: '/assets/topics/cloud.png',
        videoUrl: 'https://example.com/aws-ec2-tutorial',
        tags: ['AWS', 'EC2', 'Cloud Computing', 'Infrastructure'],
        isPublished: true,
        isFeatured: true,
        rating: 4.7,
        views: 756,
        likes: 62,
        language: 'English',
        difficulty: 2,
        prerequisites: ['Basic Cloud Concepts', 'AWS Account'],
        learningOutcomes: [
          'Launch EC2 instances',
          'Configure security groups',
          'Manage instance lifecycle',
          'Implement best practices'
        ],
        resources: [],
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-09-20T00:00:00Z',
        __v: 0
      },
      {
        _id: '4',
        title: 'React Native Mobile App Development',
        description: 'Build your first mobile app using React Native. Learn navigation, state management, and deployment to both iOS and Android platforms.',
        shortDescription: 'Build your first mobile app using React Native. Learn navigation, state management, and deployment.',
        category: 'Mobile Development',
        subCategory: 'React Native',
        level: 'Intermediate',
        duration: '90 min',
        totalMinutes: 90,
        instructor: 'James Wilson',
        instructorBio: 'Mobile App Developer specializing in React Native',
        thumbnailUrl: '/assets/topics/mobile-app-development.png',
        videoUrl: 'https://example.com/react-native-tutorial',
        downloadUrl: '/downloads/react-native-guide.pdf',
        tags: ['React Native', 'Mobile Development', 'JavaScript', 'Cross-platform'],
        isPublished: true,
        isFeatured: false,
        rating: 4.6,
        views: 645,
        likes: 54,
        language: 'English',
        difficulty: 3,
        prerequisites: ['React.js', 'JavaScript ES6', 'Mobile Development Basics'],
        learningOutcomes: [
          'Create React Native apps',
          'Implement navigation',
          'Manage app state',
          'Deploy to app stores'
        ],
        resources: [],
        createdAt: '2024-02-10T00:00:00Z',
        updatedAt: '2024-09-25T00:00:00Z',
        __v: 0
      },
      {
        _id: '5',
        title: 'JavaScript ES6+ Features',
        description: 'Explore modern JavaScript features including arrow functions, destructuring, promises, async/await, and other ES6+ enhancements that every developer should know.',
        shortDescription: 'Explore modern JavaScript features including arrow functions, destructuring, promises, and async/await.',
        category: 'Web Development',
        subCategory: 'JavaScript',
        level: 'Intermediate',
        duration: '50 min',
        totalMinutes: 50,
        instructor: 'Lisa Chen',
        instructorBio: 'Full Stack JavaScript Developer',
        thumbnailUrl: '/assets/topics/full-stack.png',
        videoUrl: 'https://example.com/es6-tutorial',
        tags: ['JavaScript', 'ES6', 'Modern JavaScript', 'Programming'],
        isPublished: true,
        isFeatured: true,
        rating: 4.8,
        views: 1100,
        likes: 92,
        language: 'English',
        difficulty: 3,
        prerequisites: ['Basic JavaScript', 'Programming Fundamentals'],
        learningOutcomes: [
          'Master ES6+ syntax',
          'Use arrow functions effectively',
          'Implement async programming',
          'Apply modern JavaScript patterns'
        ],
        resources: [],
        createdAt: '2024-02-15T00:00:00Z',
        updatedAt: '2024-09-30T00:00:00Z',
        __v: 0
      },
      {
        _id: '6',
        title: 'Machine Learning Basics with Python',
        description: 'Introduction to machine learning concepts and implementation using Python and scikit-learn. Perfect starting point for aspiring data scientists.',
        shortDescription: 'Introduction to machine learning concepts and implementation using Python and scikit-learn.',
        category: 'Data Science',
        subCategory: 'Machine Learning',
        level: 'Beginner',
        duration: '75 min',
        totalMinutes: 75,
        instructor: 'Dr. Anita Patel',
        instructorBio: 'Machine Learning Researcher and Data Scientist',
        thumbnailUrl: '/assets/topics/machine-learning.png',
        videoUrl: 'https://example.com/ml-basics-tutorial',
        downloadUrl: '/downloads/ml-basics.pdf',
        tags: ['Machine Learning', 'Python', 'Scikit-learn', 'Data Science'],
        isPublished: true,
        isFeatured: false,
        rating: 4.9,
        views: 890,
        likes: 78,
        language: 'English',
        difficulty: 2,
        prerequisites: ['Python Programming', 'Basic Statistics', 'Mathematics'],
        learningOutcomes: [
          'Understand ML fundamentals',
          'Implement basic algorithms',
          'Evaluate model performance',
          'Apply ML best practices'
        ],
        resources: [],
        createdAt: '2024-02-20T00:00:00Z',
        updatedAt: '2024-10-05T00:00:00Z',
        __v: 0
      }
    ];

    // Apply filters if provided
    let filteredTutorials = tutorials;
    if (filters) {
      if (filters.category && filters.category !== 'all') {
        filteredTutorials = filteredTutorials.filter(t => 
          t.category.toLowerCase().replace(/\s+/g, '-') === filters.category
        );
      }
      if (filters.level) {
        filteredTutorials = filteredTutorials.filter(t => t.level === filters.level);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTutorials = filteredTutorials.filter(t =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower) ||
          t.instructor.toLowerCase().includes(searchLower)
        );
      }
    }

    return {
      data: filteredTutorials,
      total: filteredTutorials.length,
      page: 1,
      limit: filteredTutorials.length,
      totalPages: 1
    };
  }


}

// Export singleton instance
export const tutorialApiService = new TutorialApiService();
export default tutorialApiService;