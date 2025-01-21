import axios from 'axios';
/**
 * Course Type Definition
 */
export interface ICourse {
  id: number;
  name: string;
  description: string;
  duration: string;
  imgUrl: string;
  title: string;
  alt: string;
}

export interface ICourseRes{
  status:string;
  data:ICourse[];  
}

/**
 * Fetch all Courses
 */
export const fetchCourses = async (): Promise<ICourseRes> => {
  try {
    const response = await axios.get<ICourseRes>(`api/courses`);
    return {...response.data};
  } catch (error) {
    console.error('Error fetching Courses:', error);
    throw new Error('Failed to fetch Courses');
  }
};

/**
 * Fetch a single Course by ID
 * @param id - The ID of the Course
 */
export const fetchCourseById = async (id: number): Promise<ICourse> => {
  try {
    const response = await axios.get<ICourse>(`api/courses/${id}`);
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
export const createCourse = async (CourseData: Partial<ICourse>): Promise<ICourse> => {
  try {
    const response = await axios.post<ICourse>(`api/courses`, CourseData);
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
  updates: Partial<ICourse>
): Promise<ICourse> => {
  try {
    const response = await axios.put<ICourse>(`api/courses/${id}`, updates);
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
