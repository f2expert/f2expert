// Menu API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface MenuItem {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  children?: {
    title: string;
    url: string;
    contentId?: string;
  }[];
}

export interface MenuResponse {
  success: boolean;
  message?: string;
  data: MenuItem[];
  // Support for direct array response
  menu?: MenuItem[];
}

class MenuApiService {
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making menu API request to:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const contentType = response.headers.get('content-type');
    console.log('Menu API response status:', response.status, 'Content-Type:', contentType);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
      } catch {
        // Use default error message if parsing fails
      }
      
      throw new Error(errorMessage);
    }

    if (!contentType?.includes('application/json')) {
      throw new Error('Expected JSON response from menu API');
    }

    const data = await response.json();
    console.log('Menu API response data:', data);
    return data;
  }

  // Fetch menu items by user role
  async getMenuByRole(role: string): Promise<MenuItem[]> {
    try {
      console.log('Fetching menu for role:', role);
      
      const response = await this.makeRequest<MenuResponse>(`/api/menu?role=${role}&tree=true`);

      // Handle various response formats
      let menuItems: MenuItem[] = [];

      if (Array.isArray(response)) {
        // Direct array response
        menuItems = response;
      } else if (response.data && Array.isArray(response.data)) {
        // Response with data property
        menuItems = response.data;
      } else if (response.menu && Array.isArray(response.menu)) {
        // Response with menu property
        menuItems = response.menu;
      } else {
        console.warn('Unexpected menu API response format:', response);
        return [];
      }

      console.log('Successfully fetched menu items:', menuItems);
      return menuItems;
      
    } catch (error) {
      console.error('Menu API error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch menu data');
    }
  }

  // Fetch menu for current user (if token is available)
  async getUserMenu(): Promise<MenuItem[]> {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        console.warn('No authentication data found, using default role');
        return this.getMenuByRole('student');
      }

      const userData = JSON.parse(user);
      const userRole = userData.role || 'student';
      
      return this.getMenuByRole(userRole);
    } catch (error) {
      console.error('Error getting user menu:', error);
      // Fallback to student role
      return this.getMenuByRole('student');
    }
  }
}

export const menuApiService = new MenuApiService();