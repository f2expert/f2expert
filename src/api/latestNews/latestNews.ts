import axios from 'axios';
/**
 * latestNews Type Definition
 */
export interface latestNews {
  id: number;
  name: string;
  description: string;
  duration: string;
  image: string;
}

/**
 * Fetch all latestNews
 */
export const fetchLatestNews = async (): Promise<latestNews[]> => {
  try {
    const response = await axios.get<latestNews[]>(`http://localhost:3000/api/courses.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching latestNews:', error);
    throw new Error('Failed to fetch latestNews');
  }
};

/**
 * Fetch a single latestNews by ID
 * @param id - The ID of the latestNews
 */
export const fetchLatestNewsById = async (id: number): Promise<latestNews> => {
  try {
    const response = await axios.get<latestNews>(`api/latestNews/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching latestNews with ID ${id}:`, error);
    throw new Error('Failed to fetch latestNews');
  }
};

/**
 * Create a new latestNews
 * @param latestNewsData - Data for the new latestNews
 */
export const createLatestNews = async (latestNewsData: Partial<latestNews>): Promise<latestNews> => {
  try {
    const response = await axios.post<latestNews>(`api/latestNews`, latestNewsData);
    return response.data;
  } catch (error) {
    console.error('Error creating latestNews:', error);
    throw new Error('Failed to create latestNews');
  }
};

/**
 * Update a latestNews by ID
 * @param id - The ID of the latestNews
 * @param updates - Data to update
 */
export const updateLatestNews = async (
  id: number,
  updates: Partial<latestNews>
): Promise<latestNews> => {
  try {
    const response = await axios.put<latestNews>(`api/latestNews/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating latestNews with ID ${id}:`, error);
    throw new Error('Failed to update latestNews');
  }
};

/**
 * Delete a latestNews by ID
 * @param id - The ID of the latestNews
 */
export const deleteLatestNews = async (id: number): Promise<void> => {
  try {
    await axios.delete(`api/latestNews/${id}`);
  } catch (error) {
    console.error(`Error deleting latestNews with ID ${id}:`, error);
    throw new Error('Failed to delete latestNews');
  }
};
