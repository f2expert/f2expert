import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchCourses,
  fetchCourseById,
  fetchEnrolledCourses,
  fetchCategories,
  enrollInCourse,
  updateCourseProgress,
  setFilters,
  clearFilters,
  setCurrentCourse,
  clearError
} from '../store/slices/coursesSlice';
import type { CourseFilters, CourseDetails } from '../services/courseApi';

export const useCourses = () => {
  const dispatch = useAppDispatch();
  const {
    courses,
    enrolledCourses,
    currentCourse,
    categories,
    isLoading,
    isEnrolling,
    error,
    pagination,
    filters
  } = useAppSelector(state => state.courses);

  // Fetch courses with filters
  const loadCourses = useCallback((courseFilters?: CourseFilters) => {
    const filtersToUse = courseFilters || filters;
    dispatch(fetchCourses(filtersToUse));
  }, [dispatch, filters]);

  // Load initial courses on mount
  useEffect(() => {
    if (!courses || courses.length === 0) {
      loadCourses();
    }
  }, [courses, loadCourses]);

  // Load categories on mount
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [categories, dispatch]);

  // Fetch course by ID
  const loadCourseById = useCallback((courseId: string) => {
    dispatch(fetchCourseById(courseId));
  }, [dispatch]);

  // Fetch enrolled courses
  const loadEnrolledCourses = useCallback(() => {
    dispatch(fetchEnrolledCourses());
  }, [dispatch]);

  // Enroll in course
  const enroll = useCallback(async (courseId: string) => {
    try {
      const result = await dispatch(enrollInCourse(courseId)).unwrap();
      return { success: true, course: result };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  // Update progress
  const updateProgress = useCallback(async (courseId: string, lessonId: string, progress: number) => {
    try {
      await dispatch(updateCourseProgress({ courseId, lessonId, progress })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  // Filter management
  const updateFilters = useCallback((newFilters: Partial<CourseFilters>) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Course management
  const selectCourse = useCallback((course: CourseDetails) => {
    dispatch(setCurrentCourse(course));
  }, [dispatch]);

  const clearCurrentCourse = useCallback(() => {
    dispatch(setCurrentCourse(null));
  }, [dispatch]);

  // Error management
  const clearCourseError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Search functionality
  const searchCourses = useCallback((searchTerm: string) => {
    const searchFilters: CourseFilters = {
      ...filters,
      search: searchTerm,
      page: 1
    };
    dispatch(setFilters(searchFilters));
    dispatch(fetchCourses(searchFilters));
  }, [dispatch, filters]);

  // Pagination
  const goToPage = useCallback((page: number) => {
    const paginationFilters: CourseFilters = {
      ...filters,
      page
    };
    dispatch(setFilters(paginationFilters));
    dispatch(fetchCourses(paginationFilters));
  }, [dispatch, filters]);

  return {
    // State
    courses: courses || [],
    enrolledCourses: enrolledCourses || [],
    currentCourse,
    categories,
    isLoading,
    isEnrolling,
    error,
    pagination: pagination || { page: 1, totalPages: 0, total: 0, limit: 10 },
    filters: filters || {},
    
    // Actions
    loadCourses,
    loadCourseById,
    loadEnrolledCourses,
    enroll,
    updateProgress,
    
    // Filter actions
    updateFilters,
    resetFilters,
    searchCourses,
    
    // Course actions
    selectCourse,
    clearCurrentCourse,
    
    // Utility actions
    clearCourseError,
    goToPage
  };
};

export default useCourses;