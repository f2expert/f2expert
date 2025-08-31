import axios from 'axios';
/**
 * Course Type Definition
 */
export interface Course {
  id: number;
  name: string;
  description: string;
  duration: string;
  image: string;
  alt: string;
  title: string;
}

/**
 * Fetch all Courses
 */
export const fetchCourses = async (): Promise<Course[]> => {
  try {
    const response = await axios.get<Course[]>(`http://localhost:3000/api/courses.json`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching Courses: ${error}`);
  }
};

/**
 * Fetch a single Course by ID
 * @param id - The ID of the Course
 */
export const fetchCourseById = async (id: number): Promise<Course> => {
  try {
    const response = await axios.get<Course>(`api/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Course with ID ${id}:`, error);
    throw new Error('Failed to fetch Course');
  }
};

/**
 * Create a new Course
 * @param CourseData - Data for the new Course
 */
export const createCourse = async (CourseData: Partial<Course>): Promise<Course> => {
  try {
    const response = await axios.post<Course>(`api/courses`, CourseData);
    return response.data;
  } catch (error) {
    console.error('Error creating Course:', error);
    throw new Error('Failed to create Course');
  }
};

/**
 * Update a Course by ID
 * @param id - The ID of the Course
 * @param updates - Data to update
 */
export const updateCourse = async (
  id: number,
  updates: Partial<Course>
): Promise<Course> => {
  try {
    const response = await axios.put<Course>(`api/courses/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating Course with ID ${id}:`, error);
    throw new Error('Failed to update Course');
  }
};

/**
 * Delete a Course by ID
 * @param id - The ID of the Course
 */
export const deleteCourse = async (id: number): Promise<void> => {
  try {
    await axios.delete(`api/courses/${id}`);
  } catch (error) {
    console.error(`Error deleting Course with ID ${id}:`, error);
    throw new Error('Failed to delete Course');
  }
};
